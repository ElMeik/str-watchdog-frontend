import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function DatenschutzPage() {
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

        <h1 className="mb-8 text-3xl font-bold text-[#e2e8f0]">Datenschutzerklärung</h1>

        {/* TODO: Inhalt wird vor Go-live befüllt (DSGVO Art. 13/14) */}
        <div className="rounded-xl border border-yellow-800/40 bg-yellow-900/10 p-4 mb-8">
          <p className="text-sm text-yellow-400">
            ⚠️ Dieser Inhalt wird vor dem Go-live befüllt (DSGVO Art. 13/14).
          </p>
        </div>

        <div className="space-y-6 text-[#8b98a9]">
          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">1. Verantwortlicher</h2>
            <p>VWS Media / Michael Gründling, [Adresse], kontakt@strwatchdog.de</p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">2. Erhobene Daten</h2>
            <p>
              STR Watchdog verarbeitet folgende personenbezogene Daten: E-Mail-Adresse (für
              Authentifizierung und Benachrichtigungen), Smoobu API-Key (verschlüsselt gespeichert,
              nur für Verfügbarkeitsprüfungen verwendet), Objekt- und Listing-Informationen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">3. Zweck der Verarbeitung</h2>
            <p>
              Die Daten werden ausschließlich zur Erbringung des Monitoring-Dienstes genutzt.
              Keine Weitergabe an Dritte außer für den technischen Betrieb des Dienstes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">4. Cookies</h2>
            <p>
              STR Watchdog verwendet ausschließlich technisch notwendige Cookies (Session,
              Authentifizierungs-Token). Es werden keine Tracking- oder Analyse-Cookies eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">5. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung (Art. 17 DSGVO),
              Einschränkung der Verarbeitung und Datenübertragbarkeit. Zur vollständigen Löschung
              Ihrer Daten nutzen Sie die Funktion "Konto löschen" in den Einstellungen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-[#e2e8f0]">6. Kontakt</h2>
            <p>Für datenschutzrelevante Anfragen: kontakt@strwatchdog.de</p>
          </section>
        </div>
      </div>
    </div>
  )
}
