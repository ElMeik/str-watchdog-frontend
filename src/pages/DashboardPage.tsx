import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, AlertTriangle, Activity, Building2, Wifi, Info } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import api from '../lib/api'
import { formatDateTime, platformLabel } from '../lib/utils'
import type { DashboardData, CheckRunList, Customer } from '../types/api'

function StatusBadge({ status }: { status: string }) {
  if (status === 'gap') return <Badge variant="danger">Handlung erforderlich</Badge>
  if (status === 'mapping') return <Badge variant="warning">Prüfen</Badge>
  if (status === 'running') return <Badge variant="running">Wird geprüft</Badge>
  return <Badge variant="neutral">{status}</Badge>
}

function ProvisioningBanner({ customerStatus }: { customerStatus: string }) {
  if (customerStatus === 'active') return null
  const messages: Record<string, string> = {
    pending_setup: 'Ihr Account wird gerade eingerichtet. Dies dauert wenige Minuten.',
    provisioning: 'Ihre Überwachungsumgebung wird gestartet. Bitte warten Sie kurz.',
    error: 'Bei der Einrichtung ist ein Fehler aufgetreten. Bitte kontaktieren Sie den Support.',
    paused: 'Ihr Account ist pausiert. Bitte kontaktieren Sie den Support.',
  }
  const msg = messages[customerStatus] ?? 'Unbekannter Status.'
  const isError = customerStatus === 'error'

  return (
    <div
      className={`mx-6 mt-6 flex items-start gap-3 rounded-xl border px-5 py-4 ${
        isError
          ? 'border-red-800/40 bg-red-900/20 text-red-400'
          : 'border-blue-800/40 bg-blue-900/20 text-blue-400'
      }`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="text-sm">{msg}</p>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: customer } = useQuery({
    queryKey: ['customer'],
    queryFn: () => api.get<Customer>('/api/me').then((r) => r.data),
  })

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/api/dashboard').then((r) => r.data),
    refetchInterval: customer?.status === 'active' ? false : 10_000,
  })

  // Poll active check runs
  const { data: runs } = useQuery({
    queryKey: ['check-runs'],
    queryFn: () => api.get<CheckRunList>('/api/check-runs?limit=5').then((r) => r.data),
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      const hasRunning = data.runs.some((r) => r.status === 'running')
      return hasRunning ? 3_000 : false
    },
  })

  const triggerMutation = useMutation({
    mutationFn: () => api.post('/api/check-runs'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check-runs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const isRunning = runs?.runs.some((r) => r.status === 'running') ?? false
  const canTrigger = customer?.status === 'active' && !isRunning

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    )
  }

  const d = dashboard ?? {
    systemHealth: 0,
    totalProperties: 0,
    activeChannels: 0,
    openGaps: 0,
    criticalGaps: [],
    lastCheckAt: null,
    weeklyTrend: [],
  }

  return (
    <AppLayout>
      {/* Provisioning banner */}
      {customer && <ProvisioningBanner customerStatus={customer.status} />}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#e2e8f0]">Operations Overview</h1>
            <p className="text-sm text-[#5a6478]">
              {d.lastCheckAt
                ? `Letzte Prüfung: ${formatDateTime(d.lastCheckAt)}`
                : 'Noch keine Prüfung durchgeführt'}
            </p>
          </div>
          <Button
            onClick={() => triggerMutation.mutate()}
            loading={isRunning || triggerMutation.isPending}
            disabled={!canTrigger}
            variant="secondary"
          >
            <RefreshCw className="h-4 w-4" />
            {isRunning ? 'Wird geprüft…' : 'Jetzt prüfen'}
          </Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-900/30">
                <Activity className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">System Health</p>
                <p className="text-2xl font-bold text-[#e2e8f0]">{d.systemHealth}%</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900/30">
                <Building2 className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">Objekte</p>
                <p className="text-2xl font-bold text-[#e2e8f0]">{d.totalProperties}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-900/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">Sync-Probleme</p>
                <p className="text-2xl font-bold text-[#e2e8f0]">{d.openGaps}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-900/30">
                <Wifi className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">Aktive Portale</p>
                <p className="text-2xl font-bold text-[#e2e8f0]">{d.activeChannels}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main content: table + intelligence panel */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Inconsistencies table */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="border-b border-[#2d3447] px-5 py-4">
                <h2 className="font-semibold text-[#e2e8f0]">Property Inconsistencies</h2>
                <p className="text-xs text-[#5a6478]">Letzte 24 Stunden</p>
              </div>

              {d.criticalGaps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-900/30">
                    <Activity className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="font-medium text-[#e2e8f0]">Alles in Ordnung</p>
                  <p className="mt-1 text-sm text-[#5a6478]">
                    Keine Probleme in den letzten 24 Stunden gefunden.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2d3447] text-xs text-[#5a6478]">
                        <th className="px-5 py-3 text-left font-medium">Objekt</th>
                        <th className="px-5 py-3 text-left font-medium">Portal</th>
                        <th className="px-5 py-3 text-left font-medium">Problem erkannt</th>
                        <th className="px-5 py-3 text-left font-medium">Status</th>
                        <th className="px-5 py-3 text-left font-medium">Aktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.criticalGaps.map((gap) => (
                        <tr
                          key={gap.id}
                          className="border-b border-[#2d3447]/50 hover:bg-[#212840]"
                        >
                          <td className="px-5 py-3 font-medium text-[#e2e8f0]">
                            {gap.property.name}
                          </td>
                          <td className="px-5 py-3 text-[#8b98a9]">
                            {platformLabel(gap.platformListing.platform)}
                          </td>
                          <td className="px-5 py-3 text-[#8b98a9]">
                            {formatDateTime(gap.checkDate)}
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge status={gap.result} />
                          </td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() =>
                                navigate(`/properties/${gap.propertyId}`)
                              }
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Prioritized intelligence */}
          <div className="space-y-4">
            <Card>
              <h2 className="mb-4 font-semibold text-[#e2e8f0]">Prioritized Intelligence</h2>

              {d.criticalGaps.length === 0 ? (
                <p className="text-sm text-[#5a6478]">Keine kritischen Probleme.</p>
              ) : (
                <div className="space-y-3">
                  {d.criticalGaps.slice(0, 5).map((gap) => (
                    <div
                      key={gap.id}
                      className="rounded-lg border border-red-800/30 bg-red-900/10 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-[#e2e8f0]">
                            {gap.property.name}
                          </p>
                          <p className="text-xs text-[#8b98a9]">
                            {platformLabel(gap.platformListing.platform)} ·{' '}
                            {formatDateTime(gap.checkDate)}
                          </p>
                        </div>
                        <Badge variant="danger" className="shrink-0">
                          gap
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Weekly trend */}
            {d.weeklyTrend.length > 0 && (
              <Card>
                <h2 className="mb-4 font-semibold text-[#e2e8f0]">7-Tage-Verlauf</h2>
                <div className="space-y-2">
                  {d.weeklyTrend.map((point) => {
                    const total = point.gaps + point.matches
                    const gapPct = total > 0 ? (point.gaps / total) * 100 : 0
                    return (
                      <div key={point.date} className="flex items-center gap-3 text-xs">
                        <span className="w-20 text-[#5a6478]">
                          {new Date(point.date).toLocaleDateString('de-DE', {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </span>
                        <div className="flex-1 rounded-full bg-[#2d3447] h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-red-500"
                            style={{ width: `${gapPct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[#8b98a9]">{point.gaps}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="mt-2 text-xs text-[#5a6478]">Rot = Gaps · Zahlen = Anzahl</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
