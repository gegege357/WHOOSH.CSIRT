import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Activity,
  AlertOctagon,
  ArrowLeft,
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Crosshair,
  Download,
  Eye,
  FileArchive,
  FileSearch,
  FileSpreadsheet,
  FileText,
  Filter,
  Fingerprint,
  Gauge,
  Globe,
  History,
  Inbox,
  KeyRound,
  Layers,
  Link2,
  ListChecks,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  Paperclip,
  Phone,
  Plus,
  Radar,
  RotateCcw,
  Save,
  ScrollText,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Unlink,
  User,
  X,
  Zap,
} from 'lucide-react'
import type {
  AdminSession,
  AdvisorySeverity,
  AuditAction,
  EvidenceFile,
  IncidentReport,
  IncidentSeverity,
  IncidentStatus,
  IocType,
  SecurityAdvisory,
  ThreatLevel,
  TlpCode,
} from '../types/csirt'
import {
  ADMIN_ROLE_LABEL,
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  IOC_TYPES,
  THREAT_LEVELS,
  TLP_CODES,
} from '../types/csirt'
import {
  ADMIN_ACCOUNTS,
  ANALYST_ROSTER,
  THREAT_LEVEL_DESC,
} from '../data/mockData'
import { useCsirt } from '../context/CsirtContext'
import type { NvdCve } from '../types/nvd'
import {
  CVE_ID_RE,
  NvdError,
  demoCve,
  fetchNvdCve,
  mapNvdSeverityToAdvisory,
} from '../services/nvdService'
import NvdExplorer from './NvdExplorer'
import { CvssBadge, NvdSourceChip } from './nvdShared'
import {
  AdvisoryBadge,
  Modal,
  STATUS_META,
  SeverityBadge,
  StatusBadge,
  THREAT_META,
  TLP_META,
  TlpBadge,
  downloadTextFile,
  formatDate,
  formatDateTime,
} from './ui'

const AUTH_KEY = 'whoosh-csirt:admin-auth'

function loadSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as AdminSession
    if (s && typeof s.name === 'string' && (s.role === 'LEAD' || s.role === 'ANALYST')) return s
  } catch {
    // sesi lama / korup — minta login ulang
  }
  return null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* ================= LOGIN PETUGAS & ROLE ================= */

const ACCOUNT_PERKS: Record<'LEAD' | 'ANALYST', string[]> = {
  LEAD: [
    'Triase & seluruh alur tiket',
    'Ubah Global Threat Level',
    'Publikasi & impor NVD Advisory',
    'Ekspor CSV · SOC Audit Log',
  ],
  ANALYST: [
    'Triase tiket masuk',
    'Tambah IoC & korelasi CVE',
    'Update status investigasi',
  ],
}

