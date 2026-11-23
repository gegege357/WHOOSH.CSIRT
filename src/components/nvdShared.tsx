import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  AlertOctagon,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Database,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react'
import type { NvdCve, NvdCvss, NvdSeverityFilter } from '../types/nvd'
import type { NvdError } from '../services/nvdService'
import { NVD_MAX_WINDOW_DAYS, NVD_RATE_LIMIT, NVD_WINDOW_PRESETS } from '../services/nvdService'
import { formatDate } from './ui'

const CVSS_SOLID: Record<string, string> = {
  CRITICAL: 'bg-brand text-white',
  HIGH: 'bg-ink text-white',
  MEDIUM: 'bg-amber-400 text-ink',
  LOW: 'bg-slate-200 text-ink',
  NONE: 'bg-slate-100 text-slate-600',
}

export function CvssBadge({ cvss }: { cvss: NvdCvss | null }) {
  if (!cvss) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-bold text-slate-500">
        CVSS —
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] font-bold tracking-wide ${
        CVSS_SOLID[cvss.severity] ?? CVSS_SOLID.NONE
      }`}
      title={cvss.vector ?? undefined}
    >
      <span className="text-[12px] tabular-nums">{cvss.score.toFixed(1)}</span>
      {cvss.severity}
      <span className="text-[8.5px] font-semibold opacity-70">v{cvss.version}</span>
    </span>
  )
}

const VECTOR_METRIC: Record<string, string> = {
  AV: 'Attack Vector',
  AC: 'Attack Complexity',
  PR: 'Privileges Required',
  UI: 'User Interaction',
  S: 'Scope',
  C: 'Confidentiality',
  I: 'Integrity',
  A: 'Availability',
  Au: 'Authentication',
}

const VECTOR_VALUE: Record<string, Record<string, string>> = {
  AV: { N: 'Network', A: 'Adjacent', L: 'Local', P: 'Physical' },
  AC: { L: 'Low', H: 'High' },
  PR: { N: 'None', L: 'Low', H: 'High' },
  UI: { N: 'None', R: 'Required' },
  S: { U: 'Unchanged', C: 'Changed' },
  C: { H: 'High', L: 'Low', N: 'None' },
  I: { H: 'High', L: 'Low', N: 'None' },
  A: { H: 'High', L: 'Low', N: 'None' },
  Au: { N: 'None', S: 'Single', M: 'Multiple' },
}

export function parseCvssVector(vector: string): Array<{ key: string; metric: string; value: string }> {
  return vector
    .replace(/^CVSS:\d\.\d\//, '')
    .split('/')
    .map((part) => {
      const [key, val] = part.split(':')
      if (!key || !val) return null
      return { key, metric: VECTOR_METRIC[key] ?? key, value: VECTOR_VALUE[key]?.[val] ?? val }
    })
    .filter((m): m is { key: string; metric: string; value: string } => m !== null)
}

export function NvdWindowChips({ value, onChange }: { value: number; onChange: (days: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Jendela publikasi NVD">
      {NVD_WINDOW_PRESETS.map((p) => (
        <button
          key={p.days}
          type="button"
          onClick={() => onChange(p.days)}
          aria-pressed={value === p.days}
          title={`pubStartDate–pubEndDate: ${p.days} hari terakhir`}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-wider transition-all ${
            value === p.days
              ? 'border-brand bg-brand text-white shadow-md shadow-brand/25'
              : 'border-line bg-white text-slate-600 hover:border-brand hover:text-brand'
          }`}
        >
          {p.label}
          {p.days === NVD_MAX_WINDOW_DAYS && <span className="ml-1 opacity-70">MAKS</span>}
        </button>
      ))}
    </div>
  )
}

export function NvdSourceChip({ source }: { source: 'LIVE' | 'DEMO' }) {
  return source === 'LIVE' ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-2.5 py-1 font-mono text-[9.5px] font-bold tracking-wider text-green-700">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
      </span>
      LIVE NVD
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-[9.5px] font-bold tracking-wider text-amber-800">
      <Database size={10} /> DEMO OFFLINE
    </span>
  )
}

