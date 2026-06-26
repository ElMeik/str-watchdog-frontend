import { useState } from 'react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import api from '../../lib/api'
import type { PendingListing, ValidationResponse } from '../../types/api'

interface ListingState {
  url: string
  validating: boolean
  validationResult: ValidationResponse | null
  saved: boolean
  error: string
}

interface Props {
  pendingListings: PendingListing[]
  onDone: () => void
}

const PLATFORM_HINTS: Record<string, string> = {
  booking: 'https://www.booking.com/hotel/de/...',
  airbnb: 'https://www.airbnb.de/rooms/...',
}

export default function Step3Listings({ pendingListings, onDone }: Props) {
  // State keyed by `${propertyId}__${platform}`
  const [states, setStates] = useState<Record<string, ListingState>>(() => {
    const init: Record<string, ListingState> = {}
    for (const pending of pendingListings) {
      // Pre-fill with already existing unvalidated listings
      for (const unvalidated of pending.unvalidatedListings) {
        init[`${pending.propertyId}__${unvalidated.platform}`] = {
          url: unvalidated.listingUrl,
          validating: false,
          validationResult: null,
          saved: false,
          error: '',
        }
      }
      // Add empty entries for missing platforms
      for (const platform of pending.missingPlatforms) {
        if (!init[`${pending.propertyId}__${platform}`]) {
          init[`${pending.propertyId}__${platform}`] = {
            url: '',
            validating: false,
            validationResult: null,
            saved: false,
            error: '',
          }
        }
      }
    }
    return init
  })

  const [finalizing, setFinalizing] = useState(false)

  const setField = (key: string, partial: Partial<ListingState>) => {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], ...partial } }))
  }

  const validateListing = async (propertyId: string, platform: string) => {
    const key = `${propertyId}__${platform}`
    const url = states[key]?.url
    if (!url) return

    setField(key, { validating: true, validationResult: null, error: '' })
    try {
      const { data } = await api.post<ValidationResponse>(
        `/api/properties/${propertyId}/listings/validate`,
        { url, platform },
      )
      setField(key, { validating: false, validationResult: data })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setField(key, {
        validating: false,
        error:
          axiosErr?.response?.data?.message ?? 'Validierung fehlgeschlagen. Bitte erneut versuchen.',
      })
    }
  }

  const saveListing = async (
    propertyId: string,
    platform: string,
    confirm: boolean,
  ) => {
    const key = `${propertyId}__${platform}`
    const { url, validationResult } = states[key]
    const finalUrl = validationResult?.normalizedUrl ?? url

    try {
      // First create the listing
      const { data: listing } = await api.post(`/api/properties/${propertyId}/listings`, {
        url: finalUrl,
        platform,
        confirmed: confirm,
      })
      // If needs manual confirmation
      if (confirm && listing.id) {
        await api.put(`/api/properties/${propertyId}/listings/${listing.id}/confirm`)
      }
      setField(key, { saved: true })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setField(key, {
        error:
          axiosErr?.response?.data?.message ?? 'Fehler beim Speichern.',
      })
    }
  }

  const canProceed = () => {
    // At least one property must have at least one saved listing
    for (const pending of pendingListings) {
      const keysForProperty = [
        `${pending.propertyId}__booking`,
        `${pending.propertyId}__airbnb`,
      ]
      const anySaved = keysForProperty.some((k) => states[k]?.saved)
      if (!anySaved) return false
    }
    return true
  }

  const handleNext = async () => {
    setFinalizing(true)
    try {
      onDone()
    } finally {
      setFinalizing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#2d3447] bg-[#1c2333] p-5">
        <h2 className="mb-2 text-lg font-semibold text-[#e2e8f0]">Portal-URLs eingeben</h2>
        <p className="text-sm text-[#8b98a9]">
          Die URL finden Sie in der Adressleiste wenn Sie Ihr Listing auf Booking.com oder Airbnb
          aufrufen.
        </p>
      </div>

      {pendingListings.map((pending) => (
        <Card key={pending.propertyId}>
          <h3 className="mb-5 font-semibold text-[#e2e8f0]">{pending.propertyName}</h3>

          {(['booking', 'airbnb'] as const).map((platform) => {
            const key = `${pending.propertyId}__${platform}`
            const state = states[key]
            if (!state) return null

            const v = state.validationResult
            const isOk = v?.level1 === 'ok' && (v?.level2 === 'ok' || v?.level2 === 'warn')
            const needsConfirm = v?.requiresConfirmation === true

            return (
              <div
                key={platform}
                className="mb-6 last:mb-0 rounded-lg border border-[#2d3447] bg-[#161b27] p-4"
              >
                <p className="mb-3 text-sm font-medium text-[#e2e8f0] capitalize">
                  {platform === 'booking' ? 'Booking.com' : 'Airbnb'}{' '}
                  <span className="text-xs font-normal text-[#5a6478]">(optional)</span>
                </p>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={state.url}
                      onChange={(e) => setField(key, { url: e.target.value, validationResult: null, saved: false })}
                      placeholder={PLATFORM_HINTS[platform]}
                      disabled={state.saved}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => validateListing(pending.propertyId, platform)}
                    loading={state.validating}
                    disabled={!state.url || state.saved}
                    className="shrink-0 self-end mb-0.5"
                  >
                    {state.validating ? '' : 'Prüfen'}
                  </Button>
                </div>

                {state.error && (
                  <p className="mt-2 text-xs text-red-400">{state.error}</p>
                )}

                {/* Validation result */}
                {v && !state.saved && (
                  <div
                    className={`mt-3 rounded-lg p-3 text-sm ${
                      isOk
                        ? 'border border-green-800/40 bg-green-900/10 text-green-400'
                        : 'border border-red-800/40 bg-red-900/10 text-red-400'
                    }`}
                  >
                    <p>{v.message}</p>

                    {isOk && (
                      <div className="mt-2 flex gap-2">
                        {needsConfirm ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveListing(pending.propertyId, platform, true)}
                            >
                              URL bestätigen & speichern
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => saveListing(pending.propertyId, platform, false)}
                          >
                            Speichern
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {state.saved && (
                  <p className="mt-2 text-xs text-green-400">✓ URL gespeichert</p>
                )}
              </div>
            )
          })}
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleNext} loading={finalizing} disabled={!canProceed()}>
          Weiter
        </Button>
      </div>
    </div>
  )
}
