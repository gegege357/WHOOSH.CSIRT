import type { AdvisorySeverity } from '../types/csirt'
import type { NvdCve, NvdCvss, NvdFeedResult, NvdSeverityFilter } from '../types/nvd'
import { NVD_DEMO_CVES } from '../data/nvdDemo'

const NVD_ENDPOINT_DEFAULT = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
// base URL dapat diganti lewat VITE_NVD_API_BASE_URL (.env) tanpa mengubah kode
export const NVD_ENDPOINT =
  (import.meta.env.VITE_NVD_API_BASE_URL as string | undefined)?.trim() || NVD_ENDPOINT_DEFAULT
// proxy dev/preview (vite.config.ts) meneruskan header apiKey dari sisi server —
// browser tidak bisa mengirimkannya langsung karena NVD menolak CORS preflight
const NVD_PROXY = '/nvd-proxy/cves/2.0'
const NVD_KEY_STORAGE = 'whoosh-csirt:nvd-api-key:v1'
const CACHE_TTL_MS = 5 * 60 * 1000

export const CVE_ID_RE = /^CVE-\d{4}-\d{4,7}$/i

export type NvdErrorKind = 'RATE_LIMIT' | 'NETWORK' | 'NOT_FOUND' | 'BAD_REQUEST' | 'SERVER'

export class NvdError extends Error {
  kind: NvdErrorKind
  status?: number

  constructor(kind: NvdErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'NvdError'
    this.kind = kind
    this.status = status
  }
}

export interface NvdKeyInfo {
  key: string | null
  source: 'UI' | 'ENV' | 'NONE'
}

export function getNvdApiKey(): NvdKeyInfo {
  try {
    const override = localStorage.getItem(NVD_KEY_STORAGE)?.trim()
    if (override) return { key: override, source: 'UI' }
  } catch {
    // storage tidak tersedia — lanjut ke env
  }
  const env = (import.meta.env.VITE_NVD_API_KEY as string | undefined)?.trim()
  if (env) return { key: env, source: 'ENV' }
  return { key: null, source: 'NONE' }
}

export function setNvdApiKeyOverride(key: string | null): void {
  try {
    const clean = key?.trim()
    if (clean) localStorage.setItem(NVD_KEY_STORAGE, clean)
    else localStorage.removeItem(NVD_KEY_STORAGE)
  } catch {
    // abaikan storage penuh / private mode
  }
}

interface RawMetric {
  source?: string
  type?: string
  exploitabilityScore?: number
  impactScore?: number
  cvssData?: { version?: string; baseScore?: number; baseSeverity?: string; vectorString?: string }
}

interface RawCve {
  id?: string
  published?: string
  lastModified?: string
  descriptions?: Array<{ lang?: string; value?: string }>
  metrics?: {
    cvssMetricV31?: RawMetric[]
    cvssMetricV30?: RawMetric[]
    cvssMetricV2?: RawMetric[]
  }
  references?: Array<{ url?: string; source?: string; tags?: string[] }>
  weaknesses?: Array<{ description?: Array<{ lang?: string; value?: string }> }>
}

interface RawResponse {
  totalResults?: number
  vulnerabilities?: Array<{ cve?: RawCve }>
}

function pickCvss(metrics: RawCve['metrics']): NvdCvss | null {
  const groups: Array<{ list: RawMetric[] | undefined; version: NvdCvss['version'] }> = [
    { list: metrics?.cvssMetricV31, version: '3.1' },
    { list: metrics?.cvssMetricV30, version: '3.0' },
    { list: metrics?.cvssMetricV2, version: '2.0' },
  ]
  for (const g of groups) {
    if (!g.list || g.list.length === 0) continue
    const primary = g.list.find((m) => m.type === 'Primary') ?? g.list[0]
    const d = primary.cvssData
    if (!d || typeof d.baseScore !== 'number') continue
    return {
      version: g.version,
      score: d.baseScore,
      severity: (d.baseSeverity ?? 'NONE').toUpperCase(),
      vector: d.vectorString ?? null,
      exploitability: typeof primary.exploitabilityScore === 'number' ? primary.exploitabilityScore : null,
      impact: typeof primary.impactScore === 'number' ? primary.impactScore : null,
    }
  }
  return null
}

