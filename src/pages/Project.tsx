import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import Expanded from '../components/Expanded'
import Page, { PAGE_READY } from '../components/Page'
import SlideProgress from '../components/SlideProgress'
import { artworks } from '../artworks'
import { dur, ease } from '../motion'
import { assetUrl, isPdf } from '../pdf'
import { clampStep, useShell } from '../store'
import { useStepGestures } from '../useStepGestures'
import { useWorkFrame } from '../useWorkFrame'

/**
 * How far right of the pile page `i` sits at a (possibly fractional)
 * position. `stops[i]` is page i's centre in a flat row; pages the
 * position has passed read 0 (landed).
 */
function offsetAhead(stops: number[], i: number, position: number) {
  const last = stops.length - 1
  const p = Math.min(Math.max(position, 0), last)
  const lo = Math.floor(p)
  const hi = Math.min(lo + 1, last)
  const reached = stops[lo] + (stops[hi] - stops[lo]) * (p - lo)
  return Math.max(stops[i] - reached, 0)
}

/**
 * A project: its pages wait in a row to the right, one gap apart, and
 * each slides left onto the pile when its turn comes. Everything is
 * derived from a single animated `position`, so rapid steps simply
 * retarget it; the progress bar can scrub it fractionally.
 */
export default function Project({ artworkIndex }: { artworkIndex: number }) {
  const artwork = artworks[artworkIndex]
  const navigate = useNavigate()
  const { setArtworkIndex, slideIndex, setSlideIndex } = useShell()
  const [scrub, setScrub] = useState<number | null>(null)
  // The open full-screen picture, if any.
  const [open, setOpen] = useState<{ index: number; closing: boolean } | null>(null)
  const closeExpanded = useCallback(
    () => setOpen((o) => (o && !o.closing ? { ...o, closing: true } : o)),
    [],
  )
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const count = artwork.slides.length

  // The text label follows the current page; a PDF label stays aligned
  // to the first page so it doesn't move during the project.
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  const [firstPage, setFirstPage] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setFrame(slideRefs.current[slideIndex]?.querySelector<HTMLElement>('.slide__image') ?? null)
  }, [slideIndex, artworkIndex])

  useEffect(() => {
    setFirstPage(slideRefs.current[0]?.querySelector<HTMLElement>('.slide__image') ?? null)
  }, [artworkIndex])

  useWorkFrame(frame, firstPage)

  const viewerRef = useRef<HTMLDivElement>(null)
  const stopsRef = useRef<number[]>([])
  const positionRef = useRef({ value: slideIndex })
  // 0 = all pages stacked on the first, 1 = laid out (opening animation).
  const spreadRef = useRef({ value: 0 })

  /** Write every page's offset for the current position. */
  const apply = useCallback(() => {
    const stops = stopsRef.current
    if (!stops.length) return
    const position = positionRef.current.value
    // Hide pages beneath the highest landed opaque page.
    let floor = 0
    artwork.slides.forEach((slide, i) => {
      if (i <= position && !slide.seeThrough) floor = i
    })
    // Rounded to device pixels to keep pages at rest sharp.
    const dpr = window.devicePixelRatio || 1
    const spread = spreadRef.current.value
    slideRefs.current.forEach((el, i) => {
      if (!el) return
      const x = Math.round(offsetAhead(stops, i, position) * spread * dpr) / dpr
      el.style.setProperty('--x', `${x}px`)
      el.style.visibility = i < floor ? 'hidden' : ''
    })
  }, [artwork])

  // Page centres in a flat row, one `--page-gap` apart (read in px via
  // the viewer's column-gap). Layout widths ignore animation transforms.
  // A wide page rests off-centre to clear the label (its CSS `translate`),
  // so its stop is moved by the same amount to keep the gaps even.
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const measure = () => {
      const gap = parseFloat(getComputedStyle(viewer).columnGap) || 0
      const images = slideRefs.current.map(
        (el) => el?.querySelector<HTMLElement>('.slide__image') ?? null,
      )
      const widths = images.map((img) => img?.offsetWidth ?? 0)
      const shifts = images.map((img) => (img && parseFloat(getComputedStyle(img).translate)) || 0)
      const stops: number[] = []
      widths.forEach((w, i) => {
        stops.push(
          i === 0
            ? 0
            : stops[i - 1] + widths[i - 1] / 2 + gap + w / 2 + shifts[i - 1] - shifts[i],
        )
      })
      stopsRef.current = stops
      apply()
    }

    // Measured again a frame later: the shift depends on the label's
    // frame variables, which are published after this observer runs.
    let frame = 0
    const remeasure = () => {
      measure()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    remeasure()
    const observer = new ResizeObserver(remeasure)
    slideRefs.current.forEach((el) => {
      const img = el?.querySelector('.slide__image')
      if (img) observer.observe(img)
    })
    window.addEventListener('resize', remeasure)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', remeasure)
    }
  }, [artworkIndex, count, apply])

  useEffect(() => {
    setArtworkIndex(artworkIndex)
  }, [artworkIndex, setArtworkIndex])

  /** Move the row to one (possibly fractional) position. */
  const place = useCallback(
    (position: number, animate: boolean) => {
      if (animate) {
        gsap.to(positionRef.current, {
          value: position,
          duration: dur(0.8),
          ease: ease.move,
          overwrite: true,
          onUpdate: apply,
        })
      } else {
        gsap.killTweensOf(positionRef.current)
        positionRef.current.value = position
        apply()
      }
    },
    [apply],
  )

  const entered = useRef(false)
  useLayoutEffect(() => {
    place(slideIndex, entered.current)
    entered.current = true
  }, [slideIndex, place])

  // Opening: the pages fan out from a stack once the first page is
  // showing (or after 600ms).
  useEffect(() => {
    const viewer = viewerRef.current
    const first = slideRefs.current[0]
    if (!viewer || !first) return

    let started = false
    const deal = () => {
      if (started) return
      started = true
      gsap.to(spreadRef.current, {
        value: 1,
        duration: dur(0.85),
        ease: ease.move,
        onUpdate: apply,
        onComplete: apply,
      })
    }

    const image = first.querySelector<HTMLElement>('.slide__image')
    const ready =
      image instanceof HTMLImageElement
        ? image.complete && image.naturalWidth > 0
        : image?.dataset.ready !== undefined
    const onReady = (e: Event) => {
      if (first.contains(e.target as Node)) deal()
    }
    viewer.addEventListener(PAGE_READY, onReady)
    viewer.addEventListener('load', onReady, true)
    const fallback = window.setTimeout(deal, 600)
    if (ready) deal()

    return () => {
      viewer.removeEventListener(PAGE_READY, onReady)
      viewer.removeEventListener('load', onReady, true)
      window.clearTimeout(fallback)
      gsap.killTweensOf(spreadRef.current)
    }
  }, [apply])

  // Reset on leave so the next project opens on its first page.
  useEffect(() => () => setSlideIndex(0), [setSlideIndex])

  // Only the current slide is interactive.
  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (el) el.inert = i !== slideIndex
    })
  }, [slideIndex, count])

  // Preload the next image (PDFs already load on mount).
  useEffect(() => {
    const next = artwork.slides[slideIndex + 1]
    if (next && !isPdf(next.src)) new Image().src = assetUrl(next.src)
  }, [artwork, slideIndex])

  // While a picture is open, a step closes it instead.
  const step = useCallback(
    (dir: 1 | -1) => {
      if (open) closeExpanded()
      else setSlideIndex(clampStep(slideIndex, dir, count))
    },
    [open, closeExpanded, slideIndex, count, setSlideIndex],
  )

  useStepGestures(step)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (open) closeExpanded()
      else navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, open, closeExpanded])

  const expandedSlide = open ? artwork.slides[open.index] : null
  const expandedOrigin = open
    ? slideRefs.current[open.index]?.querySelector<HTMLElement>('.slide__image')
    : null

  return (
    <>
      <div className="viewer" ref={viewerRef}>
        {artwork.slides.map((slide, i) => (
          <article
            key={slide.src}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className={'slide' + (slide.seeThrough ? ' slide--seethrough' : '')}
            style={{ zIndex: i + 1 }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            {slide.fullscreen ? (
              <button
                type="button"
                className="slide__expand"
                aria-label={`View page ${i + 1} full screen`}
                aria-haspopup="dialog"
                // Ignore clicks while an overlay is still closing.
                onClick={() => setOpen((o) => o ?? { index: i, closing: false })}
              >
                <Page
                  className="slide__image"
                  src={slide.src}
                  alt=""
                  transparent={slide.seeThrough}
                  film={slide.seeThrough}
                />
              </button>
            ) : (
              <Page
                className="slide__image"
                src={slide.src}
                alt={`${artwork.title.join(' ')}, page ${i + 1} of ${count}`}
                transparent={slide.seeThrough}
                film={slide.seeThrough}
              />
            )}
          </article>
        ))}
      </div>

      {open && expandedSlide && expandedOrigin && (
        <Expanded
          key={open.index}
          origin={expandedOrigin}
          src={expandedSlide.src}
          alt={`${artwork.title.join(' ')}, page ${open.index + 1} of ${count}, full screen`}
          transparent={expandedSlide.seeThrough}
          closing={open.closing}
          onRequestClose={closeExpanded}
          onClosed={() => {
            setOpen(null)
            expandedOrigin.closest<HTMLElement>('.slide__expand')?.focus({ preventScroll: true })
          }}
        />
      )}

      <SlideProgress
        count={count}
        current={slideIndex}
        progress={scrub}
        onJump={setSlideIndex}
        onStep={step}
        onScrub={(p) => {
          setScrub(p)
          place(p, false)
        }}
        onScrubEnd={(p) => {
          const landed = Math.round(p)
          setScrub(null)
          setSlideIndex(landed)
          // Settle explicitly: the index may not have changed.
          place(landed, true)
        }}
      />
    </>
  )
}
