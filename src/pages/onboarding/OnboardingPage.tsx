import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import api from '../../lib/api'
import type { OnboardingStatus } from '../../types/api'
import Step1Smoobu from './Step1Smoobu'
import Step2Properties from './Step2Properties'
import Step3Listings from './Step3Listings'
import Step4Settings from './Step4Settings'

const STEP_LABELS = ['Smoobu verbinden', 'Objekte wählen', 'URLs eingeben', 'Einstellungen']

function stepFromStatus(status: OnboardingStatus | undefined): number {
  if (!status) return 1
  switch (status.step) {
    case 'smoobu_connect': return 1
    case 'properties_select': return 2
    case 'listings_validate': return 3
    case 'complete': return 4
    default: return 1
  }
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [resumeChoice, setResumeChoice] = useState<'resume' | 'restart' | null>(null)
  const [forceStep, setForceStep] = useState<number | null>(null)

  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ['onboarding-status'],
    queryFn: () => api.get<OnboardingStatus>('/api/onboarding/status').then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
        <Spinner size="lg" />
      </div>
    )
  }

  // Already complete → redirect to dashboard
  if (status?.step === 'complete' && resumeChoice === null) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const detectedStep = stepFromStatus(status)
  const isReturningUser = detectedStep > 1 && resumeChoice === null

  // Show resume dialog for returning users
  if (isReturningUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#2d3447] bg-[#1c2333] p-8">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-lg font-semibold text-[#e2e8f0]">
            Einrichtung fortsetzen
          </h2>
          <p className="mb-8 text-center text-sm text-[#8b98a9]">
            Sie haben Ihre Einrichtung noch nicht abgeschlossen. Weiter wo Sie aufgehört haben?
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setForceStep(detectedStep)
                setResumeChoice('resume')
              }}
              className="w-full"
            >
              Weiter (Schritt {detectedStep} von 4)
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setForceStep(1)
                setResumeChoice('restart')
              }}
              className="w-full"
            >
              Von vorne beginnen
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentStep = forceStep ?? detectedStep

  const advance = async () => {
    await refetch()
    const newStatus = await api
      .get<OnboardingStatus>('/api/onboarding/status')
      .then((r) => r.data)
    const next = stepFromStatus(newStatus)
    if (next === 4 || currentStep >= 4) {
      // Step 4 always shown once we get here
      setForceStep(4)
    } else {
      setForceStep(next)
    }
  }

  const complete = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0d1117] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm font-semibold text-[#e2e8f0]">STR Watchdog</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-[#5a6478] mb-2">
            {STEP_LABELS.map((label, i) => (
              <span
                key={i}
                className={
                  i + 1 === currentStep
                    ? 'text-blue-400 font-medium'
                    : i + 1 < currentStep
                    ? 'text-[#8b98a9]'
                    : ''
                }
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-[#2d3447]">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {currentStep === 1 && <Step1Smoobu onDone={advance} />}
        {currentStep === 2 && <Step2Properties onDone={advance} />}
        {currentStep === 3 && status && (
          <Step3Listings pendingListings={status.pendingListings} onDone={advance} />
        )}
        {currentStep === 4 && <Step4Settings onDone={complete} />}
      </div>
    </div>
  )
}