function mapCve(raw: RawCve): NvdCve {
  const en = raw.descriptions?.find((d) => d.lang === 'en')?.value
  const weaknesses = new Set<string>()
  for (const w of raw.weaknesses ?? []) {
    for (const d of w.description ?? []) {
      if (d.lang === 'en' && d.value && d.value !== 'NVD-CWE-noinfo' && d.value !== 'NVD-CWE-Other') {
        weaknesses.add(d.value)
      }
    }
  }
  return {
    id: raw.id ?? 'CVE-UNKNOWN',
    published: raw.published ?? '',
    lastModified: raw.lastModified ?? '',
    description: en ?? raw.descriptions?.[0]?.value ?? 'Deskripsi tidak tersedia dari NVD.',
    cvss: pickCvss(raw.metrics),
    references: (raw.references ?? [])
      .filter((r) => typeof r.url === 'string' && r.url.startsWith('http'))
      .map((r) => ({ url: r.url as string, source: r.source ?? null, tags: r.tags ?? [] })),
    weaknesses: [...weaknesses],
  }
}

const cache = new Map<string, { at: number; cves: NvdCve[]; total: number }>()

// Antrean slot rate-limit NVD: rolling window 30 detik per bucket (key / tanpa key).
// Klik halaman berdekatan tidak pernah menembus batas API — request menunggu slot.
export const NVD_RATE_LIMIT = { keyed: 50, anon: 5, windowSeconds: 30 }
const RATE_WINDOW_MS = NVD_RATE_LIMIT.windowSeconds * 1000
const slotTimes: Record<'keyed' | 'anon', number[]> = { keyed: [], anon: [] }
let slotChain: Promise<void> = Promise.resolve()

function isAbort(e: unknown): boolean {
  return e instanceof DOMException && e.name === 'AbortError'
}

function scheduleSlot(keyed: boolean, signal?: AbortSignal): Promise<void> {
  const bucket = keyed ? 'keyed' : 'anon'
  const limit = keyed ? NVD_RATE_LIMIT.keyed : NVD_RATE_LIMIT.anon
  const acquire = async () => {
    for (;;) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      const now = Date.now()
      const times = slotTimes[bucket]
      while (times.length && now - times[0] >= RATE_WINDOW_MS) times.shift()
      if (times.length < limit) {
        times.push(now)
        return
      }
      await new Promise((r) => setTimeout(r, Math.min(times[0] + RATE_WINDOW_MS - now + 50, 1000)))
    }
  }
  slotChain = slotChain.then(acquire, acquire)
  return slotChain
}

