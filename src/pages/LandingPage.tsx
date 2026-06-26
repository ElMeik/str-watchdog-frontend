import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Eye,
  Calendar,
  TrendingDown,
  Plug,
  Bell,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react'

// Prices from env — configurable without code changes
const PRICE_TIER1 = parseInt(import.meta.env.VITE_PRICE_TIER1 ?? '59', 10)
const PRICE_TIER2 = parseInt(import.meta.env.VITE_PRICE_TIER2 ?? '49', 10)
const PRICE_TIER3 = parseInt(import.meta.env.VITE_PRICE_TIER3 ?? '39', 10)

// ── Section 1: Hero ───────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0d1117] via-[#0d1117] to-[#111827] px-4 py-24 text-center">
      <div className="mx-auto max-w-3xl">
        {/* Eyebrow */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2d3447] bg-[#1c2333]/80 px-4 py-1.5 text-sm text-[#8b98a9]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          Täglich aktiv für Vermieter in Deutschland, Österreich und der Schweiz
          {/* TODO: echte Zahl nach Beta */}
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
          Ihre Wohnung steht frei.{' '}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Auf Booking.com sieht sie niemand.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#8b98a9] md:text-xl">
          Synchronisationsfehler zwischen Ihrem Channel Manager und den Buchungsportalen kosten
          Vermieter durchschnittlich mehrere freie Tage pro Monat — unbemerkt, ohne Warnung, ohne
          zweite Chance.
        </p>

        {/* Visual anchor — TODO: mit echten Daten ersetzen */}
        <div className="mx-auto mb-10 inline-flex items-center gap-4 rounded-xl border border-red-800/40 bg-red-950/20 px-6 py-4">
          <span className="text-4xl font-bold text-red-400">Ø 4,3</span>
          <span className="text-left text-sm text-[#8b98a9]">
            freie Tage pro Monat bleiben ungebucht
            <br />
            wegen Synchronisationsfehlern.
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-700"
          >
            14 Tage kostenlos testen – keine Kreditkarte
          </Link>
          {/* TODO: echte Zahl nach Beta */}
          <p className="text-sm text-[#5a6478]">
            Bereits von Vermietern in Deutschland, Österreich und der Schweiz genutzt.
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-[#5a6478]" />
      </div>
    </section>
  )
}

// ── Section 2: Pain points ────────────────────────────────────────────────────

const painCards = [
  {
    icon: Eye,
    title: 'Das unsichtbare Problem',
    text: 'Ihr Objekt ist in Smoobu als verfügbar markiert. Auf Booking.com erscheint es für Gäste trotzdem nicht. Sie buchen woanders.',
  },
  {
    icon: Calendar,
    title: 'Die verpasste Zeit',
    text: 'Bis Sie den Fehler manuell entdecken, sind Tage oder Wochen vergangen. Diese Nächte sind unwiederbringlich verloren.',
  },
  {
    icon: TrendingDown,
    title: 'Die stille Kostenfalle',
    text: 'Kein Alarm. Keine E-Mail. Kein Hinweis von Booking.com oder Airbnb. Sie erfahren es nur, wenn Sie selbst nachschauen.',
  },
]

