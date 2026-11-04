import { createReadStream, existsSync, writeFileSync } from 'node:fs'
import { createGunzip } from 'node:zlib'
import { parse } from 'csv-parse'
import { pool } from '../src/db'
import { createUserSchema } from '../src/users/userSchemas'

const BATCH_SIZE = 500
const filePath = process.argv[2] ?? 'data/users.csv.gz'
const reportPath = 'data/import-report.json'

type ValidUser = { name: string; email: string }

const report = {
  read: 0,
  imported: 0,
  invalid: 0,
  duplicatedInFile: 0,
  alreadyInDatabase: 0,
}
const invalidRows: { line: number; reasons: string[] }[] = []

async function insertBatch(batch: ValidUser[]) {
  if (batch.length === 0) return

  const placeholders: string[] = []
  const params: string[] = []
  batch.forEach((user, index) => {
    placeholders.push(`($${index * 2 + 1}, $${index * 2 + 2})`)
    params.push(user.name, user.email)
  })

  const result = await pool.query(
    `INSERT INTO users (name, email) VALUES ${placeholders.join(', ')}
     ON CONFLICT (email) DO NOTHING`,
    params,
  )

  const inserted = result.rowCount ?? 0
  report.imported += inserted
  report.alreadyInDatabase += batch.length - inserted
}

async function main() {
  if (!existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`)
    process.exitCode = 1
    return
  }

  const startedAt = Date.now()
  const seenEmails = new Set<string>()
  let batch: ValidUser[] = []

  const parser = createReadStream(filePath)
    .pipe(createGunzip())
    .pipe(parse({ columns: true, trim: true, skip_empty_lines: true, bom: true, info: true }))

  for await (const { record, info } of parser) {
    report.read++

    if (report.read === 1 && !('name' in record && 'email' in record)) {
      throw new Error('O CSV precisa ter as colunas "name" e "email" no cabeçalho.')
    }

    const parsed = createUserSchema.safeParse({ name: record.name, email: record.email })

    if (!parsed.success) {
      report.invalid++
      invalidRows.push({
        line: info.lines,
        reasons: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      })
      continue
    }

    if (seenEmails.has(parsed.data.email)) {
      report.duplicatedInFile++
      continue
    }
    seenEmails.add(parsed.data.email)

    batch.push(parsed.data)
    if (batch.length >= BATCH_SIZE) {
      await insertBatch(batch)
      batch = []
    }
  }

  await insertBatch(batch)

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(2)
  writeFileSync(reportPath, JSON.stringify({ ...report, seconds, invalidRows }, null, 2))

  console.log(`Importação concluída em ${seconds}s`)
  console.log(`- Linhas lidas:            ${report.read}`)
  console.log(`- Importadas:              ${report.imported}`)
  console.log(`- Inválidas:               ${report.invalid}`)
  console.log(`- Duplicadas no arquivo:   ${report.duplicatedInFile}`)
  console.log(`- Já existentes no banco:  ${report.alreadyInDatabase}`)
  console.log(`Detalhes das linhas inválidas em ${reportPath}`)
}

main()
  .catch((error) => {
    console.error('Falha na importação:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())