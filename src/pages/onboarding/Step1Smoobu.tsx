import { useState, FormEvent } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import api from '../../lib/api'
import type { SmoobuApartment } from '../../types/api'

interface Props {
  onDone: () => void
}

export default function Step1Smoobu({ onDone }: Props) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [apartments, setApartments] = useState<SmoobuApartment[] | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post<{ valid: boolean; apartments: SmoobuApartment[] }>(
        '/api/smoobu/validate',
        { apiKey },
      )
      setApartments(data.apartments)
      // Small delay so user sees the success state before advancing
      setTimeout(onDone, 800)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(
        axiosErr?.response?.data?.message ??
          'Der API-Key ist ungültig. Bitte prüfen Sie Ihre Eingabe.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold text-[#e2e8f0]">Smoobu verbinden</h2>
      <p className="mb-6 text-sm text-[#8b98a9]">
        Geben Sie Ihren Smoobu API-Key ein. Diesen finden Sie in Ihrem Smoobu-Account unter{' '}
        <strong className="text-[#e2e8f0]">Einstellungen → API</strong>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Smoobu API-Key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Ihr API-Key"
          required
          autoComplete="off"
        />

        {error && (
          <div className="rounded-lg border border-red-800/60 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {apartments && (
          <div className="rounded-lg border border-green-800/40 bg-green-900/20 px-4 py-3 text-sm text-green-400">
            ✓ Verbindung erfolgreich. {apartments.length} Objekte gefunden.
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Verbindung prüfen & weiter
        </Button>
      </form>
    </Card>
  )
}
