import { interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import Background from './components/Background'
import BrowserFrame from './components/BrowserFrame'
import HeroSnapshot from './components/HeroSnapshot'
import StageTitle from './components/StageTitle'
import Intro from './scenes/Intro'
import Outro from './scenes/Outro'
import SceneAdmin from './scenes/SceneAdmin'
import SceneAdvisory from './scenes/SceneAdvisory'
import SceneReport from './scenes/SceneReport'
import SceneTrack from './scenes/SceneTrack'
import { F1_END, F2_END, F3_END, F4_END, INTRO_END, STAGE_H, STAGE_W, TOTAL } from './theme'

function ActDip() {
  const frame = useCurrentFrame()
  const dip = Math.max(...[INTRO_END, F1_END, F2_END, F3_END].map((b) => Math.max(0, 1 - Math.abs(frame - b) / 12)))
  if (dip <= 0) return null
  return <div style={{ position: 'absolute', inset: 0, background: '#0B1220', opacity: dip, zIndex: 6, pointerEvents: 'none' }} />
}

export default function DemoVideo() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const browserEnter = spring({ frame: Math.max(0, frame - 108), fps, config: { damping: 18, stiffness: 95, mass: 1 } })
  const browserExit = 1 - interpolate(frame, [F4_END - 42, F4_END - 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const url = frame < F2_END ? 'csirt.kcic.co.id' : frame < F3_END ? 'csirt.kcic.co.id/soc-control-wsh26' : 'csirt.kcic.co.id#advisory'

  return (
    <div style={{ width: STAGE_W, height: STAGE_H, position: 'relative', overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Background />

      {frame >= 108 && (
        <BrowserFrame url={url} enter={browserEnter} exit={browserExit}>
          {frame < INTRO_END && <HeroSnapshot />}
          <Sequence from={INTRO_END} durationInFrames={F1_END - INTRO_END} name="Fitur 1 — Lapor Insiden & VDP">
            <SceneReport />
          </Sequence>
          <Sequence from={F1_END} durationInFrames={F2_END - F1_END} name="Fitur 2 — Lacak Tiket">
            <SceneTrack />
          </Sequence>
          <Sequence from={F2_END} durationInFrames={F3_END - F2_END} name="Fitur 3 — Admin SOC & NVD">
            <SceneAdmin />
          </Sequence>
          <Sequence from={F3_END} durationInFrames={F4_END - F3_END} name="Fitur 4 — Advisory & Publikasi">
            <SceneAdvisory />
          </Sequence>
          <ActDip />
        </BrowserFrame>
      )}

      <Sequence from={0} durationInFrames={INTRO_END} name="Intro">
        <Intro />
      </Sequence>
      <Sequence from={INTRO_END} durationInFrames={F1_END - INTRO_END} name="Judul Fitur 1">
        <StageTitle
          index="01"
          title="Lapor Insiden & Temuan VDP"
          desc="Formulir pelaporan publik dengan nomor tiket unik & kerahasiaan TLP:RED — cakupan aset KCIC/Whoosh."
          duration={F1_END - INTRO_END}
        />
      </Sequence>
      <Sequence from={F1_END} durationInFrames={F2_END - F1_END} name="Judul Fitur 2">
        <StageTitle
          index="02"
          title="Lacak Tiket Real-Time"
          desc="Pantau kronologi penanganan OPEN → TRIAGED → INVESTIGASI, tersinkron otomatis oleh SOC KCIC."
          duration={F2_END - F1_END}
        />
      </Sequence>
      <Sequence from={F2_END} durationInFrames={F3_END - F2_END} name="Judul Fitur 3">
        <StageTitle
          index="03"
          title="Konsol Admin SOC & NVD"
          desc="Kendali threat level, ekspor laporan Excel manual, dan impor CVE NVD menjadi advisory publik."
          duration={F3_END - F2_END}
        />
      </Sequence>
      <Sequence from={F3_END} durationInFrames={F4_END - F3_END} name="Judul Fitur 4">
        <StageTitle
          index="04"
          title="Advisory & Publikasi Publik"
          desc="CVE terimpor dari NVD diterbitkan sebagai advisory TLP:CLEAR — peringatan dini & guidance konstituen."
          duration={F4_END - F3_END}
        />
      </Sequence>
      <Sequence from={F4_END} durationInFrames={TOTAL - F4_END} name="Outro & CTA">
        <Outro />
      </Sequence>
    </div>
  )
}