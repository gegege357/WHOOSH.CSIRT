import { Easing, interpolate } from 'remotion'

export function seg(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
}

export function linear(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

export function typed(text: string, frame: number, start: number, end: number): string {
  const n = Math.round(linear(frame, start, end) * text.length)
  return text.slice(0, n)
}

export function caretOn(frame: number, active: boolean): boolean {
  return active && frame % 24 < 14
}

export interface Waypoint {
  f: number
  x: number
  y: number
  click?: boolean
}

export function cursorAt(waypoints: Waypoint[], frame: number): { x: number; y: number } {
  if (frame <= waypoints[0].f) return { x: waypoints[0].x, y: waypoints[0].y }
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]
    const b = waypoints[i + 1]
    if (frame >= a.f && frame <= b.f) {
      const t = seg(frame, a.f, b.f)
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
  }
  const last = waypoints[waypoints.length - 1]
  return { x: last.x, y: last.y }
}

export function lastClick(waypoints: Waypoint[], frame: number): { age: number; x: number; y: number } | null {
  let found: { age: number; x: number; y: number } | null = null
  for (const w of waypoints) {
    if (w.click && w.f <= frame && frame - w.f < 26) {
      found = { age: frame - w.f, x: w.x, y: w.y }
    }
  }
  return found
}

export function fadeIn(frame: number, start: number, dur = 18): number {
  return linear(frame, start, start + dur)
}

export function fadeOut(frame: number, start: number, end: number): number {
  return 1 - linear(frame, start, end)
}