export const NVD_SEVERITY_FILTERS: Array<'ALL' | NvdSeverityFilter> = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM']

const NVD_FILTER_ACTIVE: Record<string, string> = {
  ALL: 'border-ink bg-ink text-white',
  CRITICAL: 'border-brand bg-brand text-white shadow-md shadow-brand/30',
  HIGH: 'border-ink bg-ink text-white',
  MEDIUM: 'border-amber-400 bg-amber-400 text-ink',
}

export function NvdSeverityChips({
  value,
  onChange,
  counts,
}: {
  value: 'ALL' | NvdSeverityFilter
  onChange: (v: 'ALL' | NvdSeverityFilter) => void
  counts?: Record<string, number>
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {NVD_SEVERITY_FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          aria-pressed={value === f}
          className={`rounded-md border px-3.5 py-2 font-mono text-[11px] font-bold tracking-wider transition-all ${
            value === f
              ? NVD_FILTER_ACTIVE[f]
              : 'border-line bg-white text-slate-600 hover:border-slate-400 hover:text-ink'
          }`}
        >
          {f}
          {counts && f !== 'ALL' && <span className="ml-1.5 opacity-60">{counts[f] ?? 0}</span>}
        </button>
      ))}
    </div>
  )
}

function pageWindow(page: number, last: number): Array<number | '…'> {
  const nums = new Set<number>([1, last, page - 1, page, page + 1])
  const sorted = [...nums].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b)
  const out: Array<number | '…'> = []
  let prev = 0
  for (const n of sorted) {
    if (prev && n - prev > 1) out.push('…')
    out.push(n)
    prev = n
  }
  return out
}

export function NvdPagination({
  page,
  totalPages,
  total,
  perPage,
  loading,
  keyed,
  onChange,
}: {
  page: number
  totalPages: number
  total: number
  perPage: number
  loading: boolean
  keyed: boolean
  onChange: (page: number) => void
}) {
  const [draft, setDraft] = useState('')
  const go = (p: number) => {
    const clamped = Math.min(totalPages, Math.max(1, p))
    if (clamped !== page) onChange(clamped)
  }
  const jump = () => {
    const n = Number.parseInt(draft, 10)
    if (Number.isFinite(n)) go(n)
    setDraft('')
  }
  const btn =
    'flex h-8 w-8 items-center justify-center rounded-md border font-mono text-[11px] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-35'
  const idle = 'border-line bg-white text-slate-600 hover:border-brand hover:text-brand'
  return (
    <nav
      aria-label="Pagination feed NVD"
      className="mt-6 rounded-xl border border-line bg-white p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <p className="font-mono text-[10px] font-bold tracking-wider text-slate-500">
          HALAMAN <span className="text-brand">{page}</span>/{totalPages} ·{' '}
          {total.toLocaleString('id-ID')} CVE · {perPage}/HALAMAN · STARTINDEX{' '}
          {(page - 1) * perPage}
        </p>
        <p className="font-mono text-[9.5px] tracking-wider text-slate-400">
          {keyed
            ? `API KEY AKTIF · MAKS ${NVD_RATE_LIMIT.keyed} REQ/${NVD_RATE_LIMIT.windowSeconds}S (ANTRIAN OTOMATIS)`
            : `TANPA KEY · MAKS ${NVD_RATE_LIMIT.anon} REQ/${NVD_RATE_LIMIT.windowSeconds}S (ANTRIAN OTOMATIS)`}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <button type="button" aria-label="Halaman pertama" title="Halaman pertama" disabled={loading || page <= 1} onClick={() => go(1)} className={`${btn} ${idle}`}>
          <ChevronsLeft size={14} />
        </button>
        <button type="button" aria-label="Halaman sebelumnya" title="Halaman sebelumnya" disabled={loading || page <= 1} onClick={() => go(page - 1)} className={`${btn} ${idle}`}>
          <ChevronLeft size={14} />
        </button>
        {pageWindow(page, totalPages).map((n, i) =>
          n === '…' ? (
            <span key={`gap-${i}`} className="px-1 font-mono text-[11px] text-slate-400">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              aria-label={`Halaman ${n}`}
              aria-current={n === page ? 'page' : undefined}
              disabled={loading}
              onClick={() => go(n)}
              className={`${btn} w-auto min-w-8 px-2 ${
                n === page
                  ? 'border-brand bg-brand text-white shadow-md shadow-brand/25'
                  : idle
              }`}
            >
              {n}
            </button>
          ),
        )}
        <button type="button" aria-label="Halaman berikutnya" title="Halaman berikutnya" disabled={loading || page >= totalPages} onClick={() => go(page + 1)} className={`${btn} ${idle}`}>
          <ChevronRight size={14} />
        </button>
        <button type="button" aria-label="Halaman terakhir" title="Halaman terakhir" disabled={loading || page >= totalPages} onClick={() => go(totalPages)} className={`${btn} ${idle}`}>
          <ChevronsRight size={14} />
        </button>
        <form
          className="ml-auto flex items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault()
            jump()
          }}
        >
          <label htmlFor="nvd-jump-page" className="font-mono text-[10px] font-bold tracking-wider text-slate-500">
            KE HAL
          </label>
          <input
            id="nvd-jump-page"
            type="number"
            min={1}
            max={totalPages}
            inputMode="numeric"
            value={draft}
            disabled={loading}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={String(page)}
            aria-label="Lompat ke halaman"
            className="h-8 w-16 rounded-md border border-line bg-paper px-2 text-center font-mono text-[11px] font-bold text-ink outline-none transition-colors focus:border-brand disabled:opacity-35"
          />
          <button
            type="submit"
            disabled={loading || draft.trim() === ''}
            className="h-8 rounded-md bg-ink px-3 font-mono text-[10px] font-bold tracking-wider text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-35"
          >
            GO
          </button>
        </form>
      </div>
    </nav>
  )
}

