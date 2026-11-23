import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  CalendarClock,
  Database,
  Download,
  Globe,
  KeyRound,
  Lock,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'
import type { NvdCve, NvdFeedResult, NvdSeverityFilter } from '../types/nvd'
import {
  NVD_ENDPOINT,
  NVD_FEED_WINDOW_DAYS,
  NVD_MAX_WINDOW_DAYS,
  NvdError,
  demoFeed,
  fetchNvdFeed,
  getNvdApiKey,
  nvdPubWindow,
  setNvdApiKeyOverride,
} from '../services/nvdService'
import type { NvdKeyInfo } from '../services/nvdService'
import {
  CvssBadge,
  NvdCveCard,
  NvdDemoBanner,
  NvdErrorPanel,
  NvdPagination,
  NvdSeverityChips,
  NvdSkeletonGrid,
  NvdSourceChip,
  NvdWindowChips,
} from './nvdShared'
import { formatDate } from './ui'

const QUICK_SEARCHES = ['CVE-2024-3094', 'CVE-2021-44228', 'Apache']

export default function NvdExplorer({
  title,
  subtitle,
  isLead,
  showKeyPanel,
  onImport,
  perPage = 18,
}: {
  title: string
  subtitle: string
  isLead: boolean
  showKeyPanel: boolean
  onImport?: (cve: NvdCve, source: 'LIVE' | 'DEMO') => void
  perPage?: number
}) {
  const [severity, setSeverity] = useState<'ALL' | NvdSeverityFilter>('ALL')
  const [windowDays, setWindowDays] = useState(NVD_FEED_WINDOW_DAYS)
  const [queryDraft, setQueryDraft] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NvdError | null>(null)
  const [result, setResult] = useState<NvdFeedResult | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [keyInfo, setKeyInfo] = useState<NvdKeyInfo>(getNvdApiKey)
  const [keyDraft, setKeyDraft] = useState('')
  const [keyFlash, setKeyFlash] = useState<string | null>(null)
  const feedRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let alive = true
    const ac = new AbortController()
    setLoading(true)
    if (demoMode) {
      setResult(demoFeed({ severity, keyword: query, perPage, windowDays, page }))
      setError(null)
      setLoading(false)
      return () => {
        alive = false
        ac.abort()
      }
    }
    fetchNvdFeed({ severity, keyword: query, perPage, windowDays, page }, ac.signal)
      .then((r) => {
        if (!alive) return
        setResult(r)
        setError(null)
      })
      .catch((e: unknown) => {
        if (!alive) return
        if (e instanceof NvdError && (e.kind === 'RATE_LIMIT' || e.kind === 'NETWORK')) {
          setPage(1)
          setDemoMode(true)
          setResult(demoFeed({ severity, keyword: query, perPage, windowDays, page: 1 }))
          setError(null)
        } else {
          setError(e instanceof NvdError ? e : new NvdError('SERVER', 'Terjadi kesalahan tak terduga saat menghubungi NVD.'))
          setResult(null)
        }
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
      ac.abort()
    }
  }, [severity, query, reloadKey, demoMode, perPage, windowDays, page])

  const totalPages = result ? Math.max(1, Math.ceil(result.total / perPage)) : 1

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const changePage = (p: number) => {
    setPage(p)
    setExpanded(new Set())
    feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0 }
    for (const cve of result?.cves ?? []) {
      if (cve.cvss && c[cve.cvss.severity] !== undefined) c[cve.cvss.severity] += 1
    }
    return c
  }, [result])

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    setQuery(queryDraft.trim())
    setPage(1)
    setExpanded(new Set())
  }

  const quickSearch = (q: string) => {
    setQueryDraft(q)
    setQuery(q)
    setPage(1)
    setExpanded(new Set())
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const saveKey = () => {
    const clean = keyDraft.trim()
    if (!clean) {
      setKeyFlash('Isi API key terlebih dahulu, atau gunakan Hapus Key UI.')
      setTimeout(() => setKeyFlash(null), 3200)
      return
    }
    setNvdApiKeyOverride(clean)
    setKeyInfo(getNvdApiKey())
    setKeyDraft('')
    setKeyFlash('API key disimpan di localStorage browser ini — permintaan NVD berikutnya memakainya.')
    setTimeout(() => setKeyFlash(null), 3600)
    setDemoMode(false)
    setReloadKey((k) => k + 1)
  }

  const clearKey = () => {
    setNvdApiKeyOverride(null)
    setKeyInfo(getNvdApiKey())
    setKeyFlash('Key UI dihapus — kembali memakai VITE_NVD_API_KEY dari environment (bila ada).')
    setTimeout(() => setKeyFlash(null), 3600)
    setDemoMode(false)
    setReloadKey((k) => k + 1)
  }

  const source = result?.source ?? (demoMode ? 'DEMO' : 'LIVE')
  const win = result?.range ?? nvdPubWindow(windowDays)
  const sameDay = win.pubStartDate.slice(0, 10) === win.pubEndDate.slice(0, 10)
  const rangeText = sameDay
    ? `${formatDate(win.pubStartDate)} · 00:00–23:59 UTC`
    : `${formatDate(win.pubStartDate)} → ${formatDate(win.pubEndDate)} · UTC`

  return (
    <div>
      {/* header strip */}
      <div className="mb-5 overflow-hidden rounded-xl border border-white/10 bg-ink text-white shadow-lg">
        <div className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 font-display text-[16px] font-bold">
              <Globe size={17} className="shrink-0 text-brand-bright" /> {title}
            </h3>
            <p className="mt-1 max-w-2xl text-[11.5px] leading-relaxed text-slate-400">{subtitle}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <NvdSourceChip source={source} />
            <span className="font-mono text-[10px] tracking-wider text-slate-400">
              {result
                ? `${result.cves.length} DITAMPILKAN · ${result.total.toLocaleString('id-ID')} TOTAL${
                    totalPages > 1 ? ` · HAL ${page}/${totalPages}` : ''
                  }${result.range ? ` · ${result.range.days} HARI · URUT TERBARU` : ''}`
                : '—'}
            </span>
            <button
              type="button"
              onClick={() => {
                setDemoMode(false)
                setReloadKey((k) => k + 1)
              }}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md border border-white/25 px-3 py-1.5 font-mono text-[10.5px] font-bold text-white transition-colors hover:border-white hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> MUAT ULANG
            </button>
          </div>
        </div>
        <div className="border-t border-white/10 bg-ink-deep px-5 py-2 font-mono text-[9.5px] leading-relaxed tracking-wider text-slate-500">
          ENDPOINT: {NVD_ENDPOINT.replace(/^https?:\/\//, '')} ·{' '}
          {keyInfo.source === 'NONE'
            ? 'TANPA KEY (±5 REQ/30 DETIK)'
            : `KEY ${keyInfo.source} DIPAKAI VIA PROXY DEV SERVER · TANPA PROXY: LIVE TANPA KEY (±5 REQ/30 DETIK)`}
        </div>
      </div>

      {/* pengaturan API key (admin) */}
      {showKeyPanel && (
        <div className="mb-5 rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <KeyRound size={13} className="text-brand" /> Pengaturan API Key NVD
            </h4>
            <span
              className={`rounded-md border px-2.5 py-1 font-mono text-[9.5px] font-bold tracking-wider ${
                keyInfo.source === 'NONE'
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-green-300 bg-green-50 text-green-700'
              }`}
            >
              SUMBER KEY: {keyInfo.source === 'UI' ? 'LOCALSTORAGE (UI)' : keyInfo.source === 'ENV' ? '.env (ENV)' : 'BELUM DIISI'}
            </span>
          </div>
          {isLead ? (
            <>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder="Tempel API key NVD cadangan… (mis. 0F010576-BEE1-…)"
                  className="w-full flex-1 rounded-md border border-line bg-paper px-3.5 py-2.5 font-mono text-[12px] outline-none transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                  aria-label="API key NVD cadangan"
                />
                <button
                  type="button"
                  onClick={saveKey}
                  className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-ink px-4 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-ink-deep"
                >
                  <KeyRound size={13} /> Simpan Key
                </button>
                <button
                  type="button"
                  onClick={clearKey}
                  className="flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-line px-4 py-2.5 text-[12px] font-bold text-slate-600 transition-colors hover:border-brand hover:text-brand"
                >
                  <Trash2 size={13} /> Hapus Key UI
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Key UI diprioritaskan di atas <code className="rounded bg-paper px-1 font-mono">VITE_NVD_API_KEY</code>{' '}
                (.env). Panduan lengkap: <code className="rounded bg-paper px-1 font-mono">login.md</code>.
                Jangan commit .env ke repository publik.
              </p>
            </>
          ) : (
            <p className="mt-3 flex items-start gap-2 rounded-md border border-dashed border-slate-300 bg-paper px-3 py-2.5 text-[11.5px] leading-relaxed text-slate-500">
              <Lock size={13} className="mt-0.5 shrink-0" />
            Pengaturan API key hanya dapat diubah oleh Lead Incident Handler. Peran Anda tetap dapat menelusuri feed NVD.
            </p>
          )}
          {keyFlash && (
            <p className="animate-fade-up mt-2 text-[11.5px] font-bold text-green-700">{keyFlash}</p>
          )}
        </div>
      )}

      {/* jendela publikasi — NVD tanpa /latest: wajib pubStartDate–pubEndDate (maks 120 hari) */}
      <div className="mb-3 flex flex-col gap-2.5 rounded-xl border border-line bg-white p-3.5 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          <CalendarClock size={13} className="text-brand" /> Jendela Publikasi
        </span>
        <NvdWindowChips
          value={windowDays}
          onChange={(d) => {
            setWindowDays(d)
            setPage(1)
            setExpanded(new Set())
          }}
        />
        <span className="font-mono text-[10px] tracking-wide text-slate-500">
          {rangeText}
          {demoMode ? ' · DEMO TIDAK TERIKAT JENDELA' : ''}
        </span>
      </div>

      {/* toolbar pencarian + filter */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <NvdSeverityChips
          value={severity}
          onChange={(v) => {
            setSeverity(v)
            setPage(1)
            setExpanded(new Set())
          }}
          counts={counts}
        />
        <form onSubmit={submitSearch} className="flex w-full gap-2 lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={queryDraft}
              onChange={(e) => setQueryDraft(e.target.value)}
              placeholder="Cari CVE / kata kunci… mis. CVE-2024-3094 atau Apache"
              className="w-full rounded-md border border-line bg-white py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20"
              aria-label="Cari CVE atau kata kunci NVD"
            />
          </div>
          <button
            type="submit"
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand px-4 py-2.5 text-[12.5px] font-bold text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-deep"
          >
            <Search size={14} /> Cari
          </button>
        </form>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-semibold">Coba cepat:</span>
        {QUICK_SEARCHES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => quickSearch(q)}
            className="rounded-full border border-line bg-white px-3 py-1 font-mono text-[11px] font-semibold text-slate-600 transition-colors hover:border-brand hover:text-brand"
          >
            {q}
          </button>
        ))}
        {query && (
          <button
            type="button"
            onClick={() => quickSearch('')}
            className="rounded-full border border-brand/40 bg-brand-soft px-3 py-1 font-mono text-[11px] font-bold text-brand-deep transition-colors hover:bg-brand hover:text-white"
          >
            × hapus pencarian “{query}”
          </button>
        )}
      </div>

      {demoMode && !loading && (
        <NvdDemoBanner
          onRetryLive={() => {
            setDemoMode(false)
            setReloadKey((k) => k + 1)
          }}
        />
      )}

      <div ref={feedRef} className="scroll-mt-28">
        {loading ? (
          <NvdSkeletonGrid count={6} />
        ) : error ? (
          <NvdErrorPanel
            error={error}
            onRetry={() => setReloadKey((k) => k + 1)}
            onDemo={() => {
              setPage(1)
              setDemoMode(true)
            }}
          />
        ) : result && result.cves.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Database size={32} className="mx-auto mb-3 text-slate-300" />
          <p className="font-display text-lg font-bold text-ink">Tidak ada CVE yang cocok</p>
          <p className="mt-1 text-sm text-slate-500">
            {demoMode
              ? 'Dataset demo offline terbatas — coba kata kunci lain atau kembali ke feed live.'
              : 'Ubah kata kunci / tingkat keparahan, perlebar jendela publikasi (mis. 90 / 120 hari), atau periksa penulisan nomor CVE (format CVE-YYYY-NNNN).'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result?.cves.map((cve) => (
            <NvdCveCard
              key={cve.id}
              cve={cve}
              expanded={expanded.has(cve.id)}
              onToggleExpand={() => toggleExpand(cve.id)}
              action={
                onImport ? (
                  isLead ? (
                    <button
                      type="button"
                      onClick={() => onImport(cve, source)}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-[12px] font-bold text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-deep"
                    >
                      <Download size={14} /> Import ke WHOOSH Advisory
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      title="Hanya Lead Incident Handler yang dapat mengimpor CVE ke advisory WHOOSH"
                      className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-line bg-paper py-2.5 text-[12px] font-bold text-slate-400"
                    >
                      <Lock size={13} /> Impor khusus Lead Handler
                    </button>
                  )
                ) : undefined
              }
            />
          ))}
        </div>
        )}
        {!error && result && totalPages > 1 && (
          <NvdPagination
            page={page}
            totalPages={totalPages}
            total={result.total}
            perPage={perPage}
            loading={loading}
            keyed={keyInfo.source !== 'NONE'}
            onChange={changePage}
          />
        )}
      </div>

      {!loading && !error && result && result.cves.length > 0 && (
        <p className="mt-5 flex items-start gap-1.5 font-mono text-[10px] leading-relaxed tracking-wider text-slate-400">
          <CvssBadge cvss={null} /> Skor &amp; severity mengikuti metrik CVSS v3.1 / v3.0 / v2.0 dari NVD —
          vektor, subskor exploitability/impact, dan rincian metrik tersedia lewat “Baca lengkap”. Feed
          ditarik dengan pubStartDate–pubEndDate (maks {NVD_MAX_WINDOW_DAYS} hari, urut publikasi terbaru);
          lookup CVE-ID menelusuri seluruh riwayat. Tautan referensi membuka situs resmi pihak ketiga.
        </p>
      )}
    </div>
  )
}