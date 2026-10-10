import { useLayoutEffect } from 'react'

/**
 * Publishes the current work's size as CSS variables the label is laid
 * out against: `--work-width` (portrait pages only) for the text label,
 * `--frame-width` / `--frame-height` for a PDF label. A project passes
 * its first page as `frameElement` so the PDF label holds still;
 * `--page-width` is the current page's own width, which the PDF label
 * steps clear of when that page is wider than the first.
 *
 * Uses offsetWidth/Height rather than bounding rects, which include the
 * transforms the slides are animated with.
 */
export function useWorkFrame(
  element: HTMLElement | null | undefined,
  frameElement: HTMLElement | null | undefined = element,
) {
  useLayoutEffect(() => {
    if (!frameElement) return

    const publish = () => {
      if (frameElement.offsetWidth < 1) return
      const root = document.documentElement.style
      root.setProperty('--frame-width', `${Math.round(frameElement.offsetWidth)}px`)
      root.setProperty('--frame-height', `${Math.round(frameElement.offsetHeight)}px`)
    }

    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(frameElement)
    window.addEventListener('resize', publish)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', publish)
    }
  }, [frameElement])

  useLayoutEffect(() => {
    if (!element) return

    const publish = () => {
      const root = document.documentElement.style
      const width = element.offsetWidth
      if (width < 1) return
      root.setProperty('--page-width', `${Math.round(width)}px`)
      // Landscape pages keep the last portrait value.
      if (element.dataset.orientation === 'landscape') return
      root.setProperty('--work-width', `${Math.round(width)}px`)
    }

    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(element)
    window.addEventListener('resize', publish)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', publish)
    }
  }, [element])
}
