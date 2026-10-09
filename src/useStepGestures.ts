import { useEffect, useRef } from 'react'

/** True when a vertical gesture should scroll a `[data-scrolls]` element that overflows. */
function scrollsItself(target: EventTarget | null) {
  const el = (target as Element | null)?.closest?.<HTMLElement>('[data-scrolls]')
  return !!el && el.scrollHeight > el.clientHeight + 1
}

/**
 * Wheel, swipe and arrow keys, each resolved to a single step. A wheel
 * gesture (including a trackpad's inertia tail) lasts until a 250ms gap
 * and steps at most once.
 */
export function useStepGestures(step: (dir: 1 | -1) => void) {
  const stepRef = useRef(step)
  stepRef.current = step

  useEffect(() => {
    let lastEvent = 0
    let lastStep = 0
    let acc = 0
    let consumed = false

    const onWheel = (e: WheelEvent) => {
      const now = performance.now()
      const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX)
      if (vertical && scrollsItself(e.target)) return
      const delta = vertical ? e.deltaY : e.deltaX

      if (now - lastEvent > 250) {
        acc = 0
        consumed = false
      }
      lastEvent = now

      if (consumed) return
      if (Math.abs(delta) < 4) return

      acc += delta
      if (Math.abs(acc) >= 40 && now - lastStep > 500) {
        consumed = true
        lastStep = now
        stepRef.current(acc > 0 ? 1 : -1)
      }
    }

    // Swipe: dominant axis wins; left or up advances.
    let startX = 0
    let startY = 0
    let tracking = false
    let target: EventTarget | null = null

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        tracking = false
        return
      }
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      target = e.target
      tracking = true
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return
      tracking = false
      const touch = e.changedTouches[0]
      if (!touch) return
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      const vertical = Math.abs(dy) > Math.abs(dx)
      if (vertical && scrollsItself(target)) return
      const delta = vertical ? dy : dx
      if (Math.abs(delta) < 45) return
      stepRef.current(delta < 0 ? 1 : -1)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        stepRef.current(1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        stepRef.current(-1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
}
