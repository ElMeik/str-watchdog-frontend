import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import api, { AUTH_TOKEN_KEY } from '../lib/api'

interface Customer {
  id: string
  email: string
  status: string
  createdAt: string
}

interface AuthContextType {
  user: Customer | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthResponse {
  token: string
  customer: Customer
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get<{ customer: Customer }>('/auth/me')
      .then(({ data }) => setUser(data.customer))
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    setUser(data.customer)
  }

  const signUp = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password })
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    setUser(data.customer)
  }

  const signOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
