import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Spinner from '../../components/ui/Spinner'
import api from '../../lib/api'
import type { Customer } from '../../types/api'

interface Props {
  onDone: () => void
}

const CHECK_TIMES = ['05:00', '06:00', '07:00', '08:00', '09:00']

export default function Step4Settings({ onDone }: Props) {
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer'],
    queryFn: () => api.get<Customer>('/api/me').then((r) => r.data),
  })

  const [alertEmail, setAlertEmail] = useState('')
  const [checkTimeUtc, setCheckTimeUtc] = useState('06:00')
  const [notifyOnGap, setNotifyOnGap] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Initialize from customer data once loaded
  if (customer && !initialized) {
    setAlertEmail(customer.alertEmail ?? customer.email)
    setCheckTimeUtc(customer.checkTimeUtc ?? '06:00')
    setInitialized(true)
  }

  const handleComplete = async () => {
    setSaving(true)
    setError('')
    try {
      await api.put('/api/me', { alertEmail, checkTimeUtc, notifyOnGap })
      onDone()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(
        axiosErr?.response?.data?.message ?? 'Fehler beim Speichern. Bitte versuchen Sie es erneut.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold text-[#e2e8f0]">Einstellungen</h2>
      <p className="mb-6 text-sm text-[#8b98a9]">
        Fast fertig! Wählen Sie wann STR Watchdog täglich prüft und wohin Alerts gesendet werden.
      </p>

      <div className="space-y-5">
        <Input
          label="Alert-E-Mail"
          type="email"
          value={alertEmail}
          onChange={(e) => setAlertEmail(e.target.value)}
          hint="An diese Adresse werden Benachrichtigungen bei Problemen gesendet."
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#e2e8f0]">Tägliche Prüfzeit (UTC)</label>
          <select
            value={checkTimeUtc}
            onChange={(e) => setCheckTimeUtc(e.target.value)}
            className="w-full rounded-lg border border-[#2d3447] bg-[#161b27] px-3 py-2.5 text-sm text-[#e2e8f0] focus:border-blue-500 focus:outline-none"
          >
            {CHECK_TIMES.map((t) => (
              <option key={t} value={t}>
                {t} Uhr (UTC)
              </option>
            ))}
          </select>
          <p className="text-xs text-[#5a6478]">
            Für Mitteleuropa (MEZ) +1 Stunde, Sommerzeit (MESZ) +2 Stunden einrechnen.
          </p>
        </div>

        <Toggle
          checked={notifyOnGap}
          onChange={setNotifyOnGap}
          label="Sofort benachrichtigen wenn ein Objekt nicht sichtbar ist"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-800/60 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button onClick={handleComplete} loading={saving} className="mt-6 w-full" size="lg">
        Einrichtung abschließen
      </Button>

      <p className="mt-3 text-center text-xs text-[#5a6478]">
        Sie werden zum Dashboard weitergeleitet. Die erste Prüfung startet zur gewählten Uhrzeit.
      </p>
    </Card>
  )
}
