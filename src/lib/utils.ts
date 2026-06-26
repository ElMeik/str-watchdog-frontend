export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export type Platform = 'booking' | 'airbnb' | 'vrbo' | 'expedia' | 'direct'

const platformLabels: Record<Platform, string> = {
  booking: 'Booking.com',
  airbnb: 'Airbnb',
  vrbo: 'VRBO',
  expedia: 'Expedia',
  direct: 'Direct',
}

const platformColors: Record<Platform, string> = {
  booking: 'text-blue-400',
  airbnb: 'text-pink-400',
  vrbo: 'text-yellow-400',
  expedia: 'text-orange-400',
  direct: 'text-[#8b98a9]',
}

export function platformLabel(platform: Platform): string {
  return platformLabels[platform] ?? platform
}

export function platformColor(platform: Platform): string {
  return platformColors[platform] ?? 'text-[#8b98a9]'
}
