import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import api from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch {
      // Backend antwortet immer mit ok:true, unabhängig davon ob die E-Mail existiert
      setSent(true)
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
          {sent ? (
            <>
              <h2 className="mb-3 text-lg font-semibold text-[#e2e8f0]">E-Mail unterwegs</h2>
              <p className="mb-6 text-sm text-[#8b98a9]">
                Falls ein Konto zu <strong className="text-[#e2e8f0]">{email}</strong> existiert,
                haben wir einen Link zum Zurücksetzen des Passworts gesendet.
              </p>
              <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
                Zurück zur Anmeldung
              </Link>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-lg font-semibold text-[#e2e8f0]">Passwort vergessen</h2>
              <p className="mb-6 text-sm text-[#8b98a9]">
                Wir senden Ihnen einen Link zum Zurücksetzen des Passworts.
              </p>

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

                {error && (
                  <div className="rounded-lg border border-red-800/60 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <Button type="submit" loading={loading} className="w-full">
                  Link senden
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
