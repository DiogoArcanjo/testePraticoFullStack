import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError } from '../services/api'
import type { UserInput } from '../services/userService'

type FormErrors = {
  name?: string
  email?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: UserInput): FormErrors {
  const errors: FormErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()

  if (!name) {
    errors.name = 'Informe o nome.'
  }

  if (!email) {
    errors.email = 'Informe o email.'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Informe um email válido, como nome@exemplo.com.'
  }

  return errors
}

type UserFormProps = {
  initialValues?: UserInput
  submitLabel: string
  onSubmit: (values: UserInput) => Promise<void>
}

function UserForm({
  initialValues = { name: '', email: '' },
  submitLabel,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = useState<UserInput>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(field: keyof UserInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setFormError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const newErrors = validate(values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    setFormError('')

    try {
      await onSubmit(values)
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors({ email: 'Este email já está cadastrado.' })
      } else if (error instanceof ApiError) {
        setFormError(error.message)
      } else {
        setFormError('Não foi possível salvar. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(event) => handleChange('name', event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(event) => handleChange('email', event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {formError && <p role="alert">{formError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}

export default UserForm