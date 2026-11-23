import type { ReactNode } from 'react'
import { Img, staticFile } from 'remotion'
import { Zap } from 'lucide-react'
import { C, FONT, MONO } from '../theme'

export function MiniNavbar({ active }: { active?: string }) {
  const links = ['Beranda', 'Profil & RFC 2350', 'Mandat Operasional', 'Advisory', 'Lacak Tiket', 'Panduan']
  return (
    <div
      style={{
        height: 64,
        background: '#FFFFFF',
        borderBottom: `1px solid ${C.line}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        gap: 28,
        boxShadow: '0 2px 10px rgba(15,23,42,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Img src={staticFile('gemini-svg.svg')} style={{ height: 36 }} />
      </div>
      <div style={{ display: 'flex', gap: 22, marginLeft: 12 }}>
        {links.map((l) => (
          <span
            key={l}
            style={{
              fontFamily: FONT,
              fontSize: 13.5,
              fontWeight: active === l ? 800 : 600,
              color: active === l ? C.brand : C.slate600,
              borderBottom: active === l ? `2.5px solid ${C.brand}` : '2.5px solid transparent',
              paddingBottom: 4,
            }}
          >
            {l}
          </span>
        ))}
      </div>
      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: C.brand,
          color: '#fff',
          borderRadius: 8,
          padding: '9px 18px',
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 800,
          boxShadow: '0 6px 16px rgba(217,4,41,0.3)',
        }}
      >
        <Zap size={14} /> Laporkan Insiden
      </div>
    </div>
  )
}

export function Field({
  label,
  value,
  caret,
  placeholder,
  height = 48,
  focus,
}: {
  label: string
  value: string
  caret?: boolean
  placeholder?: string
  height?: number
  focus?: boolean
}) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: C.slate400, marginBottom: 6, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div
        style={{
          height,
          borderRadius: 8,
          border: `1.5px solid ${focus ? C.brand : 'rgba(255,255,255,0.16)'}`,
          background: focus ? 'rgba(217,4,41,0.08)' : 'rgba(255,255,255,0.06)',
          boxShadow: focus ? '0 0 0 3px rgba(217,4,41,0.22)' : 'none',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          fontFamily: FONT,
          fontSize: 14.5,
          color: value ? '#F1F5F9' : C.slate500,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {value || placeholder || ''}
        {caret && <span style={{ width: 2, height: 20, background: C.brandBright, marginLeft: 2 }} />}
      </div>
    </div>
  )
}

export function Toast({ show, tone, children }: { show: number; tone: 'green' | 'amber' | 'brand'; children: ReactNode }) {
  const bg = tone === 'green' ? C.greenSoft : tone === 'amber' ? C.amberSoft : C.brandSoft
  const bd = tone === 'green' ? C.green : tone === 'amber' ? C.amber : C.brand
  const fg = tone === 'green' ? '#166534' : tone === 'amber' ? '#92400E' : C.brandDeep
  return (
    <div
      style={{
        position: 'absolute',
        top: 84,
        right: 36,
        zIndex: 55,
        transform: `translateX(${(1 - show) * 420}px)`,
        opacity: show,
        background: bg,
        border: `1.5px solid ${bd}`,
        borderRadius: 10,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: FONT,
        fontSize: 13.5,
        fontWeight: 700,
        color: fg,
        boxShadow: '0 12px 30px rgba(15,23,42,0.18)',
        maxWidth: 560,
      }}
    >
      {children}
    </div>
  )
}

export function SevBadge({ sev, small }: { sev: string; small?: boolean }) {
  const map: Record<string, { bg: string; fg: string }> = {
    CRITICAL: { bg: C.brand, fg: '#fff' },
    HIGH: { bg: C.ink, fg: '#fff' },
    MEDIUM: { bg: '#FBBF24', fg: C.ink },
    LOW: { bg: '#E2E8F0', fg: C.ink },
    INFO: { bg: '#DBEAFE', fg: '#1E40AF' },
  }
  const t = map[sev] ?? map.INFO
  return (
    <span
      style={{
        background: t.bg,
        color: t.fg,
        borderRadius: 6,
        padding: small ? '3px 8px' : '5px 11px',
        fontFamily: MONO,
        fontSize: small ? 10.5 : 12,
        fontWeight: 800,
        letterSpacing: 0.8,
      }}
    >
      {sev}
    </span>
  )
}