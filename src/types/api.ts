export interface Customer {
  id: string
  email: string
  smoobuCustomerId: number | null
  orgoVmId: string | null
  status: 'pending_setup' | 'provisioning' | 'active' | 'paused' | 'error'
  checkTimeUtc: string
  alertEmail: string | null
  notifyOnGap: boolean
  notifyOnMapping: boolean
  createdAt: string
  updatedAt: string
}

export type Platform = 'booking' | 'airbnb' | 'vrbo' | 'expedia' | 'direct'

export interface PlatformListing {
  id: string
  platform: Platform
  listingUrl: string
  listingId: string | null
  validated: boolean
  createdAt: string
}

export interface Property {
  id: string
  customerId: string
  smoobuApartmentId: number
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
  platformListings: PlatformListing[]
}

export interface SmoobuApartment {
  id: number
  name: string
  address: string
}

export type OnboardingStep =
  | 'smoobu_connect'
  | 'properties_select'
  | 'listings_validate'
  | 'complete'

export interface PendingListing {
  propertyId: string
  propertyName: string
  missingPlatforms: Platform[]
  unvalidatedListings: Array<{
    id: string
    platform: Platform
    listingUrl: string
  }>
}

export interface OnboardingStatus {
  step: OnboardingStep
  customerStatus: string
  smoobuConnected: boolean
  propertiesCount: number
  pendingListings: PendingListing[]
  isReadyForProvisioning: boolean
}

export interface CriticalGap {
  id: string
  propertyId: string
  checkDate: string
  result: string
  property: { name: string }
  platformListing: { platform: Platform }
}

export interface WeeklyTrendPoint {
  date: string
  gaps: number
  matches: number
}

export interface DashboardData {
  systemHealth: number
  totalProperties: number
  activeChannels: number
  openGaps: number
  criticalGaps: CriticalGap[]
  lastCheckAt: string | null
  weeklyTrend: WeeklyTrendPoint[]
}

export interface CheckRun {
  id: string
  triggeredBy: 'manual' | 'scheduled'
  status: 'running' | 'completed' | 'failed'
  startedAt: string
  finishedAt: string | null
  errorMessage: string | null
  _count: { results: number }
}

export interface CheckRunList {
  runs: CheckRun[]
  total: number
  limit: number
  offset: number
}

export type CheckResultType = 'match' | 'gap' | 'mapping' | 'error' | 'not_available'

export interface CheckResult {
  id: string
  checkDate: string
  result: CheckResultType
  smoobuAvailable: boolean | null
  portalVisible: boolean | null
  notes: string | null
  platformListing: { platform: Platform; listingUrl: string }
  run: { triggeredBy: string; status: string; startedAt: string }
}

export interface ValidationResponse {
  level1: 'ok' | 'error'
  level2: 'ok' | 'warn' | 'error' | 'pending'
  matchResult: unknown
  requiresConfirmation: boolean
  normalizedUrl?: string
  listingId?: string
  message: string
}

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
export type SyncStatus = 'live' | 'partial' | 'delayed'

export interface PropertyOverviewListing {
  id: string
  platform: Platform
  listingUrl: string
  validated: boolean
}

export interface PropertyOverviewItem {
  id: string
  name: string
  location: string | null
  createdAt: string
  platformListings: PropertyOverviewListing[]
  riskLevel: RiskLevel
  syncStatus: SyncStatus
  lastSyncAt: string | null
}

export interface PropertiesOverviewStats {
  monitored: number
  atRisk: number
  activeIssues: number
  criticalIssues: number
  healthyChannels: number
  totalChannels: number
  avgResolutionMinutes: number | null
}

export interface PropertiesOverview {
  stats: PropertiesOverviewStats
  properties: PropertyOverviewItem[]
}

export interface PropertyIssue {
  id: string
  category: string
  severity: 'high' | 'medium'
  platform: Platform
  checkDate: string
  notes: string | null
}

export interface PropertyOverviewDetail {
  id: string
  name: string
  location: string | null
  smoobuApartmentId: number
  platformListings: PropertyOverviewListing[]
  riskLevel: RiskLevel
  syncStatus: SyncStatus
  lastSyncAt: string | null
  issues: PropertyIssue[]
}

export interface ApiErrorResponse {
  error: string
  message: string
}
