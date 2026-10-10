import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Page from '../components/Page'
import { artworks } from '../artworks'
import { prefersReducedMotion } from '../motion'
import { useShell } from '../store'
import { useWorkFrame } from '../useWorkFrame'

/**
 * Home: a vertical scroll of works, one per screen. The work crossing
 * the vertical centre is the active one.
 */
export default function Home() {
  const { artworkIndex, setArtworkIndex } = useShell()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const workRefs = useRef<(HTMLElement | null)[]>([])
  const [frame, setFrame] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setFrame(workRefs.current[artworkIndex]?.querySelector<HTMLElement>('.work__image') ?? null)
  }, [artworkIndex])

  useWorkFrame(frame)

  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setArtworkIndex(Number((entry.target as HTMLElement).dataset.index))
        })
      },
      // A zero-height band across the middle of the scroller.
      { root, rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    workRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [setArtworkIndex])

  // Return to the last-viewed work without animating.
  const restored = useRef(false)
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    workRefs.current[artworkIndex]?.scrollIntoView({ block: 'center' })
  }, [artworkIndex])

  const scrollToWork = useCallback((i: number) => {
    const target = workRefs.current[i]
    if (!target) return
    target.scrollIntoView({
      block: 'center',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
      if (!dir) return
      const next = Math.min(Math.max(artworkIndex + dir, 0), artworks.length - 1)
      if (next === artworkIndex) return
      e.preventDefault()
      scrollToWork(next)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [artworkIndex, scrollToWork])

  return (
    <div className="gallery" ref={scrollerRef}>
      <div className="gallery__run">
        {artworks.map((artwork, i) => (
          <article
            key={artwork.slug}
            className={'work' + (artwork.slides[0].seeThrough ? ' work--seethrough' : '')}
            data-index={i}
            ref={(el) => {
              workRefs.current[i] = el
            }}
          >
            <Link
              className="work__link"
              to={`/projects/${artwork.slug}`}
              aria-label={`Open ${artwork.title.join(' ')}, ${artwork.meta}`}
            >
              <Page
                className="work__image"
                src={artwork.slides[0].src}
                alt={artwork.title.join(' ')}
                transparent={artwork.slides[0].seeThrough}
                film={artwork.slides[0].seeThrough}
              />
              {/* Whichever work is first in the run carries the hint. */}
              {i === 0 && (
                <span className="work__hint" aria-hidden="true">
                  <svg className="work__hint-arrow" viewBox="0 0 22 9" fill="none">
                    <path d="M22 4.5H1M4.5 1 1 4.5 4.5 8" stroke="currentColor" />
                  </svg>
                  Click me
                </span>
              )}
            </Link>
          </article>
        ))}
      </div>

      <p className="counter" aria-hidden="true">
        {String(artworkIndex + 1).padStart(2, '0')}
        <span className="counter__rule" />
        {String(artworks.length).padStart(2, '0')}
      </p>
    </div>
  )
}
