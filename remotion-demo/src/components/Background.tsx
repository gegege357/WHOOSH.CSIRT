import { useCurrentFrame } from 'remotion'
import { C, STAGE_H, STAGE_W } from '../theme'

export default function Background() {
  const frame = useCurrentFrame()
  const drift = Math.sin(frame / 110) * 46
  const drift2 = Math.cos(frame / 140) * 38
  return (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(155deg, ${C.stage} 0%, ${C.stage2} 58%, #0A0F1E 100%)` }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.055) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -220 + drift,
          top: -260 + drift2,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,4,41,0.22) 0%, rgba(217,4,41,0.07) 45%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -260 - drift,
          bottom: -300 - drift2,
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(217,4,41,0.06) 50%, transparent 72%)',
          filter: 'blur(12px)',
        }}
      />
      {/* speed stripes */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            right: -140,
            top: 120 + i * 260 + drift2 * 0.4,
            width: 620,
            height: i === 1 ? 5 : 2.5,
            transform: 'rotate(-24deg)',
            background: i === 1 ? `linear-gradient(90deg, transparent, ${C.brand} 30%, ${C.brandBright})` : 'rgba(217,4,41,0.4)',
            opacity: 0.5,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(2,6,23,0.55) 100%)`,
        }}
      />
      <div style={{ position: 'absolute', left: 0, top: 0, width: STAGE_W, height: 4, background: `linear-gradient(90deg, ${C.brand}, ${C.brandBright} 45%, transparent)` }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: STAGE_W, height: 4, background: `linear-gradient(270deg, ${C.brand}, ${C.brandBright} 45%, transparent)` }} />
      <div style={{ position: 'absolute', right: 26, bottom: 18, fontFamily: "'Consolas', monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(148,163,184,0.5)' }}>
        {STAGE_W}×{STAGE_H} · 30 FPS · REMOTION
      </div>
    </div>
  )
}