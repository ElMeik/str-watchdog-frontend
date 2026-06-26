import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }
    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      navigate('/onboarding', { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
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
          <h2 className="mb-2 text-lg font-semibold text-[#e2e8f0]">Konto erstellen</h2>
          <p className="mb-6 text-sm text-[#8b98a9]">14 Tage kostenlos, keine Kreditkarte.</p>

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
              placeholder="Mindestens 8 Zeichen"
              required
              autoComplete="new-password"
            />
            <Input
              label="Passwort bestätigen"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="rounded-lg border border-red-800/60 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Konto erstellen
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[#8b98a9]">
            Bereits registriert?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Anmelden
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#5a6478]">
          Mit der Registrierung stimmen Sie unserer{' '}
          <Link to="/datenschutz" className="hover:text-[#8b98a9]">
            Datenschutzerklärung
          </Link>{' '}
          zu.{' '}
          <Link to="/impressum" className="hover:text-[#8b98a9]">
            Impressum
          </Link>
        </p>
      </div>
    </div>
  )
}
