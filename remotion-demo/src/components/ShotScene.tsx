import { MousePointer2 } from 'lucide-react'
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { cursorAt, fadeIn, lastClick, type Waypoint } from '../anim'
import { C, CONTENT_H, CONTENT_W, FONT, MONO } from '../theme'

export interface Box {
  x: number
  y: number
  w: number
  h: number
}
export interface Layer {
  file: string
  oy: number
  h: number
  from: number
}
export interface CamKey {
  f: number
  x: number
  y: number
  s: number
}
export interface Mark {
  from: number
  to: number
  x: number
  y: number
  w: number
  h: number
  t: string
  s: string
}

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)

export function scaleFor(b: Box, max = 2): number {
  return clamp(Math.min((CONTENT_W * 0.68) / b.w, (CONTENT_H * 0.5) / b.h), 1.35, max)
}

export function center(b: Box): { x: number; y: number } {
  return { x: b.x + b.w / 2, y: b.y + b.h / 2 }
}

function track(frame: number, keys: CamKey[], pick: (k: CamKey) => number): number {
  if (keys.length === 1) return pick(keys[0])
  return interpolate(frame, keys.map((k) => k.f), keys.map(pick), {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
}

export default function ShotScene({
  layers,
  cam,
  waypoints,
  marks,
}: {
  layers: Layer[]
  cam: CamKey[]
  waypoints: Waypoint[]
  marks?: Mark[]
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const active = layers.filter((l) => l.from <= frame).pop() ?? layers[0]
  const s = track(frame, cam, (k) => k.s)
  const fx = clamp(track(frame, cam, (k) => k.x), CONTENT_W / 2 / s, CONTENT_W - CONTENT_W / 2 / s)
  const fy = clamp(
    track(frame, cam, (k) => k.y),
    active.oy + CONTENT_H / 2 / s,
    active.oy + active.h - CONTENT_H / 2 / s,
  )
  const tx = CONTENT_W / 2 - fx * s
  const ty = CONTENT_H / 2 - (fy - active.oy) * s
  const cur = cursorAt(waypoints, frame)
  const cx = cur.x * s + tx
  const cy = (cur.y - active.oy) * s + ty
  const click = lastClick(waypoints, frame)
  const ring = click ? spring({ frame: click.age, fps, config: { damping: 14, stiffness: 120, mass: 0.6 } }) : 0

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0B1220' }}>
      {layers.map((l) => (
        <div
          key={l.file}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: CONTENT_W,
            height: l.h,
            transform: `translate(${tx}px, ${ty - (active.oy - l.oy) * s}px) scale(${s})`,
            transformOrigin: '0 0',
            opacity: fadeIn(frame, l.from, 10),
          }}
        >
          <Img src={staticFile(`shots/${l.file}.png`)} style={{ width: CONTENT_W, height: l.h, display: 'block' }} />
        </div>
      ))}
      {marks?.map((m) => {
        const o = Math.min(fadeIn(frame, m.from, 8), 1 - fadeIn(frame, m.to, 6))
        if (o <= 0) return null
        const left = (m.x - fx) * s + CONTENT_W / 2
        const top = (m.y - fy) * s + CONTENT_H / 2
        const pop = spring({ frame: frame - m.from, fps, config: { damping: 14, stiffness: 130 } })
        const above = top > 78
        const chipLeft = clamp(left - 3, 8, CONTENT_W - 380)
        return (
          <div
            key={m.t}
            style={{
              position: 'absolute',
              left,
              top,
              width: m.w * s,
              height: m.h * s,
              border: `3px solid ${C.brand}`,
              borderRadius: 14,
              background: 'rgba(217,4,41,0.07)',
              boxShadow: '0 0 26px rgba(217,4,41,0.35)',
              opacity: o,
              zIndex: 4,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: chipLeft,
                top: above ? -66 : m.h * s + 12,
                background: C.brand,
                borderRadius: 10,
                padding: '8px 14px',
                opacity: pop,
                transform: `scale(${0.85 + pop * 0.15})`,
                transformOrigin: '0 100%',
                boxShadow: '0 10px 26px rgba(217,4,41,0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 800, color: '#fff' }}>{m.t}</div>
              <div style={{ fontFamily: MONO, fontSize: 12.5, color: '#FECACA', marginTop: 1 }}>{m.s}</div>
            </div>
          </div>
        )
      })}
      <div style={{ position: 'absolute', left: cx, top: cy, zIndex: 5 }}>
        {click && (
          <div
            style={{
              position: 'absolute',
              left: -18,
              top: -18,
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '3px solid rgba(217,4,41,0.85)',
              transform: `scale(${0.4 + ring * 1.1})`,
              opacity: Math.max(0, 1 - ring),
            }}
          />
        )}
        <MousePointer2
          size={30}
          color="#111111"
          fill="#FFFFFF"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))', transform: 'translate(-4px,-3px)' }}
        />
      </div>
    </div>
  )
}