async function request(
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<{ cves: NvdCve[]; total: number }> {
  const { key } = getNvdApiKey()
  const cacheKey = JSON.stringify({ params, keyed: Boolean(key) })
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return { cves: hit.cves, total: hit.total }
  }

  const qs = new URLSearchParams(params).toString()
  let res: Response | null = null
  let usedKey = false

  if (key) {
    try {
      await scheduleSlot(true, signal)
      const proxied = await fetch(`${NVD_PROXY}?${qs}`, { headers: { apiKey: key }, signal })
      if (proxied.ok && (proxied.headers.get('content-type') ?? '').includes('json')) {
        res = proxied
        usedKey = true
      }
      // respons non-JSON (mis. index.html SPA fallback) = proxy tidak tersedia → coba langsung
    } catch (e) {
      if (isAbort(e) || signal?.aborted) throw e
      // proxy tidak ada / jaringan lokal bermasalah → lanjut ke request langsung
    }
  }

  if (!res) {
    try {
      await scheduleSlot(false, signal)
      // tanpa header khusus = simple request, tidak memicu preflight yang ditolak NVD
      res = await fetch(`${NVD_ENDPOINT}?${qs}`, { signal })
    } catch (e) {
      if (isAbort(e) || signal?.aborted) throw e
      throw new NvdError(
        'NETWORK',
        'Tidak dapat menghubungi server NVD NIST — perangkat offline, DNS, atau koneksi diblokir. Periksa jaringan Anda atau gunakan dataset demo offline.',
      )
    }
  }

  if (res.status === 403) {
    throw new NvdError(
      'RATE_LIMIT',
      usedKey
        ? 'Rate limit NVD tercapai (HTTP 403) meski memakai API key — tunggu ±30 detik sebelum mencoba lagi, atau gunakan dataset demo offline.'
        : key
          ? 'Rate limit NVD tercapai (HTTP 403). API key hanya bisa dipakai lewat proxy dev server (NVD menolak pengiriman key langsung dari browser); request tanpa key dibatasi ±5 permintaan/30 detik. Jalankan npm run dev, tunggu ±30 detik, atau gunakan dataset demo offline.'
          : 'Rate limit NVD tercapai (HTTP 403). Tanpa API key batasnya ±5 permintaan/30 detik — pasang VITE_NVD_API_KEY di .env atau lewat Pengaturan API Key, tunggu ±30 detik, atau gunakan dataset demo offline.',
      403,
    )
  }
  if (res.status === 404) {
    throw new NvdError('NOT_FOUND', 'CVE tidak ditemukan di database NVD (HTTP 404). Periksa penulisan nomor CVE.', 404)
  }
  if (res.status === 400) {
    throw new NvdError('BAD_REQUEST', 'Parameter pencarian ditolak NVD (HTTP 400). Gunakan format CVE-YYYY-NNNN atau kata kunci produk.', 400)
  }
  if (!res.ok) {
    throw new NvdError(
      'SERVER',
      `Server NVD sedang sibuk / gangguan (HTTP ${res.status}). Coba lagi beberapa saat atau gunakan dataset demo offline.`,
      res.status,
    )
  }

  let json: RawResponse
  try {
    json = (await res.json()) as RawResponse
  } catch {
    throw new NvdError('SERVER', 'Respons NVD tidak dapat dibaca (bukan JSON valid). Coba lagi beberapa saat.', res.status)
  }

  const cves = (json.vulnerabilities ?? []).map((v) => mapCve(v.cve ?? {}))
  const total = typeof json.totalResults === 'number' ? json.totalResults : cves.length
  cache.set(cacheKey, { at: Date.now(), cves, total })
  return { cves, total }
}

export interface NvdFeedOptions {
  severity?: NvdSeverityFilter | 'ALL'
  keyword?: string
  perPage?: number
  windowDays?: number
  page?: number
}

// NVD tidak punya endpoint /latest — rilis baru ditarik lewat rentang
// pubStartDate–pubEndDate (batas API: 120 hari). Tanpa jendela, hasil
// terurut dari publikasi terlama sehingga feed justru berisi CVE tahun 1999.
export const NVD_MAX_WINDOW_DAYS = 120
export const NVD_FEED_WINDOW_DAYS = 14

export const NVD_WINDOW_PRESETS: Array<{ days: number; label: string }> = [
  { days: 1, label: 'HARI INI' },
  { days: 7, label: 'MINGGU INI' },
  { days: 14, label: '14 HARI' },
  { days: 30, label: '30 HARI' },
  { days: 90, label: '90 HARI' },
  { days: 120, label: '120 HARI' },
]

export function clampNvdWindow(days: number): number {
  if (!Number.isFinite(days)) return NVD_FEED_WINDOW_DAYS
  return Math.min(NVD_MAX_WINDOW_DAYS, Math.max(1, Math.round(days)))
}

// jendela stabil per hari UTC agar cache TTL 5 menit tetap efektif
export function nvdPubWindow(days: number): { pubStartDate: string; pubEndDate: string; days: number } {
  const d = clampNvdWindow(days)
  const now = new Date()
  const day = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return {
    days: d,
    pubStartDate: new Date(day - (d - 1) * 86400000).toISOString(),
    pubEndDate: new Date(day + 86400000 - 1).toISOString(),
  }
}

