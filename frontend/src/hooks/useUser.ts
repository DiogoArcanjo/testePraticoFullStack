import { useEffect, useState } from 'react'
import { getUser } from '../services/userService'
import type { User } from '../types/user'

type Status = 'loading' | 'success' | 'not-found' | 'error'

export function useUser(id: string | undefined) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!id) {
      setStatus('not-found')
      return
    }

    let ignore = false
    setStatus('loading')

    getUser(id)
      .then((result) => {
        if (ignore) return
        setUser(result)
        setStatus(result ? 'success' : 'not-found')
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [id])

  return { user, status }
}