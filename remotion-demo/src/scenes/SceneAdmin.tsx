import type { Waypoint } from '../anim'
import ShotScene, { type CamKey, type Layer, type Mark } from '../components/ShotScene'

const layers: Layer[] = [
  { file: 'admin-dash', oy: 0, h: 1588, from: 0 },
  { file: 'admin-threat', oy: 0, h: 1588, from: 60 },
  { file: 'admin-export', oy: 0, h: 1588, from: 150 },
  { file: 'admin-nvd', oy: 0, h: 3211, from: 290 },
  { file: 'admin-import', oy: 0, h: 1401, from: 400 },
]

const cam: CamKey[] = [
  { f: 0, x: 800, y: 409, s: 1 },
  { f: 30, x: 800, y: 409, s: 1 },
  { f: 80, x: 943, y: 215, s: 1.9 },
  { f: 120, x: 943, y: 215, s: 1.9 },
  { f: 160, x: 1146, y: 633, s: 2 },
  { f: 210, x: 1146, y: 633, s: 2 },
  { f: 240, x: 510, y: 333, s: 1.9 },
  { f: 275, x: 510, y: 333, s: 1.9 },
  { f: 310, x: 800, y: 940, s: 1.3 },
  { f: 355, x: 800, y: 940, s: 1.3 },
  { f: 370, x: 795, y: 2929, s: 1.45 },
  { f: 400, x: 795, y: 2929, s: 1.45 },
  { f: 415, x: 444, y: 1174, s: 1.8 },
  { f: 445, x: 444, y: 1174, s: 1.8 },
  { f: 462, x: 800, y: 700, s: 1.2 },
  { f: 480, x: 800, y: 700, s: 1.2 },
]

const marks: Mark[] = [
  { from: 82, to: 122, x: 791, y: 155, w: 304, h: 62, t: 'Threat level internal', s: 'LOW → CRITICAL, hanya SOC' },
  { from: 162, to: 212, x: 1090, y: 616, w: 158, h: 34, t: 'Ekspor Excel manual', s: 'unduhan hanya via tombol' },
  { from: 312, to: 357, x: 200, y: 915, w: 1200, h: 60, t: 'NVD live → advisory', s: 'feed CVE real-time dari NIST' },
  { from: 417, to: 447, x: 216, y: 1297, w: 667, h: 50, t: 'Import jadi advisory publik', s: 'CVE → publikasi halaman Advisory' },
]

const waypoints: Waypoint[] = [
  { f: 10, x: 800, y: 409 },
  { f: 45, x: 943, y: 215 },
  { f: 60, x: 943, y: 215, click: true },
  { f: 100, x: 1146, y: 633 },
  { f: 180, x: 1146, y: 633, click: true },
  { f: 250, x: 510, y: 333 },
  { f: 330, x: 516, y: 333, click: true },
  { f: 385, x: 795, y: 2929 },
  { f: 425, x: 550, y: 1320, click: true },
  { f: 455, x: 800, y: 700 },
]

export default function SceneAdmin() {
  return <ShotScene layers={layers} cam={cam} waypoints={waypoints} marks={marks} />
}
