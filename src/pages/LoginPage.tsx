import { useState, FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import api from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import type { OnboardingStatus } from '../types/api'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)

      // Determine where to send the user
      const { data } = await api.get<OnboardingStatus>('/api/onboarding/status')
      if (data.step !== 'complete') {
        navigate('/onboarding', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Zugangsdaten.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#e2e8f0]">STR Watchdog</h1>
        </div>

        <div className="rounded-xl border border-[#2d3447] bg-[#1c2333] p-6">
          <h2 className="mb-6 text-lg font-semibold text-[#e2e8f0]">Anmelden</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-Mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre@email.de"
              required
              autoComplete="email"
            />
            <Input
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <p className="text-right text-sm">
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Passwort vergessen?
              </Link>
            </p>

            {error && (
              <div className="rounded-lg border border-red-800/60 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Anmelden
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[#8b98a9]">
            Noch kein Konto?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Kostenlos registrieren
            </Link>
          </p>
        </div>

        {/* DSGVO footer */}
        <p className="mt-6 text-center text-xs text-[#5a6478]">
          <Link to="/impressum" className="hover:text-[#8b98a9]">
            Impressum
          </Link>{' '}
          ·{' '}
          <Link to="/datenschutz" className="hover:text-[#8b98a9]">
            Datenschutz
          </Link>
        </p>
      </div>
    </div>
  )
}