export function NvdSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Memuat data NVD" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="h-5 w-28 rounded bg-slate-200" />
            <div className="h-6 w-24 rounded-md bg-slate-200" />
          </div>
          <div className="mt-4 h-3.5 w-3/4 rounded bg-slate-200" />
          <div className="mt-2.5 space-y-2">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
          <div className="mt-5 flex gap-2">
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="h-3 w-32 rounded bg-slate-100" />
          </div>
          <div className="mt-5 h-9 w-full rounded-md bg-slate-200" />
        </div>
      ))}
    </div>
  )
}

const ERROR_LABEL: Record<NvdError['kind'], string> = {
  RATE_LIMIT: 'RATE LIMIT NVD',
  NETWORK: 'KONEKSI TERPUTUS',
  NOT_FOUND: 'CVE TIDAK DITEMUKAN',
  BAD_REQUEST: 'PARAMETER DITOLAK',
  SERVER: 'SERVER NVD SIBUK',
}

export function NvdErrorPanel({
  error,
  onRetry,
  onDemo,
}: {
  error: NvdError
  onRetry: () => void
  onDemo: () => void
}) {
  return (
    <div className="animate-fade-up rounded-xl border-2 border-brand/30 bg-brand-soft/60 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
          <AlertOctagon size={19} />
        </span>
        <span className="rounded-md border border-brand/40 bg-white px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-brand-deep">
          {ERROR_LABEL[error.kind]}
          {error.status ? ` · HTTP ${error.status}` : ''}
        </span>
      </div>
      <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-slate-700">{error.message}</p>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-ink-deep"
        >
          <RefreshCw size={14} /> Coba Lagi
        </button>
        <button
          type="button"
          onClick={onDemo}
          className="flex items-center gap-2 rounded-md border-2 border-amber-500 bg-white px-5 py-2.5 text-[12.5px] font-bold text-amber-700 transition-colors hover:bg-amber-400 hover:text-ink"
        >
          <Database size={14} /> Gunakan Dataset Demo Offline
        </button>
      </div>
    </div>
  )
}