function PainPoints() {
  return (
    <section className="bg-[#111827] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-2xl font-bold text-white md:text-3xl">
          Was passiert gerade in Ihrem Kalender?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {painCards.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-[#2d3447] bg-[#1c2333] p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-900/40">
                <Icon className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="mb-3 font-semibold text-[#e2e8f0]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#8b98a9]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section 3: Story ──────────────────────────────────────────────────────────

function Story() {
  return (
    <section className="bg-[#0d1117] px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-white md:text-3xl">
          Was unsere Nutzer uns erzählt haben
        </h2>
        {/* TODO: echtes Testimonial nach Beta ersetzen */}
        <blockquote className="rounded-xl border border-[#2d3447] bg-[#1c2333] p-8">
          <p className="mb-6 text-lg leading-relaxed text-[#e2e8f0]">
            "Eine Vermieterin aus Bayern betreut sieben Ferienwohnungen über Smoobu. Im Februar
            bemerkte sie beim Blick in ihre Statistiken, dass eine ihrer beliebtesten Wohnungen drei
            Wochen lang kaum Anfragen hatte. Die Prüfung zeigte: Die Wohnung war auf Booking.com
            nicht sichtbar — ein Synchronisationsfehler nach einer Plattform-Aktualisierung."
          </p>
          <div className="flex items-center gap-4 border-t border-[#2d3447] pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2d3447] text-lg font-bold text-[#e2e8f0]">
              21
            </div>
            <div>
              <p className="font-semibold text-red-400">21 freie Tage. Keine einzige Buchungsanfrage.</p>
              <p className="text-sm text-[#8b98a9]">"Ich hätte das nie selbst gefunden."</p>
            </div>
          </div>
        </blockquote>
      </div>
    </section>
  )
}

// ── Section 4: Solution ───────────────────────────────────────────────────────

const solutionSteps = [
  {
    icon: Plug,
    step: '1',
    title: 'Verbinden',
    text: 'Smoobu API-Key eingeben, Booking.com und Airbnb Links Ihrer Objekte hinterlegen. Einmalig, dauert 5 Minuten.',
  },
  {
    icon: Eye,
    step: '2',
    title: 'Täglich prüfen',
    text: 'Jeden Morgen öffnet STR Watchdog Ihre Listings — so wie ein Gast es tut — und prüft ob jedes Objekt sichtbar und buchbar erscheint.',
  },
  {
    icon: Bell,
    step: '3',
    title: 'Sofort informiert',
    text: 'Nur wenn etwas nicht stimmt, erhalten Sie eine E-Mail. Mit genauer Beschreibung welches Objekt, welche Tage, welches Portal.',
  },
]

function Solution() {
  return (
    <section className="bg-[#111827] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-white md:text-3xl">
          STR Watchdog prüft täglich — aus Gästesicht
        </h2>
        <p className="mb-12 text-center text-sm italic text-[#8b98a9]">
          Nicht aus dem Backend Ihres Channel Managers. Aus der echten Gästeperspektive.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {solutionSteps.map(({ icon: Icon, step, title, text }) => (
            <div
              key={step}
              className="relative rounded-xl border border-[#2d3447] bg-[#1c2333] p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {step}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900/30">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-[#e2e8f0]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#8b98a9]">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#5a6478]">
          Wenn alles in Ordnung ist: keine E-Mail. Keine unnötigen Benachrichtigungen.
        </p>
      </div>
    </section>
  )
}

// ── Section 5: Testimonials ───────────────────────────────────────────────────

// TODO: echte Testimonials nach Beta einsetzen
const testimonials = [
  {
    quote:
      'Ich habe drei Wochen gebraucht um zu merken, dass eine meiner Wohnungen auf Airbnb nicht mehr auftauchte. Seit STR Watchdog weiß ich es am nächsten Morgen.',
    name: 'Maria K.',
    location: 'München',
    count: 8,
  },
  {
    quote:
      'Der Setup hat fünf Minuten gedauert. Seitdem schaue ich nur noch auf die E-Mails, nicht mehr täglich in alle Portale.',
    name: 'Thomas B.',
    location: 'Hamburg',
    count: 4,
  },
  {
    quote:
      'Ich dachte, mein Channel Manager macht das automatisch. Tut er nicht immer. STR Watchdog ist die zweite Kontrolle die ich brauchte.',
    name: 'Sandra M.',
    location: 'Wien',
    count: 12,
  },
]

function Testimonials() {
  return (
    <section className="bg-[#0d1117] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-2xl font-bold text-white md:text-3xl">
          Was Vermieter über STR Watchdog sagen
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl border border-[#2d3447] bg-[#1c2333] p-6"
            >
              <p className="mb-6 flex-1 text-sm leading-relaxed text-[#e2e8f0]">"{t.quote}"</p>
              <div className="border-t border-[#2d3447] pt-4">
                <p className="font-medium text-[#e2e8f0]">{t.name}</p>
                <p className="text-xs text-[#8b98a9]">
                  {t.location} · {t.count} Objekte
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section 6: Pricing ────────────────────────────────────────────────────────

const tiers = [
  {
    label: '1–5 Objekte',
    perObject: PRICE_TIER1,
    from: PRICE_TIER1,
    highlight: false,
  },
  {
    label: '6–10 Objekte',
    perObject: PRICE_TIER2,
    from: PRICE_TIER2 * 6,
    highlight: true,
  },
  {
    label: '11+ Objekte',
    perObject: PRICE_TIER3,
    from: null,
    highlight: false,
  },
]

function Pricing() {
  return (
    <section className="bg-[#111827] px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-3 text-center text-2xl font-bold text-white md:text-3xl">
          Transparent. Ohne Vertrag. Jederzeit kündbar.
        </h2>
        <p className="mb-12 text-center text-sm text-[#8b98a9]">
          Eine verpasste Buchungsnacht kostet Sie durchschnittlich mehr als einen ganzen Monat STR
          Watchdog.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.label}
              className={`rounded-xl border p-6 ${
                tier.highlight
                  ? 'border-blue-600 bg-blue-900/20'
                  : 'border-[#2d3447] bg-[#1c2333]'
              }`}
            >
              {tier.highlight && (
                <div className="mb-3 inline-flex rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">
                  Beliebteste Wahl
                </div>
              )}
              <p className="mb-2 font-semibold text-[#e2e8f0]">{tier.label}</p>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{tier.perObject} €</span>
                <span className="text-sm text-[#8b98a9]">/ Objekt / Monat</span>
              </div>
              {tier.from ? (
                <p className="mb-4 text-sm text-[#8b98a9]">ab {tier.from} € gesamt</p>
              ) : (
                <p className="mb-4 text-sm text-[#8b98a9]">Preis auf Anfrage</p>
              )}
              <ul className="space-y-2 text-sm text-[#8b98a9]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" /> Tägliche Prüfung
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" /> E-Mail-Alerts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" /> Booking.com + Airbnb
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-700"
          >
            Jetzt 14 Tage kostenlos testen
          </Link>
          <p className="text-sm text-[#5a6478]">
            Keine Kreditkarte. Keine automatische Verlängerung in der Testphase.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Section 7: FAQ ────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Greift STR Watchdog auf meine Buchungen oder Preise zu?',
    a: 'Nein. STR Watchdog liest nur die öffentliche Verfügbarkeit Ihrer Objekte — so wie ein Gast es tun würde. Keine Buchungen, keine Preise, keine Änderungen.',
  },
  {
    q: 'Was passiert mit meinem Smoobu API-Key?',
    a: 'Ihr API-Key wird verschlüsselt gespeichert und ausschließlich für die tägliche Verfügbarkeitsprüfung verwendet. Er verlässt unsere Server nicht.',
  },
  {
    q: 'Muss ich etwas installieren?',
    a: 'Nein. STR Watchdog läuft vollständig im Browser. Kein Download, keine App, kein Plugin.',
  },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-[#0d1117] px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-white md:text-3xl">
          Häufige Fragen
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-[#2d3447] bg-[#1c2333]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-[#e2e8f0]">{faq.q}</span>
                {open === i ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-[#8b98a9]" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#8b98a9]" />
                )}
              </button>
              {open === i && (
                <p className="border-t border-[#2d3447] px-5 py-4 text-sm leading-relaxed text-[#8b98a9]">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section 8: Final CTA ──────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="bg-gradient-to-b from-[#111827] to-[#0d1117] px-4 py-24 text-center">
      <div className="mx-auto max-w-xl">
        <p className="mb-8 text-xl font-medium text-[#8b98a9]">
          Während Sie das lesen, prüft niemand ob Ihre Objekte gerade buchbar sind.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-5 text-xl font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-700"
        >
          Jetzt kostenlos starten
        </Link>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#2d3447] bg-[#0d1117] px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-sm text-[#5a6478] md:flex-row md:justify-between">
        <p>© 2026 VWS Media / Michael Gründling</p>
        <nav className="flex gap-6">
          <Link to="/impressum" className="hover:text-[#8b98a9] transition-colors">
            Impressum
          </Link>
          <Link to="/datenschutz" className="hover:text-[#8b98a9] transition-colors">
            Datenschutzerklärung
          </Link>
          <a
            href="mailto:kontakt@strwatchdog.de"
            className="hover:text-[#8b98a9] transition-colors"
          >
            Kontakt
          </a>
        </nav>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Hero />
      <PainPoints />
      <Story />
      <Solution />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
