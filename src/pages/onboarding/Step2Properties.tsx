import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import api from '../../lib/api'
import type { SmoobuApartment } from '../../types/api'

interface Props {
  onDone: () => void
}

export default function Step2Properties({ onDone }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { data: apartments, isLoading } = useQuery({
    queryKey: ['smoobu-apartments'],
    queryFn: () => api.get<SmoobuApartment[]>('/api/smoobu/apartments').then((r) => r.data),
  })

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSave = async () => {
    if (selected.size === 0) {
      setError('Bitte wählen Sie mindestens ein Objekt aus.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const aptsMap = Object.fromEntries((apartments ?? []).map((a) => [a.id, a]))
      await Promise.all(
        Array.from(selected).map((id) =>
          api.post('/api/properties', {
            smoobuApartmentId: id,
            name: aptsMap[id]?.name ?? `Objekt ${id}`,
          }),
        ),
      )
      onDone()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(
        axiosErr?.response?.data?.message ??
          'Fehler beim Speichern. Bitte versuchen Sie es erneut.',
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
      <h2 className="mb-2 text-lg font-semibold text-[#e2e8f0]">Ihre Objekte</h2>
      <p className="mb-6 text-sm text-[#8b98a9]">
        Wählen Sie aus, welche Objekte Sie überwachen möchten.
      </p>

      {!apartments || apartments.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#8b98a9]">
          Keine Objekte in Ihrem Smoobu-Konto gefunden.
        </p>
      ) : (
        <div className="mb-6 space-y-2">
          {apartments.map((apt) => (
            <label
              key={apt.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                selected.has(apt.id)
                  ? 'border-blue-600/60 bg-blue-900/10'
                  : 'border-[#2d3447] hover:border-[#3d4557]'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.has(apt.id)}
                onChange={() => toggle(apt.id)}
                className="mt-0.5 h-4 w-4 rounded border-[#2d3447] bg-[#161b27] accent-blue-600"
              />
              <div>
                <p className="font-medium text-[#e2e8f0]">{apt.name}</p>
                {apt.address && (
                  <p className="text-xs text-[#8b98a9]">{apt.address}</p>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-800/60 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#5a6478]">{selected.size} ausgewählt</p>
        <Button onClick={handleSave} loading={saving} disabled={selected.size === 0}>
          Weiter
        </Button>
      </div>
    </Card>
  )
}
