import { Composition } from 'remotion'
import DemoVideo from './DemoVideo'
import { FPS, STAGE_H, STAGE_W, TOTAL } from './theme'

export function RemotionRoot() {
  return (
    <Composition
      id="DemoVideo"
      component={DemoVideo}
      durationInFrames={TOTAL}
      fps={FPS}
      width={STAGE_W}
      height={STAGE_H}
    />
  )
}