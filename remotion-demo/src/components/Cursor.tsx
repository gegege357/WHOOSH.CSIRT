import { MousePointer2 } from 'lucide-react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { cursorAt, lastClick } from '../anim'
import type { Waypoint } from '../anim'
import { C } from '../theme'

export default function Cursor({ waypoints, hideAfter }: { waypoints: Waypoint[]; hideAfter?: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { x, y } = cursorAt(waypoints, frame)
  const click = lastClick(waypoints, frame)

  const press = click
    ? interpolate(spring({ frame: click.age, fps, config: { damping: 14, stiffness: 260, mass: 0.6 } }), [0, 1], [0.78, 1])
    : 1
  const opacity = hideAfter === undefined ? 1 : 1 - interpolate(frame, [hideAfter, hideAfter + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 60, opacity }}>
      {click && (
        <div
          style={{
            position: 'absolute',
            left: click.x,
            top: click.y,
            width: interpolate(click.age, [0, 24], [10, 68]),
            height: interpolate(click.age, [0, 24], [10, 68]),
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: `2.5px solid ${C.brand}`,
            opacity: interpolate(click.age, [0, 24], [0.65, 0]),
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `scale(${press})`,
          transformOrigin: '4px 4px',
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
        }}
      >
        <MousePointer2 size={34} color={C.inkDeep} fill="#FFFFFF" strokeWidth={1.6} />
      </div>
    </div>
  )
}