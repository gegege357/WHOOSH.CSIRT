import { ArrowRight, Clock, FileBadge, KeyRound, Lock, Radar, TrainFront, Zap } from 'lucide-react'
import { useCurrentFrame } from 'remotion'
import { seg } from '../anim'
import { MiniNavbar } from './Chrome'
import { C, FONT, MONO } from '../theme'

const METRICS = [
  { icon: Clock, value: '< 15 Menit', label: 'Respons Triase Awal' },
  { icon: Radar, value: '24/7/365', label: 'Siaga Operasional' },
  { icon: Lock, value: 'TLP:RED', label: 'Kerahasiaan Terjamin' },
  { icon: FileBadge, value: 'RFC 2350', label: 'Standar Kepatuhan' },
]

export default function HeroSnapshot() {
  const frame = useCurrentFrame()
  const a = seg(frame, 0, 26)
  return (
    <div style={{ width: '100%', height: '100%', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <MiniNavbar active="Beranda" />
      <div
        style={{
          position: 'absolute',
          inset: 64,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div style={{ position: 'absolute', right: -60, top: 130, width: 560, height: 8, transform: 'rotate(-24deg)', background: `linear-gradient(90deg, ${C.brand}, ${C.brandBright}, transparent)`, opacity: 0.8 }} />
      <div style={{ position: 'absolute', right: -20, top: 250, width: 480, height: 3, transform: 'rotate(-24deg)', background: C.ink, opacity: 0.55 }} />
      <div style={{ position: 'absolute', right: -80, top: 360, width: 620, height: 12, transform: 'rotate(-24deg)', background: `linear-gradient(90deg, ${C.brandDeep}, ${C.brand}, transparent)`, opacity: 0.7 }} />
      <div style={{ position: 'relative', padding: '44px 56px', opacity: a, transform: `translateY(${(1 - a) * 26}px)` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: `1px solid ${C.line}`, borderRadius: 999, padding: '7px 16px', background: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}>
          <TrainFront size={14} color={C.brand} />
          <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.6, color: C.slate600 }}>
            PT KERETA CEPAT INDONESIA CHINA (KCIC)
          </span>
          <span style={{ background: C.brand, color: '#fff', borderRadius: 999, padding: '2px 9px', fontFamily: MONO, fontSize: 10.5, fontWeight: 800 }}>WHOOSH</span>
        </div>
        <h1 style={{ fontFamily: FONT, fontSize: 58, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.2, color: C.ink, margin: '22px 0 0' }}>
          <span style={{ color: C.brand }}>WHOOSH</span> CSIRT —
          <br />
          Rapid Cyber Incident
          <br />
          Response &amp; <span style={{ borderBottom: `6px solid ${C.brand}` }}>Defense</span>
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 16, lineHeight: 1.55, color: C.slate600, maxWidth: 640, margin: '20px 0 0' }}>
          Tim Tanggap Insiden Keamanan Siber resmi PT KCIC — operator kereta cepat Whoosh koridor
          Jakarta–Bandung (Halim · Karawang · Padalarang · Tegalluar). Siaga 24 jam.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: C.brand, color: '#fff', borderRadius: 8, padding: '13px 24px', fontFamily: FONT, fontSize: 15, fontWeight: 800, boxShadow: '0 10px 24px rgba(217,4,41,0.32)' }}>
            <Zap size={17} /> Laporkan Insiden Sekarang <ArrowRight size={16} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, border: `2px solid ${C.ink}`, color: C.ink, borderRadius: 8, padding: '13px 24px', fontFamily: FONT, fontSize: 15, fontWeight: 800 }}>
            <KeyRound size={16} /> Unduh PGP Key
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 34 }}>
          {METRICS.map((m, i) => {
            const t = seg(frame, 8 + i * 6, 30 + i * 6)
            return (
              <div key={m.value} style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: '#fff', padding: '16px 18px', boxShadow: '0 3px 12px rgba(15,23,42,0.05)', opacity: t, transform: `translateY(${(1 - t) * 18}px)` }}>
                <m.icon size={19} color={C.brand} strokeWidth={2.2} />
                <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 8 }}>{m.value}</div>
                <div style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: C.brandDeep, marginTop: 2 }}>{m.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}