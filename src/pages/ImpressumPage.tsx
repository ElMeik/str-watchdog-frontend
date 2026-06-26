import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#8b98a9] hover:text-[#e2e8f0]"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-[#e2e8f0]">Impressum</h1>

        {/* TODO: Inhalt wird vor Go-live befüllt (§ 5 TMG) */}
        <div className="rounded-xl border border-yellow-800/40 bg-yellow-900/10 p-4 mb-8">
          <p className="text-sm text-yellow-400">
            ⚠️ Dieser Inhalt wird vor dem Go-live befüllt (§ 5 TMG).
          </p>
        </div>

        <div className="space-y-6 text-[#8b98a9]">
          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">Angaben gemäß § 5 TMG</h2>
            <p>VWS Media / Michael Gründling</p>
            <p>[Straße und Hausnummer]</p>
            <p>[PLZ Ort]</p>
            <p>Deutschland</p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">Kontakt</h2>
            <p>E-Mail: kontakt@strwatchdog.de</p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">Verantwortlich für den Inhalt</h2>
            <p>Michael Gründling (Anschrift wie oben)</p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht bereit oder verpflichtet,
              an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
