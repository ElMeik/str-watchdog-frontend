import { useState, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye } from 'lucide-react'
import api from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

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
    if (!token) {
      setError('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen an.')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Zurücksetzen fehlgeschlagen. Der Link ist möglicherweise abgelaufen.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#e2e8f0]">STR Watchdog</h1>
        </div>

        <div className="rounded-xl border border-[#2d3447] bg-[#1c2333] p-6">
          {done ? (
            <p className="text-center text-sm text-[#8b98a9]">
              Passwort geändert. Sie werden zur Anmeldung weitergeleitet…
            </p>
          ) : (
            <>
              <h2 className="mb-6 text-lg font-semibold text-[#e2e8f0]">Neues Passwort</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Neues Passwort"
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
                  Passwort ändern
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-[#8b98a9]">
                <Link to="/login" className="text-blue-400 hover:text-blue-300">
                  Zurück zur Anmeldung
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
