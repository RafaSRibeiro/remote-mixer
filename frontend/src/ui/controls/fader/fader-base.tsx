import { css } from '@linaria/core'
import { ReactNode, useRef } from 'react'
import { ensureBetween } from '@remote-mixer/utils'

import { Touchable } from '../../components/touchable'
import { getTouchEventOffset } from '../../../util/touch'
import { cx } from '../../../util/styles'
import { baseline, iconShade, baselinePx, textShade } from '../../styles'

export const faderWidth = baselinePx * 12
export const faderHeight = baselinePx * 60
export const trackWidth = (baselinePx * 12) / 3
export const trackHeight = faderHeight - faderWidth
export const trackMargin = (faderWidth - trackWidth) / 2
export const trackOffset = (faderHeight - trackHeight) / 2

const faderBase = css`
  position: relative;
  transform: translate3d(0, 0, 0);
  flex: 0 0 auto;
  width: ${faderWidth}px;
  height: ${faderHeight}px;
  margin: ${baseline(1.5)};
`

const track = css`
  margin-top: ${trackOffset}px;
  margin-left: ${trackMargin}px;
  background: linear-gradient(to top, #0f0, #ff0, #f00);
  width: ${trackWidth}px;
  height: ${trackHeight}px;
`

const meterTrack = css`
  background: ${iconShade(2)};
  height: ${trackHeight}px;
  will-change: transform;
  transform-origin: top;
  transition: transform 0.1s ease-out;
`

const minusTwelveDbMark = css`
  position: absolute;
  top: calc(${trackOffset}px + ${trackHeight}px * (1 - 788 / 1023) - 1px);
  left: ${trackMargin - 4}px;
  width: calc(${trackWidth}px + 8px);
  height: 2px;
  background: ${iconShade(1)};
  pointer-events: none;
  color: ${textShade(1)};
  font-size: 12px;
  line-height: 0;
`

export interface FaderBaseProps {
  className?: string
  onTouch?: (fraction: number) => void
  onUp?: () => void
  children?: ReactNode
  meterRef?: React.RefObject<HTMLDivElement | null>
}

export function FaderBase({
  className,
  onTouch,
  onUp,
  children,
  meterRef,
}: FaderBaseProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <Touchable
      className={cx(faderBase, className)}
      onTouch={event => {
        const offset = getTouchEventOffset(event, trackRef)
        if (!offset) {
          return
        }
        const fraction = ensureBetween(1 - offset.yFraction, 0, 1)
        onTouch?.(fraction)
      }}
      onUp={onUp}
    >
      {children}
      <div className={track} ref={trackRef}>
        {meterRef && <div className={meterTrack} ref={meterRef} />}
        <div className={minusTwelveDbMark}>
          <div style={{ position: 'absolute', left: '100%', marginLeft: 4 }}>
            -12
          </div>
        </div>
      </div>
    </Touchable>
  )
}
