import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import BrandPlate from '../components/BrandPlate'
import { C, FONT, MONO } from '../theme'

export default function Intro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const mark = spring({ frame, fps, config: { damping: 13, stiffness: 90, mass: 1 } })
  const word = spring({ frame: frame - 16, fps, config: { damping: 15, stiffness: 110 } })
  const sub = spring({ frame: frame - 30, fps, config: { damping: 16, stiffness: 120 } })
  const exit = 1 - interpolate(frame, [104, 132], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: exit, transform: `translateY(${(1 - exit) * -60}px)`, zIndex: 30 }}>
      <div style={{ opacity: mark, transform: `translateY(${(1 - mark) * 30}px)` }}>
        <BrandPlate height={170} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, opacity: word, transform: `translateY(${(1 - word) * 34}px)` }}>
        <span style={{ fontFamily: FONT, fontSize: 108, fontWeight: 900, color: '#FFFFFF', letterSpacing: -3, lineHeight: 1 }}>WHOOSH.</span>
        <span style={{ background: C.brand, color: '#fff', fontFamily: FONT, fontSize: 46, fontWeight: 900, letterSpacing: 4, borderRadius: 12, padding: '12px 28px', boxShadow: '0 16px 44px rgba(217,4,41,0.45)' }}>CSIRT</span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, letterSpacing: 4, color: C.slate400, marginTop: 18, opacity: sub, transform: `translateY(${(1 - sub) * 26}px)` }}>
        INCIDENT RESPONSE TEAM · PT KERETA CEPAT INDONESIA CHINA (KCIC)
      </div>
    </div>
  )
}