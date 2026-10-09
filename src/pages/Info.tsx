import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import SlideProgress from '../components/SlideProgress'
import { dur, step, ease } from '../motion'
import { infoPanels, site } from '../site'
import { clampStep, useShell } from '../store'
import { useStepGestures } from '../useStepGestures'

/** Bio and contact, stepped through like a project's slides. */
export default function Info() {
  const { infoPanel, setInfoPanel } = useShell()
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const navigate = useNavigate()

  const go = useCallback(
    (dir: 1 | -1) => {
      setInfoPanel(clampStep(infoPanel, dir, infoPanels.length))
    },
    [infoPanel, setInfoPanel],
  )

  useStepGestures(go)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  /**
   * The arriving panel washes in over the outgoing one (an elliptical
   * clip-path driven by `--wash`); its prose rises out of a mask, and
   * rows with links lift without one so focus rings aren't clipped.
   */
  const initialized = useRef(false)
  useLayoutEffect(() => {
    panelRefs.current.forEach((el, i) => {
      if (!el) return
      const active = i === infoPanel
      const risers = el.querySelectorAll<HTMLElement>('.info__rise')
      const lifts = el.querySelectorAll<HTMLElement>('.info__lift')

      if (!active) {
        // Stays visible until the incoming wash has covered it.
        gsap.to(el, {
          autoAlpha: 0,
          duration: dur(0.2),
          delay: dur(1.15),
          ease: 'none',
          overwrite: 'auto',
          onComplete: () => gsap.set(el, { '--wash': 0 }),
        })
        return
      }

      gsap.set(el, { zIndex: 1 })
      gsap.set(panelRefs.current.filter((p) => p && p !== el), { zIndex: 0 })

      gsap.set(el, { autoAlpha: 1 })
      gsap.fromTo(
        el,
        { '--wash': initialized.current ? 0 : 1 },
        {
          '--wash': 1,
          duration: dur(1.3),
          ease: ease.fade,
          overwrite: 'auto',
        },
      )
      gsap.fromTo(
        risers,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: dur(1.1),
          ease: ease.move,
          stagger: step(0.08),
          delay: step(initialized.current ? 0.12 : 0.25),
          overwrite: 'auto',
        },
      )
      gsap.fromTo(
        lifts,
        { y: 16, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: dur(0.9),
          ease: ease.move,
          stagger: step(0.08),
          delay: step(initialized.current ? 0.24 : 0.4),
          overwrite: 'auto',
        },
      )
    })
    initialized.current = true
  }, [infoPanel])

  return (
    <>
      <div className="info">
        {infoPanels.map((panel, i) => (
          <section
            key={panel.id}
            className="info__panel"
            // Scrolls on phones too short for the text.
            data-scrolls=""
            aria-label={panel.label}
            inert={i !== infoPanel}
            ref={(el) => {
              panelRefs.current[i] = el
            }}
          >
            <div className="info__frame">
              <div className="info__column">
                {panel.id === 'biography' ? <Biography /> : <Contact />}
              </div>
            </div>
          </section>
        ))}
      </div>
      <SlideProgress
        count={infoPanels.length}
        current={infoPanel}
        progress={null}
        onJump={setInfoPanel}
        onStep={go}
      />
    </>
  )
}

function Biography() {
  return (
    <>
      <p className="info__block info__lead">
        <span className="info__rise">{site.bio.lead}</span>
      </p>
      {site.bio.body.map((paragraph) => (
        <p className="info__block" key={paragraph.slice(0, 24)}>
          <span className="info__rise">{paragraph}</span>
        </p>
      ))}
    </>
  )
}

function Contact() {
  return (
    <>
      <p className="info__block info__lead">
        <span className="info__rise">{site.contact.lead}</span>
      </p>
      <dl className="info__rows">
        {site.contact.rows.map((row) => (
          <div className="info__row info__lift" key={row.label}>
            <dt className="info__row-label">{row.label}</dt>
            <dd className={'info__row-value' + (row.href ? '' : ' info__row-value--plain')}>
              {row.href ? (
                <a className="link" href={row.href}>
                  <span>{row.value}</span>
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </>
  )
}
