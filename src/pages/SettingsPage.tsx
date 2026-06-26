import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Toggle from '../components/ui/Toggle'
import Spinner from '../components/ui/Spinner'
import api from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import type { Customer } from '../types/api'

const CHECK_TIMES = ['05:00', '06:00', '07:00', '08:00', '09:00']

export default function SettingsPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer'],
    queryFn: () => api.get<Customer>('/api/me').then((r) => r.data),
  })

  const [alertEmail, setAlertEmail] = useState('')
  const [checkTimeUtc, setCheckTimeUtc] = useState('06:00')
  const [notifyOnGap, setNotifyOnGap] = useState(true)
  const [notifyOnMapping, setNotifyOnMapping] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (customer) {
      setAlertEmail(customer.alertEmail ?? customer.email)
      setCheckTimeUtc(customer.checkTimeUtc ?? '06:00')
      setNotifyOnGap(customer.notifyOnGap)
      setNotifyOnMapping(customer.notifyOnMapping)
    }
  }, [customer])

  const saveMutation = useMutation({
    mutationFn: () =>
      api.put('/api/me', { alertEmail, checkTimeUtc, notifyOnGap, notifyOnMapping }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer'] })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete('/api/me'),
    onSuccess: async () => {
      await signOut()
      navigate('/', { replace: true })
    },
  })

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl p-6 space-y-6">
        <h1 className="text-xl font-bold text-[#e2e8f0]">Einstellungen</h1>

        {/* Notification settings */}
        <Card>
          <h2 className="mb-5 font-semibold text-[#e2e8f0]">Benachrichtigungen</h2>

          <div className="space-y-5">
            <Input
              label="Alert-E-Mail"
              type="email"
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              hint="Alerts werden an diese Adresse gesendet."
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#e2e8f0]">Tägliche Prüfzeit</label>
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
                Die Prüfzeit ist in UTC. Für Mitteleuropa (MEZ/MESZ) +1/+2 Stunden einrechnen.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Toggle
                checked={notifyOnGap}
                onChange={setNotifyOnGap}
                label="Alert bei Verfügbarkeitslücken (gap)"
              />
              <Toggle
                checked={notifyOnMapping}
                onChange={setNotifyOnMapping}
                label="Alert bei Abweichungen (mapping)"
              />
            </div>
          </div>

          {saveSuccess && (
            <div className="mt-4 rounded-lg border border-green-800/40 bg-green-900/20 px-4 py-3 text-sm text-green-400">
              Einstellungen gespeichert.
            </div>
          )}

          {saveMutation.isError && (
            <div className="mt-4 rounded-lg border border-red-800/60 bg-red-900/20 px-4 py-3 text-sm text-red-400">
              Fehler beim Speichern. Bitte versuchen Sie es erneut.
            </div>
          )}

          <Button
            onClick={() => saveMutation.mutate()}
            loading={saveMutation.isPending}
            className="mt-5"
          >
            Einstellungen speichern
          </Button>
        </Card>

        {/* Account info */}
        <Card>
          <h2 className="mb-4 font-semibold text-[#e2e8f0]">Konto</h2>
          <div className="space-y-2 text-sm text-[#8b98a9]">
            <div className="flex items-center justify-between">
              <span>E-Mail</span>
              <span className="text-[#e2e8f0]">{customer?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="text-[#e2e8f0] capitalize">{customer?.status}</span>
            </div>
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-900/40">
          <h2 className="mb-2 font-semibold text-red-400">Gefahrenzone</h2>
          <p className="mb-4 text-sm text-[#8b98a9]">
            Das Löschen Ihres Kontos entfernt alle Ihre Daten unwiderruflich (DSGVO Art. 17).
            Dieser Vorgang kann nicht rückgängig gemacht werden.
          </p>

          {!deleteConfirm ? (
            <Button variant="danger" onClick={() => setDeleteConfirm(true)}>
              Konto löschen
            </Button>
          ) : (
            <div className="space-y-3 rounded-lg border border-red-800/40 bg-red-900/10 p-4">
              <p className="text-sm font-medium text-red-400">
                Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={() => deleteMutation.mutate()}
                  loading={deleteMutation.isPending}
                >
                  Ja, Konto endgültig löschen
                </Button>
                <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>
                  Abbrechen
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
