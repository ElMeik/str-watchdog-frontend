import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Building2, AlertTriangle, Activity, Wifi, Clock } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import api from '../lib/api'
import { formatDateTime, platformLabel } from '../lib/utils'
import type {
  PropertiesOverview,
  PropertyOverviewDetail,
  PropertyOverviewItem,
  RiskLevel,
  SyncStatus,
} from '../types/api'

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, { variant: 'danger' | 'warning' | 'info' | 'success'; label: string }> = {
    critical: { variant: 'danger', label: 'Critical risk' },
    high: { variant: 'danger', label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'success', label: 'Low' },
  }
  const entry = map[risk]
  return <Badge variant={entry.variant}>{entry.label}</Badge>
}

function SyncBadge({ status }: { status: SyncStatus }) {
  const map: Record<SyncStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
    live: { variant: 'success', label: 'Live' },
    partial: { variant: 'warning', label: 'Partial' },
    delayed: { variant: 'warning', label: 'Delayed' },
  }
  const entry = map[status]
  return <Badge variant={entry.variant}>{entry.label}</Badge>
}

function PropertyRow({
  property,
  selected,
  onSelect,
}: {
  property: PropertyOverviewItem
  selected: boolean
  onSelect: () => void
}) {
  return (
    <tr
      onClick={onSelect}
      className={`cursor-pointer border-b border-[#2d3447]/50 hover:bg-[#212840] ${
        selected ? 'bg-[#212840]' : ''
      }`}
    >
      <td className="px-5 py-3">
        <p className="font-medium text-[#e2e8f0]">{property.name}</p>
        <p className="text-xs text-[#5a6478]">ID: {property.id.slice(0, 10)}</p>
      </td>
      <td className="px-5 py-3 text-[#8b98a9]">{property.location ?? '–'}</td>
      <td className="px-5 py-3">
        <SyncBadge status={property.syncStatus} />
      </td>
      <td className="px-5 py-3">
        <div className="flex flex-wrap gap-1.5">
          {property.platformListings.length === 0 ? (
            <span className="text-xs text-[#5a6478]">–</span>
          ) : (
            property.platformListings.map((l) => (
              <Badge key={l.id} variant="neutral">
                {platformLabel(l.platform)}
              </Badge>
            ))
          )}
        </div>
      </td>
      <td className="px-5 py-3">
        <RiskBadge risk={property.riskLevel} />
      </td>
    </tr>
  )
}

export default function PropertiesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['properties-overview'],
    queryFn: () => api.get<PropertiesOverview>('/api/properties/overview').then((r) => r.data),
  })

  const properties = data?.properties ?? []
  const activeId = selectedId ?? properties[0]?.id ?? null

  const { data: detail } = useQuery({
    queryKey: ['property-overview-detail', activeId],
    queryFn: () =>
      api.get<PropertyOverviewDetail>(`/api/properties/${activeId}/overview`).then((r) => r.data),
    enabled: !!activeId,
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

  const stats = data?.stats ?? {
    monitored: 0,
    atRisk: 0,
    activeIssues: 0,
    criticalIssues: 0,
    healthyChannels: 0,
    totalChannels: 0,
    avgResolutionMinutes: null,
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-[#e2e8f0]">Properties</h1>
          <p className="text-sm text-[#5a6478]">
            Alle Objekte mit Sync-Status und Risikoeinstufung im Überblick.
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900/30">
                <Building2 className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">Monitored</p>
                <p className="text-2xl font-bold text-[#e2e8f0]">{stats.monitored}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-900/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">At Risk</p>
                <p className="text-2xl font-bold text-[#e2e8f0]">{stats.atRisk}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-900/30">
                <Activity className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">Active Issues</p>
                <p className="text-2xl font-bold text-[#e2e8f0]">{stats.activeIssues}</p>
                <p className="text-xs text-[#5a6478]">{stats.criticalIssues} kritisch</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-900/30">
                <Wifi className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">Healthy Channels</p>
                <p className="text-2xl font-bold text-[#e2e8f0]">
                  {stats.healthyChannels} / {stats.totalChannels}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {stats.avgResolutionMinutes !== null && (
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-900/30">
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-[#5a6478]">Avg. Resolution</p>
                <p className="text-lg font-bold text-[#e2e8f0]">
                  {Math.floor(stats.avgResolutionMinutes / 60)}h{' '}
                  {stats.avgResolutionMinutes % 60}m
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Portfolio + detail */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="border-b border-[#2d3447] px-5 py-4">
                <h2 className="font-semibold text-[#e2e8f0]">
                  Portfolio <span className="text-[#5a6478]">{properties.length} Objekte</span>
                </h2>
              </div>

              {properties.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-[#5a6478]">
                  Noch keine Objekte angelegt.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2d3447] text-xs text-[#5a6478]">
                        <th className="px-5 py-3 text-left font-medium">Property</th>
                        <th className="px-5 py-3 text-left font-medium">Location</th>
                        <th className="px-5 py-3 text-left font-medium">Sync</th>
                        <th className="px-5 py-3 text-left font-medium">Channels</th>
                        <th className="px-5 py-3 text-left font-medium">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((p) => (
                        <PropertyRow
                          key={p.id}
                          property={p}
                          selected={p.id === activeId}
                          onSelect={() => setSelectedId(p.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Detail panel */}
          <div>
            <Card>
              {!detail ? (
                <p className="text-sm text-[#5a6478]">Objekt auswählen für Details.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#5a6478]">
                      Property Detail
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#e2e8f0]">{detail.name}</h3>
                      <RiskBadge risk={detail.riskLevel} />
                    </div>
                    {detail.location && (
                      <p className="text-sm text-[#8b98a9]">{detail.location}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-[#5a6478]">Property ID</p>
                      <p className="text-[#e2e8f0]">{detail.id.slice(0, 10)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5a6478]">PMS Source</p>
                      <p className="text-[#e2e8f0]">Smoobu</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5a6478]">Last Sync</p>
                      <p className="text-[#e2e8f0]">
                        {detail.lastSyncAt ? formatDateTime(detail.lastSyncAt) : 'Noch nie'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5a6478]">Channels</p>
                      <p className="text-[#e2e8f0]">
                        {detail.platformListings.length} verbunden
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#2d3447] pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#e2e8f0]">Issues</p>
                      <span className="text-xs text-[#5a6478]">
                        {detail.issues.length} erkannt
                      </span>
                    </div>

                    {detail.issues.length === 0 ? (
                      <p className="text-sm text-[#5a6478]">
                        Keine Probleme in den letzten 7 Tagen.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {detail.issues.map((issue) => (
                          <div
                            key={issue.id}
                            className="rounded-lg border border-[#2d3447] bg-[#161b27] p-3"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-[#e2e8f0]">
                                {issue.category}
                              </p>
                              <Badge variant={issue.severity === 'high' ? 'danger' : 'warning'}>
                                {issue.severity === 'high' ? 'HIGH SEVERITY' : 'MEDIUM SEVERITY'}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-[#8b98a9]">
                              {platformLabel(issue.platform)} · {formatDateTime(issue.checkDate)}
                            </p>
                            {issue.notes && (
                              <p className="mt-1 text-xs text-[#5a6478]">{issue.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