export function NvdDemoBanner({ onRetryLive }: { onRetryLive: () => void }) {
  return (
    <div className="animate-fade-up mb-5 flex flex-col gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-amber-800">
        <ShieldAlert size={15} className="mt-0.5 shrink-0" />
        <span>
          <strong className="font-bold">Mode demo offline.</strong> Live NVD tidak terjangkau (rate-limit /
          jaringan) — menampilkan dataset contoh lokal, bukan data live NIST.
        </span>
      </p>
      <button
        type="button"
        onClick={onRetryLive}
        className="flex shrink-0 items-center gap-1.5 rounded-md border-2 border-amber-500 bg-white px-4 py-2 font-mono text-[11px] font-bold text-amber-700 transition-colors hover:bg-amber-400 hover:text-ink"
      >
        <RefreshCw size={13} /> Coba Live Lagi
      </button>
    </div>
  )
}

export function NvdCveCard({
  cve,
  expanded,
  onToggleExpand,
  action,
}: {
  cve: NvdCve
  expanded: boolean
  onToggleExpand: () => void
  action?: ReactNode
}) {
  const longDesc = cve.description.length > 240
  const refs = expanded ? cve.references : cve.references.slice(0, 3)
  return (
    <article className="flex h-full min-w-0 flex-col rounded-xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[13px] font-bold tracking-wider text-brand">{cve.id}</span>
        <CvssBadge cvss={cve.cvss} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10.5px] text-slate-500">
        <span className="flex items-center gap-1">
          <CalendarDays size={11} /> PUBLIKASI {cve.published ? formatDate(cve.published) : '—'}
        </span>
        {cve.weaknesses.slice(0, 2).map((w, i) => (
          <span key={`${w}-${i}`} className="rounded bg-paper px-1.5 py-px font-bold text-slate-600">
            {w}
          </span>
        ))}
      </div>
      <p
        className={`mt-3 flex-1 text-[12.5px] leading-relaxed text-slate-600 ${
          expanded ? '' : 'line-clamp-4'
        }`}
      >
        {cve.description}
      </p>
      {longDesc && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="mt-2 flex w-fit items-center gap-1 font-mono text-[10.5px] font-bold text-brand transition-colors hover:text-brand-deep"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Ringkas deskripsi' : 'Baca lengkap'}
        </button>
      )}
      {expanded && cve.cvss && (
        <div className="mt-3 rounded-lg border border-line bg-paper p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[9.5px] font-bold tracking-wider text-slate-500">
            <span>DETAIL CVSS v{cve.cvss.version}</span>
            <span className="flex gap-3">
              <span>EXPLOITABILITY {cve.cvss.exploitability != null ? cve.cvss.exploitability.toFixed(1) : '—'}</span>
              <span>IMPACT {cve.cvss.impact != null ? cve.cvss.impact.toFixed(1) : '—'}</span>
            </span>
          </div>
          {cve.cvss.vector && (
            <code className="mt-2 block break-all font-mono text-[10.5px] leading-relaxed text-brand-deep">
              {cve.cvss.vector}
            </code>
          )}
          {cve.cvss.vector && parseCvssVector(cve.cvss.vector).length > 0 && (
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              {parseCvssVector(cve.cvss.vector).map((m) => (
                <div key={m.key} className="rounded-md border border-line bg-white px-2 py-1.5">
                  <div className="font-mono text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
                    {m.metric}
                  </div>
                  <div className="text-[11px] font-bold text-ink">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {refs.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-line pt-3">
          {refs.map((r, i) => (
            <li key={`${r.url}-${i}`}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 max-w-full items-center gap-1.5 truncate font-mono text-[10.5px] text-slate-500 underline-offset-2 transition-colors hover:text-brand hover:underline"
                title={r.url}
              >
                <ExternalLink size={10} className="shrink-0 text-brand" />
                <span className="min-w-0 truncate">{r.url.replace(/^https?:\/\//, '')}</span>
              </a>
            </li>
          ))}
          {!expanded && cve.references.length > 3 && (
            <li className="font-mono text-[10px] text-slate-400">
              +{cve.references.length - 3} referensi lain (baca lengkap)
            </li>
          )}
        </ul>
      )}
      {action && <div className="mt-4">{action}</div>}
    </article>
  )
}