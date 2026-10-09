import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

/** pdf.js, loaded on first use. */

let lib: Promise<typeof import('pdfjs-dist')> | null = null

function pdfjs() {
  if (!lib) {
    lib = import('pdfjs-dist').then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = workerUrl
      return mod
    })
  }
  return lib
}

/** Parsed documents, one per file. */
const documents = new Map<string, Promise<PDFDocumentProxy>>()

/**
 * Normalises a manifest path to its served URL. `public/` is served at
 * the site root, so `a.pdf`, `/a.pdf`, `public/a.pdf` and `/public/a.pdf`
 * all resolve to `/a.pdf`. Full URLs pass through.
 */
export function assetUrl(src: string) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return src
  const path = src.replace(/^(?:\.?\/)+/, '').replace(/^public\//, '')
  return import.meta.env.BASE_URL + path
}

export const isPdf = (src: string) => /\.pdf(?:$|[?#])/i.test(src)

/** `work.pdf#page=3` addresses one page of a multi-page PDF. */
export function parseSource(src: string): { url: string; page: number } {
  const [url, hash = ''] = src.split('#')
  const match = /(?:^|&)page=(\d+)/.exec(hash)
  return { url, page: match ? Math.max(1, Number(match[1])) : 1 }
}

function open(url: string) {
  let doc = documents.get(url)
  if (!doc) {
    doc = pdfjs().then((mod) => mod.getDocument({ url }).promise)
    documents.set(url, doc)
    // Don't cache failures.
    doc.catch(() => documents.delete(url))
  }
  return doc
}

export async function getPage(src: string): Promise<PDFPageProxy> {
  const { url, page } = parseSource(src)
  const doc = await open(url)
  return doc.getPage(Math.min(page, doc.numPages))
}

/** Device-pixel height to render at for a given CSS height, capped. */
export function renderHeight(cssHeight: number) {
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
  const height = cssHeight > 0 ? cssHeight : 900
  return Math.min(Math.round(height * dpr), 3000)
}
