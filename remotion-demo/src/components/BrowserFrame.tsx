import type { ReactNode } from 'react'
import { Lock, RotateCw, Star } from 'lucide-react'
import { BROWSER_H, BROWSER_W, BROWSER_X, BROWSER_Y, C, CHROME_H, CONTENT_H, MONO } from '../theme'

export default function BrowserFrame({
  url,
  enter,
  exit,
  children,
}: {
  url: string
  enter: number
  exit: number
  children: ReactNode
}) {
  const translateY = (1 - enter) * 140 + (1 - exit) * -30
  const scale = 0.94 + enter * 0.06 - (1 - exit) * 0.06
  return (
    <div
      style={{
        position: 'absolute',
        left: BROWSER_X,
        top: BROWSER_Y,
        width: BROWSER_W,
        height: BROWSER_H,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: '50% 60%',
        opacity: Math.min(enter, exit),
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4), 0 0 120px rgba(217,4,41,0.12)',
        overflow: 'hidden',
        background: C.inkDeep,
      }}
    >
      {/* chrome bar */}
      <div
        style={{
          height: CHROME_H,
          background: 'linear-gradient(180deg, #1E293B 0%, #16213A 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 22px',
        }}
      >
        <div style={{ display: 'flex', gap: 9 }}>
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(2,6,23,0.55)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999,
            padding: '8px 18px',
          }}
        >
          <Lock size={13} color="#4ADE80" />
          <span style={{ fontFamily: MONO, fontSize: 13.5, color: '#CBD5E1', letterSpacing: 0.4 }}>{url}</span>
        </div>
        <RotateCw size={15} color="#64748B" />
        <Star size={15} color="#64748B" />
      </div>
      {/* viewport */}
      <div style={{ position: 'relative', width: BROWSER_W, height: CONTENT_H, overflow: 'hidden', background: '#FFFFFF' }}>
        {children}
      </div>
    </div>
  )
}