export async function fetchNvdFeed(opts: NvdFeedOptions = {}, signal?: AbortSignal): Promise<NvdFeedResult> {
  const keyword = opts.keyword?.trim() ?? ''
  const severity = opts.severity && opts.severity !== 'ALL' ? opts.severity : undefined
  const perPage = Math.max(1, opts.perPage ?? 20)
  const page = Math.max(1, Math.round(opts.page ?? 1))
  const params: Record<string, string> = {
    resultsPerPage: String(perPage),
    startIndex: String((page - 1) * perPage),
  }

  let clientSeverityFilter: NvdSeverityFilter | undefined
  let range: NvdFeedResult['range']
  if (keyword && CVE_ID_RE.test(keyword)) {
    // lookup CVE-ID presisi menelusuri seluruh riwayat NVD, tanpa jendela
    params.cveId = keyword.toUpperCase()
    params.startIndex = '0'
    clientSeverityFilter = severity
  } else {
    range = nvdPubWindow(opts.windowDays ?? NVD_FEED_WINDOW_DAYS)
    params.pubStartDate = range.pubStartDate
    params.pubEndDate = range.pubEndDate
    if (keyword) params.keywordSearch = keyword
    if (severity) params.cvssV3Severity = severity
  }

  const { cves, total } = await request(params, signal)
  const newestFirst = [...cves].sort((a, b) => b.published.localeCompare(a.published))
  const filtered = clientSeverityFilter
    ? newestFirst.filter((c) => c.cvss?.severity === clientSeverityFilter)
    : newestFirst
  return {
    cves: filtered,
    total: clientSeverityFilter ? filtered.length : total,
    source: 'LIVE',
    range,
    page: clientSeverityFilter ? 1 : page,
    perPage,
  }
}

export async function fetchNvdCve(cveId: string, signal?: AbortSignal): Promise<NvdCve> {
  const id = cveId.trim().toUpperCase()
  if (!CVE_ID_RE.test(id)) {
    throw new NvdError('BAD_REQUEST', 'Format CVE tidak valid — gunakan CVE-YYYY-NNNN (mis. CVE-2025-21990).')
  }
  const { cves } = await request({ cveId: id, resultsPerPage: '1' }, signal)
  const found = cves.find((c) => c.id.toUpperCase() === id)
  if (!found) {
    throw new NvdError('NOT_FOUND', `${id} tidak ditemukan di database NVD.`)
  }
  return found
}

export function demoFeed(opts: NvdFeedOptions = {}): NvdFeedResult {
  const keyword = (opts.keyword ?? '').trim().toLowerCase()
  const severity = opts.severity && opts.severity !== 'ALL' ? opts.severity : undefined
  const perPage = Math.max(1, opts.perPage ?? 20)
  const page = Math.max(1, Math.round(opts.page ?? 1))
  const all = NVD_DEMO_CVES.filter((c) => {
    const matchSeverity = !severity || c.cvss?.severity === severity
    const matchKeyword =
      keyword === '' ||
      c.id.toLowerCase().includes(keyword) ||
      c.description.toLowerCase().includes(keyword)
    return matchSeverity && matchKeyword
  }).sort((a, b) => b.published.localeCompare(a.published))
  return {
    cves: all.slice((page - 1) * perPage, page * perPage),
    total: all.length,
    source: 'DEMO',
    page,
    perPage,
  }
}

export function demoCve(cveId: string): NvdCve | null {
  const id = cveId.trim().toUpperCase()
  return NVD_DEMO_CVES.find((c) => c.id === id) ?? null
}

export function mapNvdSeverityToAdvisory(severity: string | null | undefined): AdvisorySeverity {
  switch ((severity ?? '').toUpperCase()) {
    case 'CRITICAL':
      return 'CRITICAL'
    case 'HIGH':
      return 'HIGH'
    case 'MEDIUM':
      return 'MEDIUM'
    default:
      return 'INFO'
  }
}