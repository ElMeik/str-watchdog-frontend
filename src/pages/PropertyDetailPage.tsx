import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import api from '../lib/api'
import { formatDate, formatDateTime, platformLabel } from '../lib/utils'
import type { CheckResult, Property } from '../types/api'

function ResultBadge({ result }: { result: string }) {
  const map: Record<string, { variant: 'success' | 'danger' | 'warning' | 'neutral'; label: string }> = {
    match: { variant: 'success', label: 'OK' },
    gap: { variant: 'danger', label: 'Lücke' },
    mapping: { variant: 'warning', label: 'Abweichung' },
    error: { variant: 'neutral', label: 'Fehler' },
    not_available: { variant: 'neutral', label: 'Nicht verfügbar' },
  }
  const entry = map[result] ?? { variant: 'neutral', label: result }
  return <Badge variant={entry.variant}>{entry.label}</Badge>
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.get<Property[]>('/api/properties').then((r) => r.data),
  })

  const property = properties?.find((p) => p.id === id)

  const { data: results, isLoading } = useQuery({
    queryKey: ['property-results', id],
    queryFn: () =>
      api.get<CheckResult[]>(`/api/properties/${id}/results?days=7`).then((r) => r.data),
    enabled: !!id,
  })

  // Build 7-day calendar from results
  const days: Array<{ date: string; results: CheckResult[] }> = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateKey = d.toISOString().slice(0, 10)
    days.push({
      date: dateKey,
      results: (results ?? []).filter((r) => r.checkDate.slice(0, 10) === dateKey),
    })
  }

  const platforms = ['booking', 'airbnb'] as const

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Back nav */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-[#8b98a9] hover:text-[#e2e8f0]"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Übersicht
        </button>

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-[#e2e8f0]">
            {property?.name ?? 'Objekt'}
          </h1>
          <div className="mt-2 flex flex-wrap gap-3">
            {property?.platformListings.map((listing) => (
              <a
                key={listing.id}
                href={listing.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="h-3 w-3" />
                {platformLabel(listing.platform)}
              </a>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* 7-day calendar */}
            <div className="rounded-xl border border-[#2d3447] bg-[#1c2333] overflow-hidden">
              <div className="border-b border-[#2d3447] px-5 py-4">
                <h2 className="font-semibold text-[#e2e8f0]">7-Tage-Kalender</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2d3447] text-xs text-[#5a6478]">
                      <th className="px-5 py-3 text-left font-medium">Datum</th>
                      <th className="px-5 py-3 text-left font-medium">Smoobu</th>
                      {platforms.map((p) => (
                        <th key={p} className="px-5 py-3 text-left font-medium">
                          {platformLabel(p)}
                        </th>
                      ))}
                      <th className="px-5 py-3 text-left font-medium">Ergebnis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map(({ date, results: dayResults }) => {
                      const anyResult = dayResults[0]
                      const resultByPlatform = Object.fromEntries(
                        dayResults.map((r) => [r.platformListing.platform, r]),
                      )

                      return (
                        <tr key={date} className="border-b border-[#2d3447]/50">
                          <td className="px-5 py-3 text-[#e2e8f0]">
                            {formatDate(date)}
                          </td>
                          <td className="px-5 py-3">
                            {anyResult ? (
                              anyResult.smoobuAvailable === true ? (
                                <Badge variant="success">Verfügbar</Badge>
                              ) : anyResult.smoobuAvailable === false ? (
                                <Badge variant="neutral">Belegt</Badge>
                              ) : (
                                <Badge variant="neutral">–</Badge>
                              )
                            ) : (
                              <span className="text-[#5a6478]">–</span>
                            )}
                          </td>
                          {platforms.map((platform) => {
                            const r = resultByPlatform[platform]
                            if (!r) return <td key={platform} className="px-5 py-3 text-[#5a6478]">–</td>
                            return (
                              <td key={platform} className="px-5 py-3">
                                {r.portalVisible === true ? (
                                  <Badge variant="success">Sichtbar</Badge>
                                ) : r.portalVisible === false ? (
                                  <Badge variant="danger">Nicht sichtbar</Badge>
                                ) : (
                                  <Badge variant="neutral">–</Badge>
                                )}
                              </td>
                            )
                          })}
                          <td className="px-5 py-3">
                            {anyResult ? (
                              <ResultBadge result={anyResult.result} />
                            ) : (
                              <span className="text-[#5a6478] text-xs">Nicht geprüft</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Check history */}
            <div className="rounded-xl border border-[#2d3447] bg-[#1c2333] overflow-hidden">
              <div className="border-b border-[#2d3447] px-5 py-4">
                <h2 className="font-semibold text-[#e2e8f0]">Prüfverlauf</h2>
              </div>
              {!results || results.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-[#5a6478]">
                  Noch keine Prüfergebnisse vorhanden.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2d3447] text-xs text-[#5a6478]">
                        <th className="px-5 py-3 text-left font-medium">Datum</th>
                        <th className="px-5 py-3 text-left font-medium">Portal</th>
                        <th className="px-5 py-3 text-left font-medium">Ergebnis</th>
                        <th className="px-5 py-3 text-left font-medium">Ausgelöst</th>
                        <th className="px-5 py-3 text-left font-medium">Hinweis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 30).map((r) => (
                        <tr key={r.id} className="border-b border-[#2d3447]/50">
                          <td className="px-5 py-3 text-[#e2e8f0]">
                            {formatDateTime(r.checkDate)}
                          </td>
                          <td className="px-5 py-3 text-[#8b98a9]">
                            {platformLabel(r.platformListing.platform)}
                          </td>
                          <td className="px-5 py-3">
                            <ResultBadge result={r.result} />
                          </td>
                          <td className="px-5 py-3 text-[#8b98a9]">
                            {r.run.triggeredBy === 'manual' ? 'Manuell' : 'Automatisch'}
                          </td>
                          <td className="px-5 py-3 text-xs text-[#5a6478]">
                            {r.notes ?? '–'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
