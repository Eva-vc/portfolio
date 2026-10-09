import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { dur, ease } from '../motion'
import type { RenderTask } from 'pdfjs-dist'
import { assetUrl, getPage, isPdf, renderHeight } from '../pdf'

/** Exposes a page's proportion to CSS as `--ratio` and `data-orientation`. */
function measure(element: HTMLElement, width: number, height: number) {
  if (!width || !height) return
  element.style.setProperty('--ratio', String(width / height))
  element.dataset.orientation = width > height ? 'landscape' : 'portrait'
}

/**
 * One page of artwork: an `<img>`, or a PDF page drawn to a canvas.
 * `transparent` drops a PDF's white page; `film` additionally renders
 * it as ink on clear film (see `printOnFilm`).
 */
export default function Page({
  src,
  className,
  alt,
  transparent = false,
  film = false,
}: {
  src: string
  className?: string
  alt: string
  transparent?: boolean
  film?: boolean
}) {
  src = assetUrl(src)
  if (!isPdf(src)) {
    return (
      <img
        className={className}
        src={src}
        alt={alt}
        draggable={false}
        onLoad={(e) => {
          const img = e.currentTarget
          measure(img, img.naturalWidth, img.naturalHeight)
        }}
      />
    )
  }
  return (
    <PdfPage
      src={src}
      className={className}
      alt={alt}
      transparent={transparent}
      film={transparent && film}
    />
  )
}

/**
 * Renders a page as if printed on clear film, where white is no ink:
 * a "colour to alpha" of white. White becomes transparent, pale tints
 * partly transparent, dark and saturated colour stay opaque.
 */
function printOnFilm(context: CanvasRenderingContext2D, width: number, height: number) {
  const image = context.getImageData(0, 0, width, height)
  const d = image.data
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3]
    if (a === 0) continue
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]
    const ink = 255 - Math.min(r, g, b)
    if (ink === 0) {
      d[i + 3] = 0
      continue
    }
    const k = 255 / ink
    d[i] = 255 - (255 - r) * k
    d[i + 1] = 255 - (255 - g) * k
    d[i + 2] = 255 - (255 - b) * k
    d[i + 3] = (a * ink) / 255
  }
  context.putImageData(image, 0, 0)
}

/** PDFs render at 2× their shown size and are scaled down by the browser. */
const OVERSAMPLE = 2

/** Recent finished renders, reused when the same page is shown again. */
const renders = new Map<string, HTMLCanvasElement>()
const RENDERS_KEPT = 24

function keep(key: string, render: HTMLCanvasElement) {
  renders.delete(key)
  renders.set(key, render)
  if (renders.size > RENDERS_KEPT) renders.delete(renders.keys().next().value!)
}

/** Fired on a page's element once it is showing its artwork. */
export const PAGE_READY = 'pageready'

function PdfPage({
  src,
  className,
  alt,
  transparent,
  film,
}: {
  src: string
  className?: string
  alt: string
  transparent: boolean
  film: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let task: RenderTask | null = null
    let drawn = 0
    const key = `${src}|${transparent ? 't' : ''}${film ? 'f' : ''}`

    // offsetHeight ignores transforms on a page mid-animation.
    const wanted = () => renderHeight(canvas.offsetHeight * OVERSAMPLE)

    // Renders happen offscreen and are copied in whole (pdf.js paints
    // progressively); new renders fade in, cached ones appear at once.
    const show = (render: HTMLCanvasElement, fresh: boolean) => {
      measure(canvas, render.width, render.height)
      canvas.width = render.width
      canvas.height = render.height
      canvas.getContext('2d', { alpha: transparent })?.drawImage(render, 0, 0)
      drawn = render.height
      if (fresh) {
        gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: dur(0.4), ease: ease.fade })
      }
      // Also marked, for listeners attached after the event fired.
      canvas.dataset.ready = ''
      canvas.dispatchEvent(new Event(PAGE_READY, { bubbles: true }))
    }

    const draw = async () => {
      try {
        const cached = renders.get(key)
        if (cached && cached.height >= wanted() * 0.9) {
          keep(key, cached)
          show(cached, false)
          return
        }

        const page = await getPage(src)
        if (cancelled) return

        const base = page.getViewport({ scale: 1 })
        measure(canvas, base.width, base.height)
        const viewport = page.getViewport({ scale: wanted() / base.height })

        const render = document.createElement('canvas')
        render.width = Math.round(viewport.width)
        render.height = Math.round(viewport.height)

        // A transparent render needs both a transparent `background`
        // and our own `alpha: true` context: pdf.js creates an opaque
        // one when given a canvas.
        const context = render.getContext('2d', { alpha: transparent })
        if (!context) throw new Error('no 2d context')
        task = page.render({
          canvas: null,
          canvasContext: context,
          viewport,
          background: transparent ? 'rgba(0,0,0,0)' : '#ffffff',
        })
        await task.promise
        if (film) printOnFilm(context, render.width, render.height)
        keep(key, render)
        if (!cancelled) show(render, drawn === 0)
      } catch (error) {
        // Cancellation is expected when the page is replaced.
        if (cancelled || (error as { name?: string })?.name === 'RenderingCancelledException') return
        setFailed(true)
      }
    }

    void draw()

    // Redraw only when the window grows past what the render covers.
    let timer = 0
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (wanted() <= drawn * 1.1) return
        task?.cancel()
        void draw()
      }, 250)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      task?.cancel()
    }
  }, [src, transparent, film])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={failed ? `${alt} — could not be displayed` : alt}
      // A4 placeholder proportion until the real one is known.
      width={1000}
      height={1414}
    />
  )
}
