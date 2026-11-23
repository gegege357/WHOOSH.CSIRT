import type { Waypoint } from '../anim'
import ShotScene, { type CamKey, type Layer, type Mark } from '../components/ShotScene'

const OY = 4462
const H = 1371

const layers: Layer[] = [{ file: 'home-advisory', oy: OY, h: H, from: 0 }]

const cam: CamKey[] = [
  { f: 0, x: 800, y: 4871, s: 1 },
  { f: 40, x: 800, y: 4871, s: 1 },
  { f: 100, x: 383, y: 5130, s: 1.7 },
  { f: 150, x: 383, y: 5130, s: 1.7 },
  { f: 200, x: 800, y: 5150, s: 1.3 },
  { f: 250, x: 800, y: 5150, s: 1.3 },
  { f: 300, x: 800, y: 4900, s: 1.1 },
]

const marks: Mark[] = [
  { from: 100, to: 190, x: 187, y: 4999, w: 392, h: 264, t: 'Advisory impor NVD', s: 'CVE feed → publikasi TLP:CLEAR' },
  { from: 200, to: 290, x: 187, y: 4999, w: 1226, h: 264, t: 'Publikasi publik', s: 'peringatan dini & guidance konstituen' },
]

const waypoints: Waypoint[] = [
  { f: 10, x: 800, y: 4871 },
  { f: 110, x: 383, y: 5130 },
  { f: 210, x: 800, y: 5150 },
]

export default function SceneAdvisory() {
  return <ShotScene layers={layers} cam={cam} waypoints={waypoints} marks={marks} />
}