function AdminLogin({ onSuccess }: { onSuccess: (s: AdminSession) => void }) {
  const { recordAudit } = useCsirt()
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [filledRole, setFilledRole] = useState<'LEAD' | 'ANALYST' | null>(null)

  const matchedAccount = ADMIN_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
  )

  const fail = (msg: string) => {
    setError(msg)
    setShake(true)
    setTimeout(() => setShake(false), 1600)
  }

  const fillAccount = (role: 'LEAD' | 'ANALYST') => {
    const acc = ADMIN_ACCOUNTS.find((a) => a.role === role)
    if (!acc) return
    setEmail(acc.email)
    setPin(acc.pin)
    setError(null)
    setFilledRole(role)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    if (!EMAIL_RE.test(cleanEmail)) {
      setError('Masukkan email petugas yang valid (mis. handler@kcic.co.id).')
      return
    }
    const account = ADMIN_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail)
    if (!account) {
      fail('Email tidak terdaftar sebagai petugas SOC KCIC — gunakan handler@kcic.co.id atau analyst@kcic.co.id.')
      return
    }
    if (pin !== account.pin) {
      setPin('')
      fail('PIN salah — akses ditolak.')
      return
    }
    const session: AdminSession = {
      name: account.name,
      email: account.email,
      role: account.role,
      loginAt: new Date().toISOString(),
    }
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(session))
    recordAudit(
      'LOGIN',
      `${session.name} (${ADMIN_ROLE_LABEL[account.role]}) masuk melalui ${session.email}`,
      { name: session.name, role: account.role },
    )
    onSuccess(session)
  }

  const quickButtons: Array<{ role: 'LEAD' | 'ANALYST'; label: string; icon: typeof ShieldCheck }> = [
    { role: 'LEAD', label: 'Isi Kredensial Lead Handler', icon: ShieldCheck },
    { role: 'ANALYST', label: 'Isi Kredensial Analyst', icon: Radar },
  ]

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-10">
      <div className="grid-dark pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] top-0 hidden h-full w-[2px] bg-gradient-to-b from-transparent via-brand/60 to-transparent lg:block" />

      <div className={`relative w-full max-w-md ${shake ? 'animate-shake' : 'animate-modal-in'}`}>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-deep shadow-2xl shadow-black/60">
          <div className="h-1.5 w-full bg-gradient-to-r from-brand via-brand-bright to-white/20" />
          <div className="px-7 py-8 sm:px-8">
            <div className="mb-6 text-center">
              <span className="inline-block rounded-lg bg-white px-3 py-1.5">
                <img src="/gemini-svg.svg" alt="WHOOSH CSIRT" className="h-9 w-auto" />
              </span>
              <div className="mt-4 font-display text-2xl font-bold text-white">
                SOC KCIC — Incident Handler Portal
              </div>
              <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.2em] text-slate-400">
                SOC OPERATIONS · RESTRICTED AREA
              </p>
            </div>

            <form onSubmit={submit}>
              <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Email Petugas
              </label>
              <div className="relative mb-2">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); setFilledRole(null) }}
                  placeholder="handler@kcic.co.id"
                  className="w-full rounded-lg border-2 border-white/15 bg-ink py-3 pl-10 pr-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20"
                  aria-label="Email petugas"
                />
              </div>
              {matchedAccount ? (
                <p className="mb-4 flex items-center gap-1.5 text-[11px] font-bold text-green-400">
                  <ShieldCheck size={13} />
                  Terdeteksi: {matchedAccount.name} · {ADMIN_ROLE_LABEL[matchedAccount.role]}
                </p>
              ) : (
                <p className="mb-4 text-[11px] text-slate-500">
                  Peran &amp; hak akses ditentukan otomatis dari akun terdaftar.
                </p>
              )}

              <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                PIN Petugas
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setError(null) }}
                placeholder="••••"
                className={`w-full rounded-lg border-2 bg-ink px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.6em] text-white outline-none transition-all placeholder:text-slate-600 ${
                  error && pin.length === 0
                    ? 'border-brand-bright ring-4 ring-brand/30'
                    : 'border-white/15 focus:border-brand focus:ring-4 focus:ring-brand/20'
                }`}
                aria-label="PIN petugas"
              />

              {error && (
                <p className="mt-2.5 flex items-start gap-1.5 text-xs font-bold leading-snug text-brand-bright">
                  <ShieldAlert size={13} className="mt-px shrink-0" /> {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-deep"
              >
                <KeyRound size={16} />
                Masuk Dashboard
              </button>
            </form>

            <div className="mt-3 grid gap-2">
              {quickButtons.map((b) => (
                <button
                  key={b.role}
                  type="button"
                  onClick={() => fillAccount(b.role)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-[12.5px] font-bold transition-all ${
                    filledRole === b.role
                      ? 'border-green-500/60 bg-green-500/10 text-green-400'
                      : 'border-white/25 bg-white/[0.04] text-slate-300 hover:border-brand hover:text-white'
                  }`}
                >
                  {filledRole === b.role ? <CheckCircle2 size={15} /> : <b.icon size={15} />}
                  {filledRole === b.role ? `${b.label} — terisi, klik Masuk Dashboard` : b.label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2.5 rounded-lg border border-dashed border-white/20 bg-white/[0.04] px-4 py-3.5">
              {ADMIN_ACCOUNTS.map((a) => (
                <div key={a.email}>
                  <div className="flex flex-wrap items-center gap-x-2 font-mono text-[10.5px] tracking-wider">
                    <span className={`rounded px-1.5 py-px text-[8.5px] font-bold ${a.role === 'LEAD' ? 'bg-brand text-white' : 'bg-white/15 text-slate-200'}`}>
                      {a.role === 'LEAD' ? 'AKSES PENUH' : 'OPERASIONAL'}
                    </span>
                    <strong className="text-brand-bright">{a.email}</strong>
                    <span className="text-slate-400">PIN: <strong className="text-brand-bright">{a.pin}</strong></span>
                  </div>
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
                    {ADMIN_ROLE_LABEL[a.role]} — {ACCOUNT_PERKS[a.role].join(' · ')}
                  </p>
                </div>
              ))}
              <p className="border-t border-white/10 pt-2 text-center font-mono text-[9px] tracking-[0.2em] text-slate-500">
                MODE DEMO · DOKUMENTASI LENGKAP: login.md
              </p>
            </div>
          </div>
        </div>
        <p className="mt-5 text-center font-mono text-[10px] tracking-[0.2em] text-slate-500">
          WHOOSH CSIRT · AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </div>
  )
}

/* ================= PANEL TERKUNCI (RBAC) ================= */

function LeadOnlyNotice({ what }: { what: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-slate-400">
        <Lock size={22} />
      </span>
      <p className="font-display text-lg font-bold text-ink">{what} khusus Lead Incident Handler</p>
      <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-relaxed text-slate-500">
        Peran SOC Analyst Tier-1 berfokus pada triase tiket, IoC, korelasi CVE, dan update status investigasi.
        Masuk sebagai <code className="rounded bg-paper px-1 font-mono text-[11px]">handler@kcic.co.id</code> untuk akses penuh.
      </p>
    </div>
  )
}

/* ================= GLOBAL THREAT LEVEL CONTROLLER ================= */

function ThreatController({ session }: { session: AdminSession }) {
  const { threatLevel, setThreatLevel } = useCsirt()
  const [flash, setFlash] = useState<string | null>(null)
  const isLead = session.role === 'LEAD'

  const apply = (level: ThreatLevel) => {
    if (!isLead || level === threatLevel) return
    setThreatLevel(level, { name: session.name, role: session.role })
    setFlash(`Level ${level} diterapkan — status ancaman internal SOC diperbarui.`)
    setTimeout(() => setFlash(null), 3200)
  }

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-white/10 bg-ink text-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-3.5">
        <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
          <Activity size={14} className="text-brand-bright" />
          Global Threat Level Controller
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-slate-400">
          {isLead ? (
            <>
              <Zap size={11} className="text-brand-bright" /> INTERNAL SOC · TIDAK DIPUBLIKASIKAN
            </>
          ) : (
            <>
              <Lock size={11} className="text-amber-400" /> READ-ONLY · KHUSUS LEAD HANDLER
            </>
          )}
        </span>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {THREAT_LEVELS.map((level) => {
            const m = THREAT_META[level]
            const active = threatLevel === level
            return (
              <button
                key={level}
                onClick={() => apply(level)}
                disabled={!isLead}
                aria-pressed={active}
                title={isLead ? `Terapkan level ${level} (internal SOC)` : 'Hanya Lead Incident Handler yang dapat mengubah threat level'}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 font-mono text-[12px] font-bold tracking-wider transition-all ${
                  active
                    ? m.solid
                    : 'border-white/15 bg-white/[0.04] text-slate-300'
                } ${isLead ? (active ? '' : 'hover:border-white/40 hover:text-white') : 'cursor-not-allowed opacity-80'}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-white' : m.dot}`} />
                {level}
                <span className={`hidden text-[9px] font-semibold tracking-wider md:inline ${active ? 'text-white/80' : 'text-slate-500'}`}>
                  {m.id}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          <strong className="font-bold text-white">{threatLevel}:</strong> {THREAT_LEVEL_DESC[threatLevel]}
        </p>
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-slate-500">
          <Lock size={11} className="text-brand-bright" />
          TINGKAT ANCAMAN BERSIFAT INTERNAL — TIDAK DITAMPILKAN DI PORTAL PUBLIK.
        </p>
        {!isLead && (
          <p className="mt-2 flex items-start gap-1.5 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[11.5px] leading-relaxed text-amber-200">
            <Lock size={13} className="mt-0.5 shrink-0" />
            Perubahan level ancaman global adalah wewenang Lead Incident Handler. Sebagai SOC Analyst Anda tetap
            memantau level aktif ini secara real-time.
          </p>
        )}
        {flash && (
          <p className="animate-fade-up mt-2 flex items-center gap-1.5 text-[12px] font-bold text-green-400">
            <CheckCircle2 size={13} /> {flash}
          </p>
        )}
      </div>
    </div>
  )
}

/* ================= PANEL KERJA ANALIS (TRIAS / IoC / STATUS / CATATAN) ================= */

const IOC_VALIDATORS: Record<IocType, { re: RegExp; hint: string; placeholder: string }> = {
  IP: { re: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, hint: 'IPv4 valid, mis. 203.0.113.7', placeholder: '203.0.113.7' },
  DOMAIN: {
    re: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i,
    hint: 'Domain valid, mis. jahat.example.com',
    placeholder: 'jahat.example.com',
  },
  URL: { re: /^https?:\/\/\S+\.\S{2,}$/i, hint: 'URL http(s) lengkap', placeholder: 'https://jahat.example.com/payload' },
  HASH: {
    re: /^[a-f0-9]{32}$|^[a-f0-9]{40}$|^[a-f0-9]{64}$/i,
    hint: 'Hash heksadesimal MD5 (32), SHA-1 (40), atau SHA-256 (64)',
    placeholder: 'SHA-256 / SHA-1 / MD5',
  },
  EMAIL: { re: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, hint: 'Alamat email valid', placeholder: 'penyerang@example.com' },
}

const SEVERITY_ACTIVE: Record<IncidentSeverity, string> = {
  CRITICAL: 'border-brand bg-brand text-white',
  HIGH: 'border-ink bg-ink text-white',
  MEDIUM: 'border-slate-600 bg-slate-600 text-white',
  LOW: 'border-slate-400 bg-slate-200 text-ink',
}

function AttachmentCard({ att }: { att: EvidenceFile }) {
  const isImage = att.mime.startsWith('image/')
  const isPdf = att.mime === 'application/pdf' || att.name.toLowerCase().endsWith('.pdf')
  const missing = att.evicted || !att.dataUrl
  const dataUrl = att.dataUrl ?? ''
  const withBlob = (cb: (url: string) => void) => {
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((b) => cb(URL.createObjectURL(b)))
  }
  const view = () => {
    if (!missing) withBlob((url) => window.open(url, '_blank'))
  }
  const download = () => {
    if (missing) return
    withBlob((url) => {
      const a = document.createElement('a')
      a.href = url
      a.download = att.name
      a.click()
    })
  }
  const btnBase =
    'flex items-center gap-1 rounded border border-line px-2 py-1 font-mono text-[10px] font-bold transition-colors'
  const btnOn = 'text-slate-600 hover:border-brand hover:text-brand'
  const btnOff = 'cursor-not-allowed text-slate-300 opacity-60'
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      {missing ? (
        <div className="flex h-28 flex-col items-center justify-center gap-1 bg-slate-100 px-2 text-center">
          <FileArchive size={26} className="text-slate-300" />
          <span className="font-mono text-[9px] leading-tight text-slate-400">
            berkas tidak tersedia di penyimpanan lokal (kuota penuh)
          </span>
        </div>
      ) : isImage ? (
        <button type="button" onClick={view} className="block w-full" title="Lihat ukuran penuh">
          <img src={dataUrl} alt={`Pratinjau ${att.name}`} className="h-28 w-full object-cover" />
        </button>
      ) : (
        <div className="flex h-28 items-center justify-center bg-paper">
          {isPdf ? <FileText size={30} className="text-brand" /> : <FileArchive size={30} className="text-slate-400" />}
        </div>
      )}
      <div className="border-t border-line px-3 py-2">
        <p className="truncate font-mono text-[11px] font-bold text-ink" title={att.name}>
          {att.name}
        </p>
        <p className="truncate font-mono text-[10px] text-slate-400">
          {(att.size / 1024).toFixed(1)} KB · {att.mime}
        </p>
        <div className="mt-1.5 flex gap-1.5">
          {(isImage || isPdf) && (
            <button
              type="button"
              onClick={view}
              disabled={missing}
              className={`${btnBase} ${missing ? btnOff : btnOn}`}
            >
              <Eye size={11} /> LIHAT
            </button>
          )}
          <button
            type="button"
            onClick={download}
            disabled={missing}
            className={`${btnBase} ${missing ? btnOff : btnOn}`}
          >
            <Download size={11} /> UNDUH
          </button>
        </div>
      </div>
    </div>
  )
}

function IncidentWorkModal({
  incident,
  session,
  onClose,
}: {
  incident: IncidentReport | null
  session: AdminSession
  onClose: () => void
}) {
  const { updateIncident } = useCsirt()
  const actor = { name: session.name, role: session.role }
  const isLead = session.role === 'LEAD'

  const [sev, setSev] = useState<IncidentSeverity>('MEDIUM')
  const [tlp, setTlp] = useState<TlpCode>('TLP:AMBER')
  const [assignee, setAssignee] = useState('')
  const [publicNote, setPublicNote] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [iocType, setIocType] = useState<IocType>('IP')
  const [iocValue, setIocValue] = useState('')
  const [iocNote, setIocNote] = useState('')
  const [cveDraft, setCveDraft] = useState('')
  const [cveLoading, setCveLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  // sinkronkan draft triase saat tiket berbeda dibuka
  const [loadedId, setLoadedId] = useState<string | null>(null)
  if (incident && incident.ticketId !== loadedId) {
    setLoadedId(incident.ticketId)
    setSev(incident.severity)
    setTlp(incident.tlp)
    setAssignee(incident.assignedTo ?? '')
    setPublicNote('')
    setInternalNote('')
    setIocType('IP')
    setIocValue('')
    setIocNote('')
    setCveDraft('')
    setCveLoading(false)
    setErr(null)
    setFlash(null)
  }

  const ok = (msg: string) => {
    setErr(null)
    setFlash(msg)
    setTimeout(() => setFlash(null), 3200)
  }

  const saveTriage = () => {
    if (!incident) return
    const nextAssignee = assignee || null
    if (sev === incident.severity && tlp === incident.tlp && nextAssignee === incident.assignedTo) {
      setErr('Tidak ada perubahan triase untuk disimpan.')
      return
    }
    updateIncident(incident.ticketId, { severity: sev, tlp, assignedTo: nextAssignee }, actor)
    ok('Triase tersimpan — perubahan tercatat di SOC Audit Log.')
  }

  const changeStatus = (s: IncidentStatus) => {
    if (!incident || s === incident.status) return
    updateIncident(incident.ticketId, { status: s }, actor)
    ok(`Status ${s} diterapkan — pelapor melihat pembaruan ini di Lacak Tiket.`)
  }

  const addIoc = () => {
    if (!incident) return
    const value = iocValue.trim()
    const v = IOC_VALIDATORS[iocType]
    if (!value) {
      setErr(`Nilai IoC ${iocType} wajib diisi.`)
      return
    }
    let valid = v.re.test(value)
    if (valid && iocType === 'IP') {
      valid = value.split('.').every((o) => Number(o) <= 255)
    }
    if (!valid) {
      setErr(`IoC ${iocType} tidak valid — ${v.hint}.`)
      return
    }
    if (incident.iocs.some((i) => i.type === iocType && i.value.toLowerCase() === value.toLowerCase())) {
      setErr('IoC identik sudah tercatat pada tiket ini.')
      return
    }
    updateIncident(incident.ticketId, { ioc: { type: iocType, value, note: iocNote } }, actor)
    setIocValue('')
    setIocNote('')
    ok(`IoC ${iocType} tersimpan & tercatat di audit log.`)
  }

  const sendPublic = () => {
    if (!incident || !isLead) return
    if (publicNote.trim().length < 10) {
      setErr('Catatan publik minimal 10 karakter — catatan ini dilihat pelapor.')
      return
    }
    updateIncident(incident.ticketId, { publicNote }, actor)
    setPublicNote('')
    ok('Catatan publik terkirim — langsung tampil di Lacak Tiket pelapor.')
  }

  const saveInternal = () => {
    if (!incident || !isLead) return
    if (internalNote.trim().length < 5) {
      setErr('Catatan internal minimal 5 karakter.')
      return
    }
    updateIncident(incident.ticketId, { internalNote }, actor)
    setInternalNote('')
    ok('Catatan internal SOC tersimpan (tidak terlihat publik).')
  }

  const attachCve = (cve: NvdCve, source: 'LIVE' | 'DEMO') => {
    if (!incident) return
    updateIncident(
      incident.ticketId,
      {
        cveRef: {
          cveId: cve.id,
          score: cve.cvss?.score ?? null,
          severity: cve.cvss?.severity ?? null,
          cvssVersion: cve.cvss?.version ?? null,
          summary: cve.description,
          vector: cve.cvss?.vector ?? null,
          source,
        },
      },
      actor,
    )
    setCveDraft('')
    ok(`${cve.id} terlampir ke tiket (${source === 'LIVE' ? 'data live NVD' : 'dataset demo offline'}) — tercatat di audit log.`)
  }

  const fetchAndAttachCve = async () => {
    if (!incident || cveLoading) return
    const id = cveDraft.trim().toUpperCase()
    if (!CVE_ID_RE.test(id)) {
      setErr('Format CVE tidak valid — gunakan CVE-YYYY-NNNN (mis. CVE-2025-21990).')
      return
    }
    if (incident.cveRefs.some((r) => r.cveId === id)) {
      setErr(`${id} sudah terlampir pada tiket ini.`)
      return
    }
    setCveLoading(true)
    setErr(null)
    try {
      const cve = await fetchNvdCve(id)
      attachCve(cve, 'LIVE')
    } catch (e) {
      const fallback =
        e instanceof NvdError && (e.kind === 'RATE_LIMIT' || e.kind === 'NETWORK' || e.kind === 'SERVER')
          ? demoCve(id)
          : null
      if (fallback) {
        attachCve(fallback, 'DEMO')
      } else {
        setErr(e instanceof NvdError ? e.message : 'Gagal menghubungi NVD — coba lagi beberapa saat.')
      }
    } finally {
      setCveLoading(false)
    }
  }

  const removeCve = (cveId: string) => {
    if (!incident) return
    updateIncident(incident.ticketId, { removeCveRef: cveId }, actor)
    ok(`Referensi ${cveId} dilepas dari tiket — tercatat di audit log.`)
  }

  const inputCls =
    'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20'

  return (
    <Modal open={incident !== null} onClose={onClose} maxWidth="max-w-6xl">
      {incident && (
        <div>
          <div className="border-b-4 border-brand bg-ink px-6 py-5 text-white sm:px-8">
            <div className="flex flex-wrap items-center gap-2.5 pr-8">
              <span className="font-mono text-lg font-bold tracking-wider text-brand-bright">
                {incident.ticketId}
              </span>
              <StatusBadge status={incident.status} />
              <SeverityBadge severity={incident.severity} pulse />
              <TlpBadge tlp={incident.tlp} />
            </div>
            <h3 className="mt-2 font-display text-xl font-bold leading-snug">{incident.title}</h3>
            <p className="mt-1 font-mono text-[11px] text-slate-400">
              MASUK: {formatDateTime(incident.createdAt)} · UPDATE: {formatDateTime(incident.updatedAt)}
              {incident.assignedTo && <span className="text-slate-300"> · PIC: {incident.assignedTo}</span>}
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-2">
            {/* kiri: laporan & timeline publik */}
            <div className="border-b border-line px-6 py-6 sm:px-8 lg:border-b-0 lg:border-r">
              <h4 className="mb-4 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                <FileSearch size={13} /> Laporan Pelapor
              </h4>
              <dl className="space-y-3 text-[13px]">
                {[
                  { icon: User, k: 'Pelapor', v: incident.reporterName },
                  { icon: Inbox, k: 'Instansi', v: incident.organization },
                  { icon: Mail, k: 'Email', v: incident.email },
                  { icon: Phone, k: 'Telepon', v: incident.phone },
                  { icon: MapPin, k: 'Sistem Terdampak', v: incident.targetSystem },
                  { icon: ClipboardList, k: 'Kategori', v: incident.category },
                ].map((row) => (
                  <div key={row.k} className="flex gap-2.5">
                    <row.icon size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">{row.k}</dt>
                      <dd className="break-words font-medium text-ink">{row.v}</dd>
                    </div>
                  </div>
                ))}
                {incident.evidenceFileName && (
                  <div className="flex gap-2.5">
                    <Paperclip size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <div>
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">File Bukti</dt>
                      <dd className="break-all font-mono text-[12px] font-medium text-ink">{incident.evidenceFileName}</dd>
                    </div>
                  </div>
                )}
              </dl>
              {incident.attachments && incident.attachments.length > 0 && (
                <div className="mt-4">
                  <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lampiran Bukti ({incident.attachments.length}) — pratinjau & unduhan langsung
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {incident.attachments.map((att) => (
                      <AttachmentCard key={att.id} att={att} />
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 rounded-lg bg-paper p-4">
                <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Kronologi Lengkap · {formatDateTime(incident.incidentDate)}
                </div>
                <p className="text-[12.5px] leading-relaxed text-slate-700">{incident.description}</p>
              </div>

              <h4 className="mb-3 mt-6 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                <History size={13} /> Timeline Publik ({incident.timeline.length})
              </h4>
              <ol className="relative max-h-64 space-y-4 overflow-y-auto border-l-2 border-line pl-5 pr-1">
                {[...incident.timeline].reverse().map((t, i) => (
                  <li key={`${t.timestamp}-${i}`} className="relative">
                    <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${i === 0 ? 'bg-brand' : 'bg-slate-300'}`} />
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={t.status} />
                      <span className="font-mono text-[10px] text-slate-400">{formatDateTime(t.timestamp)}</span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{t.note}</p>
                    <p className="font-mono text-[10.5px] font-bold text-ink">— {t.officer}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* kanan: panel kerja analis */}
            <div className="space-y-6 bg-paper px-6 py-6 sm:px-8">
              {err && (
                <p className="animate-fade-up flex items-start gap-1.5 rounded-md border border-brand/30 bg-brand-soft px-3 py-2.5 text-[12px] font-bold text-brand-deep">
                  <AlertOctagon size={14} className="mt-px shrink-0" /> {err}
                </p>
              )}
              {flash && (
                <p className="animate-fade-up flex items-start gap-1.5 rounded-md border border-green-300 bg-green-50 px-3 py-2.5 text-[12px] font-bold text-green-700">
                  <CheckCircle2 size={14} className="mt-px shrink-0" /> {flash}
                </p>
              )}

              {/* triase & penugasan */}
              <section>
                <h4 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <Crosshair size={13} /> Triase &amp; Penugasan
                </h4>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Tingkat Keparahan (Severity)
                </label>
                <div className="mb-3 grid grid-cols-4 gap-1.5">
                  {INCIDENT_SEVERITIES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSev(s)}
                      className={`rounded-md border-2 px-1 py-2 font-mono text-[10px] font-bold tracking-wide transition-all ${
                        sev === s ? SEVERITY_ACTIVE[s] : 'border-line bg-white text-slate-500 hover:border-slate-400'
                      }`}
                      aria-pressed={sev === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Klasifikasi Kerahasiaan (TLP)
                </label>
                <div className="mb-3 grid grid-cols-3 gap-1.5">
                  {TLP_CODES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTlp(t)}
                      title={TLP_META[t].desc}
                      className={`rounded-md border-2 px-1 py-2 font-mono text-[10px] font-bold tracking-wide transition-all ${
                        tlp === t ? `${TLP_META[t].chip} border-transparent` : 'border-line bg-white text-slate-500 hover:border-slate-400'
                      }`}
                      aria-pressed={tlp === t}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Analis Penanggung Jawab
                </label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className={`${inputCls} mb-3`}
                  aria-label="Analis penanggung jawab"
                >
                  <option value="">— Belum ditugaskan —</option>
                  {ANALYST_ROSTER.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <button
                  onClick={saveTriage}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-ink py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-ink-deep"
                >
                  <Save size={14} /> Simpan Triase
                </button>
              </section>

              {/* status lifecycle */}
              <section className="border-t border-line pt-5">
                <h4 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <ListChecks size={13} /> Alur Status Penanganan
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {INCIDENT_STATUSES.map((s) => {
                    const current = incident.status === s
                    return (
                      <button
                        key={s}
                        onClick={() => changeStatus(s)}
                        className={`flex items-center gap-1.5 rounded-md border-2 px-2.5 py-2 font-mono text-[10px] font-bold tracking-wide transition-all ${
                          current
                            ? 'border-brand bg-white text-ink shadow-md shadow-brand/10'
                            : 'border-line bg-white/70 text-slate-500 hover:border-brand/50 hover:text-ink'
                        }`}
                        aria-pressed={current}
                      >
                        <span className={`h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />
                        {s}
                        {current && <span className="rounded bg-brand px-1 py-px text-[8px] text-white">KINI</span>}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  Klik tahap untuk memindahkan status — otomatis tercatat di timeline publik pelapor dan audit log.
                </p>
              </section>

              {/* IoC */}
              <section className="border-t border-line pt-5">
                <h4 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <Fingerprint size={13} /> Indicators of Compromise ({incident.iocs.length})
                </h4>
                {incident.iocs.length > 0 ? (
                  <ul className="mb-3 max-h-44 space-y-2 overflow-y-auto pr-1">
                    {[...incident.iocs].reverse().map((ioc) => (
                      <li key={ioc.id} className="rounded-md border border-line bg-white px-3 py-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-ink px-1.5 py-px font-mono text-[9px] font-bold tracking-wider text-white">
                            {ioc.type}
                          </span>
                          <span className="break-all font-mono text-[11.5px] font-semibold text-ink">{ioc.value}</span>
                        </div>
                        {ioc.note && <p className="mt-1 text-[11px] leading-snug text-slate-500">{ioc.note}</p>}
                        <p className="mt-0.5 font-mono text-[9.5px] text-slate-400">
                          {ioc.addedBy} · {formatDateTime(ioc.addedAt)}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-3 rounded-md border border-dashed border-slate-300 bg-white/60 px-3 py-2.5 text-[11.5px] text-slate-500">
                    Belum ada IoC tercatat. Tambahkan IP penyerang, domain berbahaya, atau hash malware di bawah.
                  </p>
                )}
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <select
                    value={iocType}
                    onChange={(e) => { setIocType(e.target.value as IocType); setErr(null) }}
                    className={inputCls}
                    aria-label="Jenis IoC"
                  >
                    {IOC_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={iocValue}
                    onChange={(e) => { setIocValue(e.target.value); setErr(null) }}
                    placeholder={IOC_VALIDATORS[iocType].placeholder}
                    className={`${inputCls} font-mono text-[12.5px]`}
                    aria-label="Nilai IoC"
                  />
                </div>
                <input
                  type="text"
                  value={iocNote}
                  onChange={(e) => setIocNote(e.target.value)}
                  placeholder="Konteks IoC (opsional) — mis. sumber temuan / kaitan kampanye"
                  className={`${inputCls} mt-2`}
                  aria-label="Catatan IoC"
                />
                <button
                  onClick={addIoc}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border-2 border-ink bg-white py-2.5 text-[12.5px] font-bold text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <Plus size={14} /> Tambah IoC
                </button>
              </section>

              {/* korelasi CVE (NVD) */}
              <section className="border-t border-line pt-5">
                <h4 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <Link2 size={13} /> Referensi CVE Terkait ({incident.cveRefs.length})
                </h4>
                {incident.cveRefs.length > 0 ? (
                  <ul className="mb-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                    {[...incident.cveRefs].reverse().map((r) => (
                      <li key={r.cveId} className="rounded-md border border-line bg-white px-3 py-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`https://nvd.nist.gov/vuln/detail/${r.cveId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[12px] font-bold text-brand underline-offset-2 hover:underline"
                          >
                            {r.cveId}
                          </a>
                          <CvssBadge
                            cvss={
                              r.score === null
                                ? null
                                : {
                                    version: r.cvssVersion === '3.0' || r.cvssVersion === '2.0' ? r.cvssVersion : '3.1',
                                    score: r.score,
                                    severity: r.severity ?? 'NONE',
                                    vector: r.vector,
                                  }
                            }
                          />
                          <NvdSourceChip source={r.source} />
                          <button
                            onClick={() => removeCve(r.cveId)}
                            title={`Lepas referensi ${r.cveId} dari tiket`}
                            className="ml-auto flex items-center gap-1 rounded border border-line px-2 py-1 font-mono text-[9.5px] font-bold text-slate-500 transition-colors hover:border-brand hover:text-brand"
                          >
                            <Unlink size={11} /> LEPAS
                          </button>
                        </div>
                        <p className="mt-1.5 line-clamp-3 text-[11.5px] leading-relaxed text-slate-600">{r.summary}</p>
                        <p className="mt-1 font-mono text-[9.5px] text-slate-400">
                          dilampirkan {r.linkedBy} · {formatDateTime(r.linkedAt)}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-3 rounded-md border border-dashed border-slate-300 bg-white/60 px-3 py-2.5 text-[11.5px] leading-relaxed text-slate-500">
                    Belum ada CVE terlampir. Masukkan nomor CVE (mis. CVE-2025-21990) untuk mengambil ringkasan &amp;
                    skor CVSS langsung dari NVD NIST dan mengaitkannya dengan insiden ini.
                  </p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cveDraft}
                    onChange={(e) => { setCveDraft(e.target.value); setErr(null) }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void fetchAndAttachCve() } }}
                    placeholder="CVE-2025-XXXXX"
                    className={`${inputCls} flex-1 font-mono text-[12.5px] uppercase`}
                    aria-label="Nomor CVE terkait"
                    disabled={cveLoading}
                  />
                  <button
                    onClick={() => void fetchAndAttachCve()}
                    disabled={cveLoading}
                    className="flex shrink-0 items-center gap-1.5 rounded-md border-2 border-ink bg-white px-3.5 py-2.5 text-[12px] font-bold text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-wait disabled:opacity-60"
                  >
                    {cveLoading ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                    {cveLoading ? 'Mengambil…' : 'Ambil dari NVD'}
                  </button>
                </div>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-400">
                  Bila NVD rate-limit / offline, sistem otomatis memakai dataset demo offline bila CVE tersedia —
                  sumber (LIVE / DEMO) selalu ditandai pada referensi.
                </p>
              </section>

              {/* catatan publik & internal — wewenang Lead */}
              {isLead ? (
                <>
                  {/* catatan publik */}
                  <section className="border-t border-line pt-5">
                    <h4 className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                      <Send size={13} /> Catatan Publik untuk Pelapor
                    </h4>
                    <textarea
                      rows={3}
                      value={publicNote}
                      onChange={(e) => { setPublicNote(e.target.value); setErr(null) }}
                      placeholder="Tindakan, temuan, dan instruksi untuk pelapor. Catatan ini tampil di fitur Lacak Tiket portal publik…"
                      className={`${inputCls} resize-y leading-relaxed`}
                    />
                    <button
                      onClick={sendPublic}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-[12.5px] font-bold text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-deep"
                    >
                      <Send size={14} /> Kirim ke Pelapor
                    </button>
                  </section>

                  {/* catatan internal */}
                  <section className="border-t border-line pt-5">
                    <h4 className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
                      <Lock size={13} /> Catatan Internal SOC
                      <span className="rounded bg-ink px-1.5 py-px text-[8.5px] font-bold tracking-wider text-white">
                        TIDAK TERLIHAT PUBLIK
                      </span>
                    </h4>
                    {incident.internalNotes.length > 0 && (
                      <ul className="mb-3 max-h-40 space-y-2 overflow-y-auto pr-1">
                        {[...incident.internalNotes].reverse().map((n) => (
                          <li key={n.id} className="rounded-md border border-slate-300 bg-white px-3 py-2">
                            <p className="text-[12px] leading-relaxed text-slate-700">{n.text}</p>
                            <p className="mt-1 font-mono text-[9.5px] font-bold text-slate-400">
                              {n.author} · {ADMIN_ROLE_LABEL[n.role]} · {formatDateTime(n.createdAt)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <textarea
                      rows={3}
                      value={internalNote}
                      onChange={(e) => { setInternalNote(e.target.value); setErr(null) }}
                      placeholder="Koordinasi internal, hipotesis, atau instruksi sensitif antar analis — hanya terlihat di dashboard admin…"
                      className={`${inputCls} resize-y leading-relaxed`}
                    />
                    <button
                      onClick={saveInternal}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-ink py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-ink-deep"
                    >
                      <Lock size={14} /> Simpan Catatan Internal
                    </button>
                  </section>
                </>
              ) : (
                <section className="border-t border-line pt-5">
                  <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white/70 px-4 py-4">
                    <h4 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      <Lock size={13} /> Catatan Publik &amp; Internal — Terkunci
                    </h4>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500">
                      Komunikasi ke pelapor dan catatan internal SOC dikelola oleh Lead Incident Handler.
                      Peran Analyst dapat melakukan triase, menambah IoC, mengkorelasikan CVE, dan memperbarui
                      status investigasi.
                    </p>
                    {incident.internalNotes.length > 0 && (
                      <p className="mt-2 font-mono text-[10px] font-bold text-slate-400">
                        {incident.internalNotes.length} CATATAN INTERNAL ADA PADA TIKET INI (HANYA LEAD YANG DAPAT MEMBACA)
                      </p>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

/* ================= PUBLIKASI ADVISORY ================= */

const ADVISORY_SEVERITIES: AdvisorySeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO']

function splitLines(raw: string): string[] {
  return raw.split('\n').map((l) => l.trim()).filter(Boolean)
}

export interface AdvisoryPrefill {
  key: number
  cveId: string
  cvssScore: string
  severity: AdvisorySeverity
  title: string
  summary: string
  technicalDetails: string
}

function AdvisoryPublisher({
  session,
  prefill,
  onPrefillConsumed,
}: {
  session: AdminSession
  prefill: AdvisoryPrefill | null
  onPrefillConsumed: () => void
}) {
  const { advisories, publishAdvisory } = useCsirt()
  const [title, setTitle] = useState('')
  const [cveId, setCveId] = useState('')
  const [cvss, setCvss] = useState('')
  const [severity, setSeverity] = useState<AdvisorySeverity>('HIGH')
  const [systems, setSystems] = useState('')
  const [summary, setSummary] = useState('')
  const [technical, setTechnical] = useState('')
  const [mitigation, setMitigation] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [published, setPublished] = useState<SecurityAdvisory | null>(null)
  const [nvdOrigin, setNvdOrigin] = useState<string | null>(null)

  useEffect(() => {
    if (!prefill) return
    setTitle(prefill.title)
    setCveId(prefill.cveId)
    setCvss(prefill.cvssScore)
    setSeverity(prefill.severity)
    setSummary(prefill.summary)
    setTechnical(prefill.technicalDetails)
    setSystems('')
    setMitigation('')
    setErr(null)
    setPublished(null)
    setNvdOrigin(prefill.cveId)
    onPrefillConsumed()
  }, [prefill, onPrefillConsumed])

  const inputCls =
    'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20'

  const publish = (e: FormEvent) => {
    e.preventDefault()
    const cve = cveId.trim().toUpperCase()
    const score = Number(cvss)
    const systemList = splitLines(systems)
    const mitigationList = splitLines(mitigation)
    if (title.trim().length < 10) return setErr('Judul advisory minimal 10 karakter.')
    if (!/^CVE-\d{4}-\d{4,7}$/.test(cve)) return setErr('CVE ID harus berformat CVE-2026-XXXXX (4–7 digit nomor).')
    if (cvss.trim() === '' || Number.isNaN(score) || score < 0 || score > 10) {
      return setErr('Skor CVSS harus berupa angka 0.0 – 10.0.')
    }
    if (systemList.length === 0) return setErr('Isi minimal satu sistem terdampak (satu per baris).')
    if (summary.trim().length < 30) return setErr('Ringkasan minimal 30 karakter agar informatif bagi konstituen.')
    if (mitigationList.length === 0) return setErr('Isi minimal satu langkah mitigasi (satu per baris).')

    const advisory = publishAdvisory(
      {
        title: title.trim(),
        cveId: cve,
        cvssScore: score.toFixed(1),
        severity,
        affectedSystems: systemList,
        summary: summary.trim(),
        technicalDetails: technical.trim() || summary.trim(),
        mitigationSteps: mitigationList,
      },
      { name: session.name, role: session.role },
    )
    setPublished(advisory)
    setErr(null)
    setNvdOrigin(null)
    setTitle(''); setCveId(''); setCvss(''); setSeverity('HIGH')
    setSystems(''); setSummary(''); setTechnical(''); setMitigation('')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* formulir */}
      <form onSubmit={publish} className="rounded-xl border border-line bg-white p-6 shadow-sm lg:col-span-3">
        <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Megaphone size={18} className="text-brand" /> Publikasi Peringatan Keamanan
        </h3>
        <p className="mb-5 text-[12.5px] leading-relaxed text-slate-500">
          Advisory yang diterbitkan langsung muncul di daftar Peringatan Keamanan dan ticker portal publik.
        </p>

        {nvdOrigin && (
          <div className="animate-fade-up mb-4 rounded-md border border-sky-300 bg-sky-50 px-4 py-3">
            <p className="flex items-center gap-1.5 text-[12.5px] font-bold text-sky-800">
              <Globe size={14} /> Terisi otomatis dari NVD — {nvdOrigin}
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-sky-800/80">
              CVE ID, skor CVSS, severity, dan deskripsi diambil dari database NVD. Lengkapi{' '}
              <strong>Sistem Terdampak</strong> dan <strong>Langkah Mitigasi</strong> sesuai konteks konstituen
              WHOOSH, lalu terbitkan ke portal publik.
            </p>
          </div>
        )}

        {err && (
          <p className="animate-fade-up mb-4 flex items-start gap-1.5 rounded-md border border-brand/30 bg-brand-soft px-3 py-2.5 text-[12px] font-bold text-brand-deep">
            <AlertOctagon size={14} className="mt-px shrink-0" /> {err}
          </p>
        )}
        {published && (
          <div className="animate-fade-up mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-green-700">
              <CheckCircle2 size={15} /> {published.id} berhasil diterbitkan!
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-green-700/80">
              “{published.title}” kini tayang di portal publik. Buka halaman utama untuk melihatnya di bagian
              Peringatan Keamanan.
            </p>
          </div>
        )}

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
          Judul Advisory <span className="text-brand">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErr(null) }}
          placeholder="mis. Remote Code Execution pada Portal Layanan X"
          className={`${inputCls} mb-4`}
        />

        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
              CVE ID <span className="text-brand">*</span>
            </label>
            <input
              type="text"
              value={cveId}
              onChange={(e) => { setCveId(e.target.value); setErr(null) }}
              placeholder="CVE-2026-21990"
              className={`${inputCls} font-mono text-[12.5px]`}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Skor CVSS <span className="text-brand">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={cvss}
              onChange={(e) => { setCvss(e.target.value); setErr(null) }}
              placeholder="9.8"
              className={`${inputCls} font-mono text-[12.5px]`}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Severity <span className="text-brand">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as AdvisorySeverity)}
              className={inputCls}
              aria-label="Severity advisory"
            >
              {ADVISORY_SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
          Sistem Terdampak <span className="text-brand">*</span>
          <span className="ml-1 font-normal normal-case text-slate-400">(satu per baris)</span>
        </label>
        <textarea
          rows={3}
          value={systems}
          onChange={(e) => { setSystems(e.target.value); setErr(null) }}
          placeholder={'Portal X versi 2.0 – 2.4\nAPI Gateway Y < 3.1.9'}
          className={`${inputCls} mb-4 resize-y font-mono text-[12.5px]`}
        />

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
          Ringkasan <span className="text-brand">*</span>
        </label>
        <textarea
          rows={3}
          value={summary}
          onChange={(e) => { setSummary(e.target.value); setErr(null) }}
          placeholder="Jelaskan kerentanan, dampak, dan status eksploitasi secara ringkas untuk konstituen…"
          className={`${inputCls} mb-4 resize-y leading-relaxed`}
        />

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
          Deskripsi Teknis <span className="font-normal normal-case text-slate-400">(opsional)</span>
        </label>
        <textarea
          rows={3}
          value={technical}
          onChange={(e) => setTechnical(e.target.value)}
          placeholder="Detail teknis: vektor serangan, fungsi rentan, pola log… (bila kosong memakai ringkasan)"
          className={`${inputCls} mb-4 resize-y leading-relaxed`}
        />

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
          Langkah Mitigasi <span className="text-brand">*</span>
          <span className="ml-1 font-normal normal-case text-slate-400">(satu per baris)</span>
        </label>
        <textarea
          rows={4}
          value={mitigation}
          onChange={(e) => { setMitigation(e.target.value); setErr(null) }}
          placeholder={'Upgrade ke versi 2.5 yang sudah dipatch.\nBatasi akses endpoint ke jaringan internal.\nAudit log untuk pola eksploitasi sejak minggu lalu.'}
          className={`${inputCls} resize-y leading-relaxed`}
        />

        <button
          type="submit"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-deep"
        >
          <Megaphone size={16} /> Terbitkan Advisory ke Portal Publik
        </button>
      </form>

      {/* pratinjau + daftar terbit */}
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <h4 className="mb-3 flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <Eye size={13} className="text-brand" /> Pratinjau Kartu
          </h4>
          <div className="rounded-xl border border-line bg-paper p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <AdvisoryBadge severity={severity} />
              <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400">ADV-2026-XXX</span>
            </div>
            <h5 className="font-display text-[15px] font-bold leading-snug text-ink">
              {title.trim() || 'Judul advisory akan tampil di sini…'}
            </h5>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-slate-500">
              <span className="font-bold text-brand">{cveId.trim().toUpperCase() || 'CVE-2026-XXXXX'}</span>
              <span className="flex items-center gap-1"><Gauge size={11} /> CVSS {cvss || '—'}</span>
              <span className="flex items-center gap-1"><CalendarDays size={11} /> {formatDate(new Date().toISOString())}</span>
            </div>
            <p className="mt-3 line-clamp-3 text-[12.5px] leading-relaxed text-slate-600">
              {summary.trim() || 'Ringkasan advisory akan tampil di sini…'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <h4 className="mb-3 flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <Layers size={13} className="text-brand" /> Advisory Terbit ({advisories.length})
          </h4>
          <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {advisories.map((a) => (
              <li
                key={a.id}
                className={`rounded-md border px-3 py-2.5 ${
                  published?.id === a.id ? 'border-green-400 bg-green-50' : 'border-line bg-paper'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AdvisoryBadge severity={a.severity} />
                  <span className="font-mono text-[10px] font-bold text-slate-400">{a.id}</span>
                  {published?.id === a.id && (
                    <span className="rounded bg-green-600 px-1.5 py-px font-mono text-[8.5px] font-bold text-white">BARU</span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-snug text-ink">{a.title}</p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-400">{a.cveId} · {formatDate(a.publishedDate)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ================= SOC AUDIT LOG ================= */

const ACTION_META: Record<AuditAction, { label: string; chip: string }> = {
  LOGIN: { label: 'Login', chip: 'bg-green-50 text-green-700 border-green-300' },
  LOGOUT: { label: 'Logout', chip: 'bg-slate-100 text-slate-600 border-slate-300' },
  THREAT_LEVEL: { label: 'Threat Level', chip: 'bg-amber-50 text-amber-800 border-amber-300' },
  TRIAGE: { label: 'Triase', chip: 'bg-sky-50 text-sky-800 border-sky-300' },
  STATUS_CHANGE: { label: 'Status Tiket', chip: 'bg-brand-soft text-brand-deep border-brand/30' },
  PUBLIC_NOTE: { label: 'Catatan Publik', chip: 'bg-brand-soft text-brand-deep border-brand/30' },
  INTERNAL_NOTE: { label: 'Catatan Internal', chip: 'bg-slate-100 text-ink border-slate-400' },
  IOC_ADDED: { label: 'IoC Baru', chip: 'bg-violet-50 text-violet-700 border-violet-300' },
  ADVISORY_PUBLISHED: { label: 'Advisory Terbit', chip: 'bg-brand text-white border-brand' },
  NVD_IMPORT: { label: 'Impor NVD', chip: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  CVE_LINKED: { label: 'Korelasi CVE', chip: 'bg-sky-50 text-sky-800 border-sky-300' },
  CVE_UNLINKED: { label: 'Lepas CVE', chip: 'bg-slate-100 text-slate-600 border-slate-300' },
  EXPORT_CSV: { label: 'Ekspor CSV', chip: 'bg-ink text-white border-ink' },
  RESET_DEMO: { label: 'Reset Demo', chip: 'bg-amber-100 text-amber-800 border-amber-300' },
}

const ACTION_FILTERS: Array<'ALL' | AuditAction> = ['ALL', ...(Object.keys(ACTION_META) as AuditAction[])]

function AuditLogPanel() {
  const { auditLog } = useCsirt()
  const [actionFilter, setActionFilter] = useState<'ALL' | AuditAction>('ALL')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return auditLog.filter((e) => {
      const matchAction = actionFilter === 'ALL' || e.action === actionFilter
      const matchQuery =
        q === '' ||
        e.actor.toLowerCase().includes(q) ||
        e.detail.toLowerCase().includes(q) ||
        (e.ticketId ?? '').toLowerCase().includes(q)
      return matchAction && matchQuery
    })
  }, [auditLog, actionFilter, query])

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-line bg-paper px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <Filter size={12} className="text-brand" /> Aksi
          </span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as 'ALL' | AuditAction)}
            className="rounded-md border border-line bg-white px-2.5 py-2 font-mono text-[11px] font-bold text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
            aria-label="Filter jenis aksi"
          >
            {ACTION_FILTERS.map((a) => (
              <option key={a} value={a}>{a === 'ALL' ? 'SEMUA AKSI' : ACTION_META[a].label}</option>
            ))}
          </select>
          <span className="font-mono text-[10.5px] tracking-wider text-slate-400">
            {filtered.length} DARI {auditLog.length} AKSI
          </span>
        </div>
        <div className="relative w-full lg:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari petugas, tiket, atau detail aksi…"
            className="w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-[13px] outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
            aria-label="Cari audit log"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <ScrollText size={30} className="mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-ink">
            {auditLog.length === 0 ? 'Belum ada aktivitas petugas tercatat' : 'Tidak ada aksi yang cocok dengan filter'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Setiap login, perubahan tiket, IoC, advisory, dan threat level akan tercatat otomatis di sini.
          </p>
        </div>
      ) : (
        <ol className="divide-y divide-line">
          {filtered.map((e) => (
            <li key={e.id} className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-paper sm:flex-row sm:items-start sm:gap-4">
              <span className="w-44 shrink-0 font-mono text-[10.5px] leading-relaxed text-slate-400">
                {formatDateTime(e.timestamp)}
              </span>
              <span className={`inline-flex w-fit shrink-0 items-center rounded border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide ${ACTION_META[e.action].chip}`}>
                {ACTION_META[e.action].label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] leading-relaxed text-slate-700">{e.detail}</p>
                <p className="mt-0.5 font-mono text-[10px] font-bold text-slate-400">
                  {e.actor} · {e.role === 'SYSTEM' ? 'SISTEM' : ADMIN_ROLE_LABEL[e.role]}
                  {e.ticketId && <span className="ml-2 text-brand">{e.ticketId}</span>}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/* ================= EKSPOR CSV ================= */

function csvEscape(v: string): string {
  return `"${v.replace(/"/g, '""')}"`
}

function exportIncidentsCsv(incidents: IncidentReport[]): number {
  const header = [
    'Ticket ID', 'Judul', 'Kategori', 'Urgensi', 'Status', 'TLP', 'Analis',
    'Pelapor', 'Instansi', 'Email', 'Telepon', 'Sistem Terdampak', 'Waktu Kejadian',
    'Dibuat', 'Diperbarui', 'Jumlah IoC', 'Jumlah Catatan Internal', 'Kronologi',
  ]
  const rows = incidents.map((i) => [
    i.ticketId, i.title, i.category, i.severity, i.status, i.tlp, i.assignedTo ?? '-',
    i.reporterName, i.organization, i.email, i.phone, i.targetSystem, i.incidentDate,
    i.createdAt, i.updatedAt, String(i.iocs.length), String(i.internalNotes.length), i.description,
  ])
  const content = '\uFEFF' + [header, ...rows].map((r) => r.map(csvEscape).join(',')).join('\r\n')
  downloadTextFile(
    `WHOOSH-CSIRT-Rekap-Insiden-${new Date().toISOString().slice(0, 10)}.csv`,
    content,
    'text/csv',
  )
  return incidents.length
}

/* ================= DASHBOARD ================= */

type AdminTab = 'TIKET' | 'NVD' | 'ADVISORY' | 'AUDIT'

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const { incidents, advisories, auditLog, resetDemoData, recordAudit } = useCsirt()
  const [session, setSession] = useState<AdminSession | null>(loadSession)
  const [tab, setTab] = useState<AdminTab>('TIKET')
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL')
  const [severityFilter, setSeverityFilter] = useState<'ALL' | IncidentSeverity>('ALL')
  const [sortMode, setSortMode] = useState<'NEWEST' | 'OLDEST' | 'SEVERITY'>('NEWEST')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [exportFlash, setExportFlash] = useState(false)
  const [advisoryPrefill, setAdvisoryPrefill] = useState<AdvisoryPrefill | null>(null)

  const consumePrefill = useCallback(() => setAdvisoryPrefill(null), [])

  const handleNvdImport = useCallback(
    (cve: NvdCve, source: 'LIVE' | 'DEMO') => {
      if (!session || session.role !== 'LEAD') return
      const actor = { name: session.name, role: session.role }
      const firstSentence = cve.description.split(/(?<=\.)\s/)[0] ?? cve.description
      const shortTitle = firstSentence.length > 90 ? `${firstSentence.slice(0, 87)}…` : firstSentence
      const techParts = [
        cve.cvss?.vector ? `Vektor CVSS v${cve.cvss.version}: ${cve.cvss.vector}` : null,
        cve.weaknesses.length > 0 ? `Kelemahan (CWE): ${cve.weaknesses.join(', ')}` : null,
        cve.references.length > 0
          ? `Referensi resmi:\n${cve.references.slice(0, 5).map((r) => r.url).join('\n')}`
          : null,
      ].filter(Boolean)
      setAdvisoryPrefill({
        key: Date.now(),
        cveId: cve.id,
        cvssScore: cve.cvss ? cve.cvss.score.toFixed(1) : '',
        severity: mapNvdSeverityToAdvisory(cve.cvss?.severity),
        title: `${cve.id} — ${shortTitle}`,
        summary: cve.description,
        technicalDetails: techParts.join('\n\n'),
      })
      recordAudit(
        'NVD_IMPORT',
        `${cve.id} diimpor dari NVD (${source === 'LIVE' ? 'live API v2.0' : 'dataset demo offline'}) ke formulir publikasi advisory — CVSS ${cve.cvss ? cve.cvss.score.toFixed(1) : '—'} ${cve.cvss?.severity ?? ''}`.trim(),
        actor,
      )
      setTab('ADVISORY')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [session, recordAudit],
  )

  const selected = selectedId
    ? incidents.find((i) => i.ticketId === selectedId) ?? null
    : null

  const stats = useMemo(() => {
    const count = (s: IncidentStatus) => incidents.filter((i) => i.status === s).length
    return {
      total: incidents.length,
      open: count('OPEN'),
      investigating: count('INVESTIGATING'),
      containment: count('CONTAINMENT'),
      resolved: count('RESOLVED'),
    }
  }, [incidents])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const severityRank: Record<IncidentSeverity, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return incidents
      .filter((i) => statusFilter === 'ALL' || i.status === statusFilter)
      .filter((i) => severityFilter === 'ALL' || i.severity === severityFilter)
      .filter(
        (i) =>
          q === '' ||
          i.ticketId.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.reporterName.toLowerCase().includes(q) ||
          i.organization.toLowerCase().includes(q) ||
          (i.assignedTo ?? '').toLowerCase().includes(q),
      )
      .sort((a, b) => {
        if (sortMode === 'SEVERITY') {
          const d = severityRank[a.severity] - severityRank[b.severity]
          if (d !== 0) return d
        }
        const ta = new Date(a.createdAt).getTime()
        const tb = new Date(b.createdAt).getTime()
        return sortMode === 'OLDEST' ? ta - tb : tb - ta
      })
  }, [incidents, statusFilter, severityFilter, query, sortMode])

  if (!session) {
    return (
      <AdminLogin
        onSuccess={(s) => {
          setTab('TIKET')
          setAdvisoryPrefill(null)
          setSession(s)
        }}
      />
    )
  }

  const isLead = session.role === 'LEAD'
  const actor = { name: session.name, role: session.role }

  const logout = () => {
    recordAudit('LOGOUT', `${session.name} (${ADMIN_ROLE_LABEL[session.role]}) keluar dari dashboard`, actor)
    sessionStorage.removeItem(AUTH_KEY)
    setSession(null)
  }

  const doExport = () => {
    if (!isLead) return
    const n = exportIncidentsCsv(incidents)
    recordAudit('EXPORT_CSV', `Rekap ${n} tiket insiden diekspor ke CSV`, actor)
    setExportFlash(true)
    setTimeout(() => setExportFlash(false), 3000)
  }

  const statCards = [
    { label: 'Total Laporan', value: stats.total, icon: ClipboardList, cls: 'border-line bg-white text-ink', iconCls: 'bg-ink text-white', sub: 'Seluruh tiket masuk' },
    { label: 'Open', value: stats.open, icon: Siren, cls: 'border-brand/30 bg-white text-brand', iconCls: 'bg-brand text-white', sub: 'Menunggu triase analis' },
    { label: 'Investigating', value: stats.investigating, icon: Eye, cls: 'border-amber-300 bg-white text-ink', iconCls: 'bg-amber-500 text-white', sub: 'Investigasi aktif berjalan' },
    { label: 'Containment', value: stats.containment, icon: ShieldAlert, cls: 'border-slate-400 bg-white text-ink', iconCls: 'bg-slate-700 text-white', sub: 'Isolasi & eradikasi' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, cls: 'border-green-300 bg-white text-green-700', iconCls: 'bg-green-600 text-white', sub: 'Selesai & ditutup' },
  ]

  const tabs: Array<{ id: AdminTab; label: string; icon: typeof ClipboardList; count: number | string; leadOnly?: boolean }> = [
    { id: 'TIKET', label: 'Tiket Insiden', icon: ClipboardList, count: incidents.length },
    { id: 'NVD', label: 'NVD Threat Intelligence', icon: Globe, count: 'API v2.0' },
    { id: 'ADVISORY', label: 'Publikasi Advisory', icon: Megaphone, count: advisories.length, leadOnly: true },
    { id: 'AUDIT', label: 'SOC Audit Log', icon: ScrollText, count: auditLog.length, leadOnly: true },
  ]

  return (
    <div className="min-h-screen bg-paper">
      {/* header */}
      <header className="sticky top-0 z-40 border-b-4 border-brand bg-ink text-white shadow-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-block shrink-0 rounded-md bg-white px-2 py-1">
              <img src="/gemini-svg.svg" alt="WHOOSH CSIRT" className="h-7 w-auto sm:h-8" />
            </span>
            <div className="hidden min-w-0 leading-none sm:block">
              <div className="truncate font-display text-[15px] font-bold">SOC Console KCIC</div>
              <div className="mt-1 truncate font-mono text-[9px] tracking-[0.24em] text-slate-400">
                INCIDENT HANDLER · SOC OPERATIONS
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-2 rounded-md border border-white/15 bg-white/[0.05] px-3 py-1.5 md:flex">
              <User size={13} className="text-brand-bright" />
              <span className="leading-tight">
                <span className="block max-w-40 truncate text-[11.5px] font-bold">{session.name}</span>
                <span className="block font-mono text-[8.5px] tracking-wider text-slate-400">
                  {ADMIN_ROLE_LABEL[session.role].toUpperCase()}
                </span>
              </span>
            </span>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-md border border-white/25 px-3 py-2 text-xs font-bold text-white transition-colors hover:border-white hover:bg-white/10 sm:px-4"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Kembali ke Portal Publik</span>
              <span className="sm:hidden">Portal</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-deep sm:px-4"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ThreatController session={session} />

        {/* tab nav */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-line bg-white p-2 shadow-sm">
          {tabs.map((t) => {
            const locked = Boolean(t.leadOnly) && !isLead
            return (
              <button
                key={t.id}
                onClick={() => { if (!locked) setTab(t.id) }}
                disabled={locked}
                title={locked ? 'Khusus Lead Incident Handler — masuk sebagai handler@kcic.co.id' : t.label}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${
                  locked
                    ? 'cursor-not-allowed text-slate-400 opacity-70'
                    : tab === t.id
                      ? 'bg-ink text-white shadow-md'
                      : 'text-slate-600 hover:bg-paper hover:text-ink'
                }`}
                aria-pressed={tab === t.id}
              >
                <t.icon size={15} className={locked ? 'text-slate-400' : tab === t.id ? 'text-brand-bright' : 'text-brand'} />
                {t.label}
                {locked ? (
                  <Lock size={12} className="text-slate-400" />
                ) : (
                  <span className={`rounded-full px-2 py-px font-mono text-[10px] font-bold ${tab === t.id ? 'bg-white/15 text-white' : 'bg-paper text-slate-500'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {tab === 'TIKET' && (
          <>
            {/* stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
              {statCards.map((c) => (
                <div key={c.label} className={`rounded-xl border-2 p-5 shadow-sm transition-shadow hover:shadow-md ${c.cls}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.iconCls}`}>
                      <c.icon size={17} />
                    </span>
                    <span className="font-display text-3xl font-bold tabular-nums">{c.value}</span>
                  </div>
                  <div className="mt-3 text-[12px] font-bold uppercase tracking-wide">{c.label}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{c.sub}</div>
                </div>
              ))}
            </div>

            {/* toolbar */}
            <div className="mb-5 rounded-xl border border-line bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <Filter size={12} className="text-brand" /> Status
                  </span>
                  {(['ALL', ...INCIDENT_STATUSES] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-md border px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-wide transition-all ${
                        statusFilter === s
                          ? 'border-ink bg-ink text-white'
                          : 'border-line bg-white text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-2">
                    <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <ArrowUpDown size={12} className="text-brand" /> Urutkan
                    </span>
                    <select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value as 'NEWEST' | 'OLDEST' | 'SEVERITY')}
                      className="rounded-md border border-line bg-paper px-2.5 py-2 font-mono text-[11px] font-bold text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
                      aria-label="Urutkan tiket"
                    >
                      <option value="NEWEST">Terbaru</option>
                      <option value="OLDEST">Terlama</option>
                      <option value="SEVERITY">Urgensi Tertinggi</option>
                    </select>
                  </label>
                  <div className="relative w-full sm:w-64 lg:w-72">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari tiket, judul, pelapor, analis…"
                      className="w-full rounded-md border border-line bg-paper py-2 pl-9 pr-3 text-[13px] outline-none transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                      aria-label="Cari insiden"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <ShieldAlert size={12} className="text-brand" /> Urgensi
                </span>
                {(['ALL', ...INCIDENT_SEVERITIES] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverityFilter(s)}
                    className={`rounded-md border px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-wide transition-all ${
                      severityFilter === s
                        ? s === 'CRITICAL'
                          ? 'border-brand bg-brand text-white'
                          : 'border-ink bg-ink text-white'
                        : 'border-line bg-white text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <button
                    onClick={doExport}
                    disabled={!isLead}
                    title={isLead ? 'Unduh rekap seluruh tiket sebagai file Excel/CSV (manual, hanya saat tombol diklik)' : 'Ekspor Excel/CSV khusus Lead Incident Handler'}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-all ${
                      !isLead
                        ? 'cursor-not-allowed border-line bg-paper text-slate-400'
                        : exportFlash
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-green-600/40 bg-white text-green-700 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    {!isLead ? <Lock size={12} /> : exportFlash ? <CheckCircle2 size={12} /> : <FileSpreadsheet size={12} />}
                    {exportFlash && isLead ? 'Excel/CSV Terunduh' : 'Ekspor Laporan Excel (CSV)'}
                  </button>
                  <button
                    onClick={() => { if (isLead) setConfirmReset(true) }}
                    disabled={!isLead}
                    title={isLead ? 'Kembalikan seluruh data demo ke kondisi awal' : 'Reset data demo khusus Lead Incident Handler'}
                    className={`flex items-center gap-1.5 rounded-md border border-dashed px-3 py-1.5 text-[11px] font-bold transition-colors ${
                      isLead
                        ? 'border-slate-300 text-slate-500 hover:border-brand hover:text-brand'
                        : 'cursor-not-allowed border-line text-slate-400'
                    }`}
                  >
                    {isLead ? <RotateCcw size={12} /> : <Lock size={12} />}
                    Reset Data Demo
                  </button>
                </div>
              </div>
            </div>

            {/* table */}
            <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px] text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink bg-paper font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                      <th className="px-4 py-3.5 font-bold">Tiket</th>
                      <th className="px-4 py-3.5 font-bold">Insiden / Pelapor</th>
                      <th className="px-4 py-3.5 font-bold">Urgensi</th>
                      <th className="px-4 py-3.5 font-bold">TLP</th>
                      <th className="px-4 py-3.5 font-bold">Status</th>
                      <th className="px-4 py-3.5 font-bold">Analis</th>
                      <th className="px-4 py-3.5 font-bold">Masuk</th>
                      <th className="px-4 py-3.5 text-right font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-14 text-center">
                          <Inbox size={28} className="mx-auto mb-2 text-slate-300" />
                          <p className="font-bold text-ink">Tidak ada tiket yang cocok dengan filter</p>
                          <p className="mt-1 text-xs text-slate-500">Ubah filter status/urgensi atau kata kunci pencarian.</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((i) => (
                        <tr
                          key={i.ticketId}
                          onClick={() => setSelectedId(i.ticketId)}
                          className="group cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-brand-soft/40"
                        >
                          <td className="px-4 py-3.5 font-mono text-[12px] font-bold text-brand">{i.ticketId}</td>
                          <td className="max-w-[280px] px-4 py-3.5">
                            <div className="truncate font-semibold text-ink">{i.title}</div>
                            <div className="truncate text-[11.5px] text-slate-500">
                              {i.reporterName} · {i.organization}
                            </div>
                          </td>
                          <td className="px-4 py-3.5"><SeverityBadge severity={i.severity} pulse /></td>
                          <td className="px-4 py-3.5"><TlpBadge tlp={i.tlp} /></td>
                          <td className="px-4 py-3.5"><StatusBadge status={i.status} /></td>
                          <td className="px-4 py-3.5 text-[12px] text-slate-600">
                            {i.assignedTo ?? <span className="text-slate-400">—</span>}
                            {i.iocs.length > 0 && (
                              <span className="ml-1.5 rounded bg-violet-50 px-1.5 py-px font-mono text-[9px] font-bold text-violet-700">
                                {i.iocs.length} IoC
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                            {formatDateTime(i.createdAt)}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-line px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                              Tangani / Detail <ChevronRight size={12} />
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-line bg-paper px-4 py-3 font-mono text-[10.5px] tracking-wider text-slate-500">
                <span>MENAMPILKAN {filtered.length} DARI {incidents.length} TIKET</span>
                <span className="flex items-center gap-1.5">
                  <Zap size={11} className="text-brand" /> SINKRON REAL-TIME DENGAN PORTAL PUBLIK
                </span>
              </div>
            </div>
          </>
        )}

        {tab === 'NVD' && (
          <NvdExplorer
            title="NVD Threat Intelligence — Live CVE Feed"
            subtitle="Feed kerentanan terbaru langsung dari NIST National Vulnerability Database (API v2.0). Filter severity, cari CVE / kata kunci, lalu impor ke formulir WHOOSH Advisory untuk menambahkan mitigasi lokal sebelum dipublikasikan."
            isLead={isLead}
            showKeyPanel
            onImport={handleNvdImport}
            perPage={18}
          />
        )}
        {tab === 'ADVISORY' &&
          (isLead ? (
            <AdvisoryPublisher session={session} prefill={advisoryPrefill} onPrefillConsumed={consumePrefill} />
          ) : (
            <LeadOnlyNotice what="Publikasi & impor advisory" />
          ))}
        {tab === 'AUDIT' && (isLead ? <AuditLogPanel /> : <LeadOnlyNotice what="SOC Audit Log" />)}
      </main>

      {session && (
        <IncidentWorkModal incident={selected} session={session} onClose={() => setSelectedId(null)} />
      )}

      {/* reset confirmation */}
      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} maxWidth="max-w-md">
        <div className="px-7 py-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <RotateCcw size={22} />
          </span>
          <h3 className="font-display text-xl font-bold text-ink">Reset Data Demo?</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Semua tiket &amp; advisory hasil uji coba akan dihapus, threat level kembali ke ELEVATED, dan data
            dikembalikan ke kondisi awal (3 tiket contoh, 7 advisory). Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="mt-6 flex gap-2.5">
            <button
              onClick={() => setConfirmReset(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border-2 border-ink py-2.5 text-sm font-bold text-ink transition-colors hover:bg-paper"
            >
              <X size={14} /> Batal
            </button>
            <button
              onClick={() => {
                resetDemoData(actor)
                setSelectedId(null)
                setConfirmReset(false)
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-brand py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-deep"
            >
              <RotateCcw size={14} /> Ya, Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}