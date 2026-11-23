import { spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { C, FONT, MONO } from '../theme'
import BrandPlate from './BrandPlate'

export default function StageTitle({
  index,
  title,
  desc,
  duration,
}: {
  index: string
  title: string
  desc: string
  duration: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 120, mass: 0.9 } })
  const exit = frame > duration - 22 ? 1 - (frame - (duration - 22)) / 22 : 1
  const o = Math.min(enter, Math.max(0, exit))
  return (
    <div
      style={{
        position: 'absolute',
        left: 160,
        top: 26,
        width: 1600,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        opacity: o,
        transform: `translateY(${(1 - enter) * -34}px)`,
        zIndex: 40,
      }}
    >
      <BrandPlate height={58} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              background: C.brand,
              color: '#fff',
              fontFamily: MONO,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 2,
              borderRadius: 7,
              padding: '7px 12px',
              boxShadow: '0 8px 22px rgba(217,4,41,0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            FITUR {index}/04
          </span>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: -1,
              lineHeight: 1.05,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 16.5, color: C.slate400, marginTop: 4 }}>{desc}</div>
      </div>
    </div>
  )
}
