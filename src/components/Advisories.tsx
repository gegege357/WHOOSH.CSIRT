import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Gauge,
  Globe,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import type { AdvisorySeverity, SecurityAdvisory } from '../types/csirt'
import { useCsirt } from '../context/CsirtContext'
import NvdExplorer from './NvdExplorer'
import { AdvisoryBadge, Modal, Reveal, SectionHeading, formatDate } from './ui'

const FILTERS: Array<'ALL' | AdvisorySeverity> = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO']

const FILTER_ACTIVE: Record<string, string> = {
  ALL: 'bg-ink text-white border-ink',
  CRITICAL: 'bg-brand text-white border-brand shadow-md shadow-brand/30',
  HIGH: 'bg-ink text-white border-ink',
  MEDIUM: 'bg-slate-600 text-white border-slate-600',
  INFO: 'bg-brand-soft text-brand-deep border-brand/40',
}

export default function Advisories() {
  const { advisories } = useCsirt()
  const [mode, setMode] = useState<'WHOOSH' | 'NVD'>('WHOOSH')
  const [filter, setFilter] = useState<'ALL' | AdvisorySeverity>('ALL')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<SecurityAdvisory | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return advisories.filter((a) => {
      const matchSeverity = filter === 'ALL' || a.severity === filter
      const matchQuery =
        q === '' ||
        a.title.toLowerCase().includes(q) ||
        a.cveId.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      return matchSeverity && matchQuery
    })
  }, [advisories, filter, query])

  return (
    <section id="advisory" className="relative bg-paper py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="Peringatan Keamanan"
            title="Security Advisories & Buletin Siber Terbaru"
            description="Kerentanan kritis, kampanye aktif, dan panduan hardening yang dipantau tim intelijen WHOOSH CSIRT. Klik advisory untuk rincian teknis dan langkah mitigasi."
          />
        </Reveal>

        <Reveal delay={40}>
          <div className="mb-8 flex flex-wrap gap-2 rounded-xl border border-line bg-white p-2 shadow-sm">
            <button
              onClick={() => setMode('WHOOSH')}
              aria-pressed={mode === 'WHOOSH'}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${
                mode === 'WHOOSH' ? 'bg-ink text-white shadow-md' : 'text-slate-600 hover:bg-paper hover:text-ink'
              }`}
            >
              <ShieldCheck size={15} className={mode === 'WHOOSH' ? 'text-brand-bright' : 'text-brand'} />
              Advisory WHOOSH
              <span className={`rounded-full px-2 py-px font-mono text-[10px] font-bold ${mode === 'WHOOSH' ? 'bg-white/15 text-white' : 'bg-paper text-slate-500'}`}>
                {advisories.length}
              </span>
            </button>
            <button
              onClick={() => setMode('NVD')}
              aria-pressed={mode === 'NVD'}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${
                mode === 'NVD' ? 'bg-ink text-white shadow-md' : 'text-slate-600 hover:bg-paper hover:text-ink'
              }`}
            >
              <Globe size={15} className={mode === 'NVD' ? 'text-brand-bright' : 'text-brand'} />
              Cek Database NVD Global (Live)
              <span className={`rounded-full px-2 py-px font-mono text-[9px] font-bold tracking-wider ${mode === 'NVD' ? 'bg-green-500/20 text-green-300' : 'bg-green-50 text-green-700'}`}>
                NIST API
              </span>
            </button>
          </div>
        </Reveal>

        {mode === 'NVD' ? (
          <NvdExplorer
            title="Live NVD CVE Lookup"
            subtitle="Telusuri kerentanan apa pun secara real-time langsung dari NIST National Vulnerability Database (API v2.0). Data pihak ketiga untuk riset mandiri — bukan advisory resmi WHOOSH CSIRT; panduan mitigasi resmi tersedia di tab Advisory WHOOSH."
            isLead={false}
            showKeyPanel={false}
            perPage={12}
          />
        ) : (
          <>
        <Reveal delay={60}>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md border px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all ${
                    filter === f
                      ? FILTER_ACTIVE[f]
                      : 'border-line bg-white text-slate-600 hover:border-slate-400 hover:text-ink'
                  }`}
                >
                  {f}
                  {f !== 'ALL' && (
                    <span className="ml-1.5 opacity-60">
                      {advisories.filter((a) => a.severity === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul atau CVE… (mis. CVE-2026)"
                className="w-full rounded-md border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20"
                aria-label="Cari advisory"
              />
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <ShieldCheck size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="font-display text-lg font-bold text-ink">Tidak ada advisory yang cocok</p>
            <p className="mt-1 text-sm text-slate-500">
              Coba ubah kata kunci pencarian atau pilih tingkat keparahan lain.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 70}>
                <button
                  onClick={() => setSelected(a)}
                  className="group flex h-full w-full flex-col rounded-xl border border-line bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <AdvisoryBadge severity={a.severity} />
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400">
                      {a.id}
                    </span>
                  </div>
                  <h3 className="font-display text-[16px] font-bold leading-snug text-ink transition-colors group-hover:text-brand-deep">
                    {a.title}
                  </h3>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-slate-500">
                    <span className="font-bold text-brand">{a.cveId}</span>
                    <span className="flex items-center gap-1">
                      <Gauge size={11} /> CVSS {a.cvssScore}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={11} /> {formatDate(a.publishedDate)}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-3 flex-1 text-[13px] leading-relaxed text-slate-600">
                    {a.summary}
                  </p>
                  <span className="mt-4 flex items-center gap-1 text-[13px] font-bold text-brand">
                    Baca Detail & Mitigasi
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        )}
          </>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={selected !== null} onClose={() => setSelected(null)} maxWidth="max-w-3xl">
        {selected && (
          <div>
            <div className="border-b-4 border-brand bg-ink px-6 py-6 text-white sm:px-8">
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <AdvisoryBadge severity={selected.severity} />
                <span className="font-mono text-[11px] font-bold tracking-wider text-brand-bright">
                  {selected.cveId}
                </span>
                <span className="font-mono text-[11px] tracking-wider text-slate-400">{selected.id}</span>
              </div>
              <h3 className="pr-8 font-display text-xl font-bold leading-snug sm:text-2xl">
                {selected.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Gauge size={12} className="text-brand-bright" /> CVSS {selected.cvssScore}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={12} className="text-brand-bright" /> RILIS {formatDate(selected.publishedDate)}
                </span>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <ShieldAlert size={13} /> Ringkasan
                </h4>
                <p className="text-sm leading-relaxed text-slate-700">{selected.summary}</p>
              </div>

              <div>
                <h4 className="mb-2.5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <Layers size={13} /> Sistem Terdampak
                </h4>
                <ul className="space-y-1.5">
                  {selected.affectedSystems.map((s) => (
                    <li key={s} className="flex items-start gap-2 rounded-md bg-paper px-3 py-2 font-mono text-[12px] text-slate-700">
                      <ChevronRight size={13} className="mt-0.5 shrink-0 text-brand" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <Search size={13} /> Deskripsi Teknis
                </h4>
                <p className="rounded-lg border-l-4 border-ink bg-paper p-4 text-[13px] leading-relaxed text-slate-700">
                  {selected.technicalDetails}
                </p>
              </div>

              <div>
                <h4 className="mb-2.5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <Wrench size={13} /> Langkah Mitigasi
                </h4>
                <ol className="space-y-2">
                  {selected.mitigationSteps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-slate-700">
                      <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded bg-brand font-mono text-[10px] font-bold text-white" style={{ height: 22, width: 22 }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg bg-ink px-4 py-3 text-xs leading-relaxed text-slate-300">
                Terdampak atau menemukan indikasi eksploitasi?{' '}
                <button
                  onClick={() => {
                    setSelected(null)
                    setTimeout(() => document.getElementById('lapor')?.scrollIntoView({ behavior: 'smooth' }), 80)
                  }}
                  className="font-bold text-brand-bright underline underline-offset-2 hover:text-white"
                >
                  Laporkan insiden sekarang
                </button>{' '}
                — sertakan ID advisory ini pada kronologi laporan Anda.
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}