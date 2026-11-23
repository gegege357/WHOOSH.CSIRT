import { ArrowRight, Mail, Phone, ShieldCheck, Zap } from 'lucide-react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import BrandPlate from '../components/BrandPlate'
import { C, FONT, MONO } from '../theme'

export default function Outro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const mark = spring({ frame, fps, config: { damping: 13, stiffness: 90 } })
  const word = spring({ frame: frame - 12, fps, config: { damping: 15, stiffness: 110 } })
  const tag = spring({ frame: frame - 26, fps, config: { damping: 16, stiffness: 120 } })
  const cta = spring({ frame: frame - 44, fps, config: { damping: 14, stiffness: 120 } })
  const contacts = spring({ frame: frame - 62, fps, config: { damping: 16, stiffness: 120 } })
  const chips = spring({ frame: frame - 80, fps, config: { damping: 16, stiffness: 120 } })
  const pulse = 1 + Math.sin(frame / 9) * 0.012
  const glow = interpolate(Math.sin(frame / 14), [-1, 1], [0.25, 0.5])

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
      <div style={{ position: 'absolute', width: 760, height: 760, borderRadius: '50%', background: `radial-gradient(circle, rgba(217,4,41,${glow}) 0%, transparent 65%)`, filter: 'blur(14px)' }} />
      <div style={{ opacity: mark, transform: `translateY(${(1 - mark) * 26}px)` }}>
        <BrandPlate height={140} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, opacity: word, transform: `translateY(${(1 - word) * 30}px)` }}>
        <span style={{ fontFamily: FONT, fontSize: 78, fontWeight: 900, color: '#FFFFFF', letterSpacing: -2, lineHeight: 1 }}>WHOOSH.</span>
        <span style={{ background: C.brand, color: '#fff', fontFamily: FONT, fontSize: 34, fontWeight: 900, letterSpacing: 3, borderRadius: 10, padding: '9px 20px', boxShadow: '0 14px 38px rgba(217,4,41,0.45)' }}>CSIRT</span>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 25, color: C.slate300, marginTop: 22, maxWidth: 1100, textAlign: 'center', lineHeight: 1.5, opacity: tag, transform: `translateY(${(1 - tag) * 24}px)` }}>
        Wadah publik uji keamanan &amp; pelaporan insiden —{' '}
        <strong style={{ color: '#fff' }}>PT Kereta Cepat Indonesia China (KCIC)</strong>, operator Whoosh Jakarta–Bandung.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32, background: C.brand, color: '#fff', borderRadius: 14, padding: '20px 40px', fontFamily: FONT, fontSize: 25, fontWeight: 800, boxShadow: '0 18px 44px rgba(217,4,41,0.45)', transform: `scale(${(0.85 + cta * 0.15) * pulse})`, opacity: cta }}>
        <Zap size={26} /> Laporkan Insiden Sekarang <ArrowRight size={24} />
      </div>
      <div style={{ display: 'flex', gap: 26, marginTop: 28, opacity: contacts, transform: `translateY(${(1 - contacts) * 20}px)` }}>
        {[
          { icon: Phone, t: '+62 21 500-911' },
          { icon: Mail, t: 'csirt@kcic.co.id' },
          { icon: ShieldCheck, t: 'csirt.kcic.co.id' },
        ].map((c) => (
          <span key={c.t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 19, fontWeight: 700, color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.05)', borderRadius: 999, padding: '12px 24px' }}>
            <c.icon size={19} color={C.brandBright} /> {c.t}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 26, opacity: chips, transform: `translateY(${(1 - chips) * 18}px)` }}>
        {['NON-KOMERSIAL', 'RFC 2350 · BSSN', '24/7/365', 'CAKUPAN: KCIC / WHOOSH SAJA'].map((t) => (
          <span key={t} style={{ fontFamily: MONO, fontSize: 15, fontWeight: 800, letterSpacing: 1.8, color: C.slate400, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '10px 18px' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}