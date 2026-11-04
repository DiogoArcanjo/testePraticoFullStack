import { app } from './app'
import { env } from './env'

app.listen(env.PORT, () => {
  console.log(`API rodando em http://localhost:${env.PORT}`)
})