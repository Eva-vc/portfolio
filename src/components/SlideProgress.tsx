import { useCallback, useRef } from 'react'

/**
 * Bottom bar: counter, one segment per slide (click to jump, drag to
 * scrub a fractional position), and Prev/Next.
 */
export default function SlideProgress({
  count,
  current,
  progress,
  onJump,
  onScrub,
  onScrubEnd,
  onStep,
}: {
  count: number
  current: number
  /** Fractional position while dragging, or null when at rest. */
  progress: number | null
  onJump: (i: number) => void
  onScrub?: (p: number) => void
  onScrubEnd?: (p: number) => void
  onStep: (dir: 1 | -1) => void
}) {
  const stripRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  // Offset by half a segment so the middle of segment k reads as k.
  const positionFrom = useCallback(
    (clientX: number) => {
      const strip = stripRef.current
      if (!strip) return 0
      const box = strip.getBoundingClientRect()
      const fraction = (clientX - box.left) / box.width
      return Math.min(Math.max(fraction * count - 0.5, 0), count - 1)
    },
    [count],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !onScrub) return
    dragging.current = true
    stripRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !onScrub) return
    e.preventDefault()
    onScrub(positionFrom(e.clientX))
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    stripRef.current?.releasePointerCapture(e.pointerId)
    onScrubEnd?.(positionFrom(e.clientX))
  }

  const fillOf = (i: number) => {
    if (progress === null) return i <= current ? 1 : 0
    return Math.min(Math.max(progress - i + 1, 0), 1)
  }

  return (
    <div className="bar">
      <p className="counter counter--bar" aria-hidden="true">
        {String(current + 1).padStart(2, '0')}
        <span className="counter__rule" />
        {String(count).padStart(2, '0')}
      </p>

      <div
        className={
          'bar__strip' +
          (onScrub ? ' bar__strip--scrub' : '') +
          (progress !== null ? ' bar__strip--dragging' : '')
        }
        ref={stripRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            className="bar__segment"
            onClick={() => onJump(i)}
            aria-label={`Slide ${i + 1} of ${count}`}
            aria-current={i === current ? 'true' : undefined}
          >
            <span className="bar__track">
              <span className="bar__fill" style={{ transform: `scaleX(${fillOf(i)})` }} />
            </span>
          </button>
        ))}
      </div>

      <div className="bar__steps">
        <button className="link" onClick={() => onStep(-1)} disabled={current === 0}>
          <span>Prev</span>
        </button>
        <button className="link" onClick={() => onStep(1)} disabled={current === count - 1}>
          <span>Next</span>
        </button>
      </div>
    </div>
  )
}
