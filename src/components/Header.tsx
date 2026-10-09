import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { dur, ease } from '../motion'

gsap.registerPlugin(ScrollToPlugin)

/**
 * The corner link reads "Back" inside a project; on the home page it
 * reads "Home" and scrolls back to the first work.
 */
export default function Header({ onInfo }: { onInfo: boolean }) {
  const { pathname } = useLocation()
  const onProject = pathname.startsWith('/projects/')
  const onHome = pathname === '/'

  const toTop = (e: React.MouseEvent) => {
    const gallery = document.querySelector<HTMLElement>('.gallery')
    if (!onHome || !gallery) return
    e.preventDefault()
    const distance = gallery.scrollTop / window.innerHeight
    gsap.to(gallery, {
      scrollTo: { y: 0, autoKill: true },
      duration: dur(Math.min(1.6, 0.6 + distance * 0.2)),
      ease: ease.move,
      overwrite: true,
    })
  }

  return (
    <header className="header">
      <h1 className="header__name">
        <Link className="link" to="/" onClick={toTop}>
          <span>{onProject ? 'Back' : 'Home'}</span>
        </Link>
      </h1>
      <nav className="header__nav" aria-label="Sections">
        <Link
          className={'link' + (onInfo ? '' : ' link--current')}
          to="/"
          aria-current={onInfo ? undefined : 'page'}
        >
          <span>Overview</span>
        </Link>
        <Link
          className={'link' + (onInfo ? ' link--current' : '')}
          to="/info"
          aria-current={onInfo ? 'page' : undefined}
        >
          <span>Bio</span>
        </Link>
      </nav>
    </header>
  )
}
