import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import Page from './Page'
import { dur, ease } from '../motion'

/** The largest box of a given proportion that fits the screen whole. */
function fit(ratio: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const width = Math.round(Math.min(vw, vh * ratio))
  const height = Math.round(width / ratio)
  return {
    left: Math.round((vw - width) / 2),
    top: Math.round((vh - height) / 2),
    width,
    height,
  }
}

/**
 * A `fullscreen` slide opened to fill the screen (uncropped). The frame
 * is laid out at full size and animated from the page's position with a
 * FLIP transform; closing reverses it. The page in the row is hidden
 * while open.
 */
export default function Expanded({
  origin,
  src,
  alt,
  transparent,
  closing,
  onClosed,
  onRequestClose,
}: {
  origin: HTMLElement
  src: string
  alt: string
  transparent?: boolean
  closing: boolean
  onClosed: () => void
  onRequestClose: () => void
}) {
  const groundRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const standinRef = useRef<HTMLCanvasElement>(null)
  const openingRef = useRef<gsap.core.Timeline | null>(null)

  // Proportion from layout size; position from the bounding rect.
  const ratio = origin.offsetWidth / Math.max(origin.offsetHeight, 1)

  const fromOrigin = () => {
    const target = fit(ratio)
    const from = origin.getBoundingClientRect()
    return {
      x: from.left - target.left,
      y: from.top - target.top,
      scale: from.width / target.width,
    }
  }

  const place = () => {
    const frame = frameRef.current
    if (!frame) return
    const { left, top, width, height } = fit(ratio)
    Object.assign(frame.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    })

    // Close sits in the header corner if there's room above the
    // picture, otherwise inside the picture's corner.
    const close = closeRef.current
    if (!close) return
    close.style.top = close.style.right = ''
    const rest = getComputedStyle(close)
    const chrome = parseFloat(rest.top)
    if (top >= chrome + close.offsetHeight + chrome / 2) return
    close.style.top = `${top + chrome / 2}px`
    close.style.right = `${window.innerWidth - (left + width) + chrome / 2}px`
  }

  // Open (in a layout effect so the first frame is already over the page).
  useLayoutEffect(() => {
    const frame = frameRef.current
    const ground = groundRef.current
    if (!frame || !ground) return

    place()

    // Show the row's render underneath until the full-size one is ready.
    const standin = standinRef.current
    if (standin && origin instanceof HTMLCanvasElement) {
      standin.width = origin.width
      standin.height = origin.height
      standin.getContext('2d')?.drawImage(origin, 0, 0)
    }

    origin.style.visibility = 'hidden'

    const tl = gsap.timeline()
    openingRef.current = tl
    tl.fromTo(
      frame,
      { ...fromOrigin(), transformOrigin: '0 0' },
      { x: 0, y: 0, scale: 1, duration: dur(0.9), ease: ease.move },
      0,
    )
    tl.fromTo(ground, { opacity: 0 }, { opacity: 1, duration: dur(0.6), ease: ease.fade }, 0)
    tl.fromTo(
      closeRef.current,
      { opacity: 0 },
      { opacity: 1, duration: dur(0.4), ease: ease.fade },
      dur(0.6),
    )

    closeRef.current?.focus({ preventScroll: true })

    return () => {
      tl.kill()
      origin.style.visibility = ''
    }
  }, [])

  // Close: animate back to the page's current position.
  useEffect(() => {
    if (!closing) return
    const frame = frameRef.current
    const ground = groundRef.current
    if (!frame || !ground) return

    openingRef.current?.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        origin.style.visibility = ''
        onClosed()
      },
    })
    tl.to(closeRef.current, { opacity: 0, duration: dur(0.2), ease: ease.fade }, 0)
    tl.to(frame, { ...fromOrigin(), duration: dur(0.8), ease: ease.move }, 0)
    tl.to(ground, { opacity: 0, duration: dur(0.5), ease: ease.fade }, dur(0.3))
    return () => {
      tl.kill()
    }
  }, [closing])

  useEffect(() => {
    const onResize = () => {
      if (!closing) place()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [closing])

  return createPortal(
    <div
      className={
        'expand' + (closing ? ' expand--closing' : '') + (transparent ? ' expand--seethrough' : '')
      }
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onRequestClose}
      // Keep focus on the only control.
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          e.preventDefault()
          closeRef.current?.focus()
        }
      }}
    >
      <div className="expand__ground" ref={groundRef} />
      <div className="expand__frame" ref={frameRef}>
        {origin instanceof HTMLCanvasElement && (
          <canvas className="expand__standin" ref={standinRef} aria-hidden="true" />
        )}
        <Page
          className="expand__image"
          src={src}
          alt={alt}
          transparent={transparent}
          film={transparent}
        />
      </div>
      <button
        type="button"
        className="link expand__close"
        ref={closeRef}
        onClick={(e) => {
          e.stopPropagation()
          onRequestClose()
        }}
      >
        <span>Close</span>
      </button>
    </div>,
    document.body,
  )
}
