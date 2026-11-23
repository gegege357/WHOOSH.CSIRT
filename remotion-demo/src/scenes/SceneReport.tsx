import type { Waypoint } from '../anim'
import ShotScene, { type CamKey, type Layer, type Mark } from '../components/ShotScene'

const OY = 6250
const H = 1600

const layers: Layer[] = [
  { file: 'home-hero', oy: 0, h: 1000, from: 0 },
  { file: 'home-form-empty', oy: OY, h: H, from: 60 },
  { file: 'home-form-filled', oy: OY, h: H, from: 150 },
  { file: 'home-form-success', oy: OY, h: H, from: 300 },
]

const cam: CamKey[] = [
  { f: 0, x: 800, y: 420, s: 1.15 },
  { f: 35, x: 800, y: 420, s: 1.15 },
  { f: 70, x: 800, y: 6659, s: 1 },
  { f: 95, x: 800, y: 6659, s: 1 },
  { f: 140, x: 511, y: 6700, s: 1.85 },
  { f: 170, x: 511, y: 6700, s: 1.85 },
  { f: 210, x: 800, y: 6960, s: 1.35 },
  { f: 240, x: 800, y: 6960, s: 1.35 },
  { f: 270, x: 943, y: 7094, s: 1.6 },
  { f: 292, x: 943, y: 7094, s: 1.6 },
  { f: 320, x: 1168, y: 7614, s: 1.85 },
  { f: 336, x: 1168, y: 7614, s: 1.85 },
  { f: 360, x: 795, y: 6865, s: 1.55 },
  { f: 380, x: 795, y: 6865, s: 1.55 },
  { f: 400, x: 800, y: 7000, s: 1.35 },
]

const marks: Mark[] = [
  { from: 4, to: 40, x: 196, y: 722, w: 640, h: 44, t: 'Cakupan KCIC/Whoosh', s: 'non-komersial · RFC 2350' },
  { from: 95, to: 205, x: 222, y: 6626, w: 578, h: 148, t: 'Formulir VDP lengkap', s: 'identitas pelapor & kontak resmi' },
  { from: 210, to: 262, x: 222, y: 6891, w: 1146, h: 148, t: 'Detail insiden & kategori', s: 'judul · kategori · urgensi · bukti' },
  { from: 268, to: 296, x: 795, y: 7065, w: 297, h: 78, t: 'Urgensi & bukti', s: 'level MEDIUM · tautan · kronologi' },
  { from: 355, to: 400, x: 575, y: 6798, w: 455, h: 145, t: 'Nomor tiket unik', s: 'WSH-2026-XXXX terbit instan' },
]

const waypoints: Waypoint[] = [
  { f: 75, x: 511, y: 6657 },
  { f: 105, x: 511, y: 6657, click: true },
  { f: 125, x: 511, y: 6743, click: true },
  { f: 150, x: 800, y: 6922, click: true },
  { f: 172, x: 511, y: 7008, click: true },
  { f: 196, x: 943, y: 7104, click: true },
  { f: 230, x: 800, y: 7300 },
  { f: 300, x: 1207, y: 7614 },
  { f: 312, x: 1207, y: 7614, click: true },
  { f: 352, x: 795, y: 6865 },
]

export default function SceneReport() {
  return <ShotScene layers={layers} cam={cam} waypoints={waypoints} marks={marks} />
}
