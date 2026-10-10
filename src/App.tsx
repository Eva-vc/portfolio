import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { artworks } from './artworks'
import { homeLabels, infoLabels, projectLabels } from './reel'
import { ShellContext, useShell } from './store'
import Header from './components/Header'
import Label from './components/Label'
import Home from './pages/Home'
import Info from './pages/Info'
import Project from './pages/Project'

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}

/**
 * The persistent shell: header and fixed label stay mounted across
 * routes, and the shell owns the indices that drive both.
 */
function Shell() {
  const location = useLocation()
  const [artworkIndex, setArtworkIndex] = useState(() => {
    const slug = location.pathname.match(/^\/projects\/(.+)$/)?.[1]
    const i = artworks.findIndex((a) => a.slug === slug)
    return i === -1 ? 0 : i
  })
  const [slideIndex, setSlideIndex] = useState(0)
  const [infoPanel, setInfoPanel] = useState(0)

  const onInfo = location.pathname.startsWith('/info')
  const onProject = location.pathname.startsWith('/projects/')

  const label = useMemo(() => {
    if (onInfo) {
      const values = infoLabels()
      return { values, index: Math.min(infoPanel, values.length - 1) }
    }
    if (onProject) {
      const { values, indexOfSlide } = projectLabels(artworks[artworkIndex])
      return { values, index: indexOfSlide[slideIndex] ?? 0 }
    }
    return { values: homeLabels(), index: artworkIndex }
  }, [onInfo, onProject, infoPanel, artworkIndex, slideIndex])

  const current = label.values[label.index]

  // Announced to screen readers, since content changes without navigation.
  const announcement = !current
    ? ''
    : onProject
      ? `${current.lines.join(' ')}. Slide ${slideIndex + 1} of ${artworks[artworkIndex].slides.length}.`
      : onInfo
        ? current.meta
        : `${current.lines.join(' ')}, ${current.meta}. Work ${artworkIndex + 1} of ${artworks.length}.`

  return (
    <ShellContext.Provider
      value={{
        artworkIndex,
        setArtworkIndex,
        slideIndex,
        setSlideIndex,
        infoPanel,
        setInfoPanel,
      }}
    >
      <div className={'app' + (onInfo ? ' app--info' : '') + (onProject ? ' app--project' : '')}>
        <Header onInfo={onInfo} />
        <Label values={label.values} index={label.index} />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectRoute />} />
            <Route path="/info" element={<Info />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      </div>
    </ShellContext.Provider>
  )
}

function ProjectRoute() {
  const { slug } = useParams()
  const { setSlideIndex } = useShell()
  const index = artworks.findIndex((a) => a.slug === slug)

  useEffect(() => {
    setSlideIndex(0)
  }, [slug, setSlideIndex])

  if (index === -1) return <Navigate to="/" replace />
  // Keyed so each project mounts fresh and plays its opening animation.
  return <Project key={slug} artworkIndex={index} />
}
