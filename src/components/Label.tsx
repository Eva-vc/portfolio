import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Page from './Page'
import { dur, ease } from '../motion'
import type { LabelValue } from '../reel'

/**
 * The fixed label beside the work. Every value is mounted at once (so
 * PDFs are pre-rendered) and changes crossfade. A PDF value switches the
 * box to `.label--image`, which fills the space left of the work.
 */
export default function Label({
  values,
  index,
}: {
  values: LabelValue[]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const shownSet = useRef('')

  useLayoutEffect(() => {
    const box = ref.current
    if (!box) return
    const set = values.map((v) => v.key).join('|')
    const fresh = set !== shownSet.current
    shownSet.current = set
    Array.from(box.children).forEach((slot, i) => {
      const current = i === index
      if (fresh) gsap.set(slot, { autoAlpha: 0 })
      gsap.to(slot, {
        autoAlpha: current ? 1 : 0,
        duration: dur(current ? 0.14 : 0.1),
        ease: ease.fade,
        overwrite: true,
      })
    })
  }, [values, index])

  return (
    /* Hidden from screen readers; the shell's live region announces the value. */
    <div
      ref={ref}
      className={'label' + (values[index]?.image ? ' label--image' : '')}
      aria-hidden="true"
    >
      {values.map((value, i) => (
        <div
          key={value.key}
          className={'label__slot' + (i === index ? ' label__slot--current' : '')}
        >
          {value.image ? (
            <Page className="label__image" src={value.image} alt="" transparent />
          ) : (
            <div className="label__text">
              <span className="label__title">
                {value.lines.map((line, n) => (
                  <span className="label__line" key={n}>
                    {line}
                  </span>
                ))}
              </span>
              <span className="label__meta">{value.meta}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
