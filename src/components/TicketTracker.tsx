import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  CalendarClock,
  CheckCircle2,
  FileSearch,
  History,
  Inbox,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Search,
  SearchX,
  Ticket,
  User,
} from 'lucide-react'
import type { IncidentStatus } from '../types/csirt'
import { useCsirt } from '../context/CsirtContext'
import { Reveal, SectionHeading, SeverityBadge, StatusBadge, formatDateTime } from './ui'

const STATUS_ORDER: IncidentStatus[] = ['OPEN', 'TRIAGED', 'INVESTIGATING', 'CONTAINMENT', 'RESOLVED']

const STEP_LABEL: Record<IncidentStatus, string> = {
  OPEN: 'Open',
  TRIAGED: 'Triaged',
  INVESTIGATING: 'Investigating',
  CONTAINMENT: 'Containment',
  RESOLVED: 'Resolved',
}

const STEP_DESC: Record<IncidentStatus, string> = {
  OPEN: 'Laporan diterima & antre triase',
  TRIAGED: 'Terverifikasi & analis ditugaskan',
  INVESTIGATING: 'Analis menelusuri akar masalah',
  CONTAINMENT: 'Dampak dibatasi & disterilkan',
  RESOLVED: 'Pulih penuh & tiket ditutup',
}

export default function TicketTracker({ prefillTicketId }: { prefillTicketId: string | null }) {
  const { getIncidentByTicketId, lastCreatedTicketId } = useCsirt()
  const [query, setQuery] = useState('')
  const [searchedId, setSearchedId] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const incident = searchedId ? getIncidentByTicketId(searchedId) : undefined

  const doSearch = (raw: string) => {
    const id = raw.trim()
    if (!id) return
    setSearchedId(id)
    setNotFound(!getIncidentByTicketId(id))
  }

  useEffect(() => {
    if (prefillTicketId) {
      setQuery(prefillTicketId)
      setSearchedId(prefillTicketId)
      setNotFound(false)
    }
  }, [prefillTicketId])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    doSearch(query)
  }

  const activeIdx = incident ? STATUS_ORDER.indexOf(incident.status) : -1

  return (
    <section id="lacak" className="relative overflow-hidden bg-white py-20 lg:py-24">
      <div className="speed-stripes pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="Ticket Tracker"
            title="Lacak Status Penanganan Insiden"
            description="Masukkan nomor tiket dari laporan Anda untuk melihat status terkini dan seluruh catatan resmi tim analis WHOOSH CSIRT — diperbarui secara real-time."
          />
        </Reveal>

        <Reveal delay={60}>
          <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Ticket size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan nomor tiket, mis. WSH-2026-1001"
                className="w-full rounded-md border-2 border-ink bg-white py-3.5 pl-11 pr-4 font-mono text-sm font-semibold uppercase tracking-wider text-ink outline-none transition-all placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/15"
                aria-label="Nomor tiket"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-md bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/30 transition-all hover:bg-brand-deep hover:shadow-lg"
            >
              <Search size={16} />
              Lacak Tiket
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold">Coba cepat:</span>
            {['WSH-2026-1001', 'WSH-2026-1002', 'WSH-2026-1003'].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setQuery(id)
                  doSearch(id)
                }}
                className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[11px] font-semibold text-slate-600 transition-colors hover:border-brand hover:text-brand"
              >
                {id}
              </button>
            ))}
            {lastCreatedTicketId && (
              <button
                onClick={() => {
                  setQuery(lastCreatedTicketId)
                  doSearch(lastCreatedTicketId)
                }}
                className="rounded-full border border-brand/40 bg-brand-soft px-3 py-1 font-mono text-[11px] font-bold text-brand-deep transition-colors hover:bg-brand hover:text-white"
              >
                ★ {lastCreatedTicketId} (tiket Anda)
              </button>
            )}
          </div>
        </Reveal>

        {/* Not found */}
        {notFound && !incident && (
          <div className="animate-fade-up mt-8 max-w-2xl rounded-xl border-2 border-brand/30 bg-brand-soft/50 p-8 text-center">
            <SearchX size={30} className="mx-auto mb-3 text-brand" />
            <h3 className="font-display text-lg font-bold text-ink">Tiket Tidak Ditemukan</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Nomor <span className="font-mono font-bold text-brand-deep">{searchedId}</span> tidak
              terdaftar. Periksa kembali penulisan (format WSH-2026-XXXX), atau buat laporan baru
              melalui Incident Report Center.
            </p>
          </div>
        )}

        {/* Result */}
        {incident && (
          <div className="animate-fade-up mt-10 overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-slate-900/5">
            {/* header */}
            <div className="flex flex-col gap-4 border-b border-line bg-paper px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-lg font-bold tracking-wider text-brand">
                    {incident.ticketId}
                  </span>
                  <StatusBadge status={incident.status} />
                  <SeverityBadge severity={incident.severity} pulse />
                </div>
                <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-ink">
                  {incident.title}
                </h3>
              </div>
              <div className="shrink-0 text-right font-mono text-[11px] leading-relaxed text-slate-500">
                <div>DIBUAT: {formatDateTime(incident.createdAt)}</div>
                <div>UPDATE: {formatDateTime(incident.updatedAt)}</div>
              </div>
            </div>

            {/* stepper */}
            <div className="border-b border-line px-6 py-7 sm:px-8">
              <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-5 sm:gap-y-0">
                {STATUS_ORDER.map((s, i) => {
                  const done = i < activeIdx
                  const current = i === activeIdx
                  return (
                    <div key={s} className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
                      {i < STATUS_ORDER.length - 1 && (
                        <span
                          className={`absolute left-[calc(50%+20px)] top-4 hidden h-[3px] w-[calc(100%-40px)] sm:block ${
                            i < activeIdx ? 'bg-brand' : 'bg-line'
                          }`}
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-colors ${
                          done
                            ? 'border-brand bg-brand text-white'
                            : current
                              ? 'border-brand bg-white text-brand shadow-[0_0_0_5px_rgba(217,4,41,0.15)]'
                              : 'border-line bg-white text-slate-400'
                        }`}
                      >
                        {done ? <CheckCircle2 size={15} /> : i + 1}
                      </span>
                      <span className={`mt-2.5 text-[13px] font-bold ${current ? 'text-brand' : done ? 'text-ink' : 'text-slate-400'}`}>
                        {STEP_LABEL[s]}
                      </span>
                      <span className="mt-0.5 max-w-[150px] text-[11px] leading-snug text-slate-500">
                        {STEP_DESC[s]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-5">
              {/* report detail */}
              <div className="border-b border-line px-6 py-6 sm:px-8 lg:col-span-2 lg:border-b-0 lg:border-r">
                <h4 className="mb-4 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <FileSearch size={13} /> Detail Laporan
                </h4>
                <dl className="space-y-3 text-[13px]">
                  {[
                    { icon: User, k: 'Pelapor', v: incident.reporterName },
                    { icon: Inbox, k: 'Instansi', v: incident.organization },
                    { icon: Mail, k: 'Email', v: incident.email },
                    { icon: Phone, k: 'Telepon', v: incident.phone },
                    { icon: MapPin, k: 'Sistem Terdampak', v: incident.targetSystem },
                    { icon: CalendarClock, k: 'Waktu Kejadian', v: formatDateTime(incident.incidentDate) },
                  ].map((row) => (
                    <div key={row.k} className="flex gap-2.5">
                      <row.icon size={14} className="mt-0.5 shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">{row.k}</dt>
                        <dd className="break-words font-medium text-ink">{row.v}</dd>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2.5">
                    <Ticket size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <div>
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">Kategori</dt>
                      <dd className="font-medium text-ink">{incident.category}</dd>
                    </div>
                  </div>
                  {incident.evidenceFileName && (
                    <div className="flex gap-2.5">
                      <Paperclip size={14} className="mt-0.5 shrink-0 text-slate-400" />
                      <div>
                        <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">Bukti</dt>
                        <dd className="break-all font-mono text-[12px] font-medium text-ink">{incident.evidenceFileName}</dd>
                      </div>
                    </div>
                  )}
                </dl>
                <div className="mt-5 rounded-lg bg-paper p-4">
                  <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Kronologi dari Pelapor
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-slate-700">{incident.description}</p>
                </div>
              </div>

              {/* timeline */}
              <div className="px-6 py-6 sm:px-8 lg:col-span-3">
                <h4 className="mb-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <History size={13} /> Riwayat Penanganan Tim CSIRT
                </h4>
                <ol className="relative space-y-6 border-l-2 border-line pl-6">
                  {[...incident.timeline].reverse().map((t, i) => (
                    <li key={`${t.timestamp}-${i}`} className="relative">
                      <span
                        className={`absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ${
                          i === 0 ? 'bg-brand shadow-[0_0_0_4px_rgba(217,4,41,0.2)]' : 'bg-slate-300'
                        }`}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={t.status} />
                        <span className="font-mono text-[10.5px] text-slate-400">
                          {formatDateTime(t.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700">{t.note}</p>
                      <p className="mt-1 font-mono text-[11px] font-bold text-ink">— {t.officer}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}