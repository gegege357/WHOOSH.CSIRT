import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { X, Zap } from 'lucide-react'
import type { AdvisorySeverity, IncidentSeverity, IncidentStatus, ThreatLevel, TlpCode } from '../types/csirt'

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

export function downloadTextFile(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // revokasi ditunda agar pipeline download yang lambat sempat selesai menulis file
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            obs.disconnect()
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  children,
  maxWidth = 'max-w-2xl',
  dark = false,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  maxWidth?: string
  dark?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="animate-backdrop-in absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`animate-modal-in relative w-full ${maxWidth} max-h-[92vh] overflow-y-auto ${
          dark ? 'dark-scroll bg-ink-deep text-white' : 'bg-white text-ink'
        } rounded-t-2xl shadow-2xl shadow-black/40 sm:rounded-2xl`}
      >
        <button
          onClick={onClose}
          aria-label="Tutup"
          className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
            dark
              ? 'border-white/20 text-white/70 hover:border-brand hover:text-white'
              : 'border-line text-slate-500 hover:border-brand hover:text-brand'
          }`}
        >
          <X size={17} />
        </button>
        {children}
      </div>
    </div>
  )
}

const SEVERITY_STYLES: Record<IncidentSeverity, string> = {
  CRITICAL: 'bg-brand text-white',
  HIGH: 'bg-ink text-white',
  MEDIUM: 'bg-slate-600 text-white',
  LOW: 'bg-slate-200 text-slate-700',
}

export function SeverityBadge({ severity, pulse = false }: { severity: IncidentSeverity; pulse?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider ${SEVERITY_STYLES[severity]}`}
    >
      {pulse && severity === 'CRITICAL' && (
        <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
      )}
      {severity}
    </span>
  )
}

const ADVISORY_STYLES: Record<AdvisorySeverity, string> = {
  CRITICAL: 'bg-brand text-white shadow-[0_0_14px_rgba(217,4,41,0.45)]',
  HIGH: 'bg-ink text-white',
  MEDIUM: 'bg-slate-600 text-white',
  INFO: 'bg-brand-soft text-brand-deep border border-brand/25',
}

export function AdvisoryBadge({ severity }: { severity: AdvisorySeverity }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider ${ADVISORY_STYLES[severity]}`}
    >
      {severity}
    </span>
  )
}

export const STATUS_META: Record<
  IncidentStatus,
  { label: string; chip: string; dot: string }
> = {
  OPEN: { label: 'Open', chip: 'bg-brand-soft text-brand-deep border-brand/30', dot: 'bg-brand' },
  TRIAGED: {
    label: 'Triaged',
    chip: 'bg-sky-50 text-sky-800 border-sky-300',
    dot: 'bg-sky-500',
  },
  INVESTIGATING: {
    label: 'Investigating',
    chip: 'bg-amber-50 text-amber-800 border-amber-300',
    dot: 'bg-amber-500',
  },
  CONTAINMENT: {
    label: 'Containment',
    chip: 'bg-slate-100 text-ink border-slate-400',
    dot: 'bg-ink',
  },
  RESOLVED: {
    label: 'Resolved',
    chip: 'bg-green-50 text-green-800 border-green-300',
    dot: 'bg-green-600',
  },
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide ${meta.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

export const THREAT_META: Record<
  ThreatLevel,
  { id: string; badge: string; text: string; solid: string; dot: string }
> = {
  LOW: {
    id: 'RENDAH',
    badge: 'border-green-300 bg-green-50',
    text: 'text-green-700',
    solid: 'border-green-600 bg-green-600 text-white shadow-md shadow-green-600/30',
    dot: 'bg-green-500',
  },
  GUARDED: {
    id: 'TERKENDALI',
    badge: 'border-sky-300 bg-sky-50',
    text: 'text-sky-700',
    solid: 'border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-600/30',
    dot: 'bg-sky-500',
  },
  ELEVATED: {
    id: 'WASPADA',
    badge: 'border-amber-300 bg-amber-50',
    text: 'text-amber-700',
    solid: 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/30',
    dot: 'bg-amber-500',
  },
  CRITICAL: {
    id: 'KRITIS',
    badge: 'border-brand/30 bg-brand-soft',
    text: 'text-brand-deep',
    solid: 'border-brand bg-brand text-white shadow-md shadow-brand/30',
    dot: 'bg-brand',
  },
}

export const TLP_META: Record<TlpCode, { chip: string; desc: string }> = {
  'TLP:RED': {
    chip: 'bg-brand text-white',
    desc: 'Hanya untuk pihak yang disebut langsung dalam laporan.',
  },
  'TLP:AMBER': {
    chip: 'bg-amber-400 text-ink',
    desc: 'Terbatas pada organisasi yang perlu tahu.',
  },
  'TLP:GREEN': {
    chip: 'bg-green-600 text-white',
    desc: 'Dapat dibagikan dalam komunitas konstituen.',
  },
}

export function TlpBadge({ tlp }: { tlp: TlpCode }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider ${TLP_META[tlp].chip}`}
      title={TLP_META[tlp].desc}
    >
      {tlp}
    </span>
  )
}

export function SectionHeading({
  kicker,
  title,
  description,
  dark = false,
}: {
  kicker: string
  title: string
  description?: string
  dark?: boolean
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center bg-brand text-white">
          <Zap size={13} strokeWidth={2.6} />
        </span>
        <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-brand">
          {kicker}
        </span>
        <span className={`h-px flex-1 max-w-24 ${dark ? 'bg-white/20' : 'bg-line'}`} />
      </div>
      <h2
        className={`font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-3 text-[15px] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export function useCopyFeedback(resetMs = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const triggerCopy = async (text: string) => {
    const ok = await copyText(text)
    if (ok) {
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), resetMs)
    }
    return ok
  }

  return { copied, triggerCopy }
}