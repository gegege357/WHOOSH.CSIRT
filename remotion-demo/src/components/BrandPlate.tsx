import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'

export default function BrandPlate({ height, delay = 0 }: { height: number; delay?: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 120, mass: 0.9 } })
  return (
    <div
      style={{
        opacity: Math.min(1, s),
        transform: `scale(${0.55 + s * 0.45}) rotate(${(1 - s) * -8}deg)`,
        filter: 'drop-shadow(0 14px 34px rgba(217,4,41,0.5))',
        flexShrink: 0,
      }}
    >
      <Img src={staticFile('gemini-icon.svg')} style={{ width: height, height, display: 'block' }} />
    </div>
  )
}
