import type { Waypoint } from '../anim'
import ShotScene, { type CamKey, type Layer, type Mark } from '../components/ShotScene'

const OY = 7128
const H = 2600

const layers: Layer[] = [
  { file: 'track-empty', oy: OY, h: H, from: 0 },
  { file: 'track-result', oy: OY, h: H, from: 110 },
]

const cam: CamKey[] = [
  { f: 0, x: 620, y: 7430, s: 1.45 },
  { f: 30, x: 620, y: 7430, s: 1.45 },
  { f: 70, x: 460, y: 7534, s: 1.9 },
  { f: 100, x: 460, y: 7534, s: 1.9 },
  { f: 115, x: 785, y: 7534, s: 1.9 },
  { f: 135, x: 785, y: 7534, s: 1.9 },
  { f: 170, x: 795, y: 7643, s: 1.5 },
  { f: 200, x: 795, y: 7643, s: 1.5 },
  { f: 230, x: 795, y: 7784, s: 1.35 },
  { f: 272, x: 795, y: 7784, s: 1.35 },
  { f: 300, x: 800, y: 8000, s: 1.35 },
  { f: 332, x: 800, y: 8000, s: 1.35 },
  { f: 360, x: 800, y: 7900, s: 1.25 },
]

const marks: Mark[] = [
  { from: 5, to: 130, x: 184, y: 7500, w: 688, h: 68, t: 'Lacak real-time', s: 'status OPEN → RESOLVED' },
  { from: 165, to: 268, x: 212, y: 7621, w: 1166, h: 218, t: 'Stepper 5 tahap', s: 'triase → containment → resolved' },
  { from: 296, to: 346, x: 705, y: 7870, w: 675, h: 340, t: 'Riwayat analis CSIRT', s: 'catatan resmi bertimestamp' },
]

const waypoints: Waypoint[] = [
  { f: 10, x: 443, y: 7534 },
  { f: 40, x: 443, y: 7534, click: true },
  { f: 105, x: 785, y: 7534 },
  { f: 120, x: 785, y: 7534, click: true },
  { f: 180, x: 795, y: 7700 },
  { f: 240, x: 795, y: 7850 },
  { f: 305, x: 800, y: 8000 },
]

export default function SceneTrack() {
  return <ShotScene layers={layers} cam={cam} waypoints={waypoints} marks={marks} />
}
