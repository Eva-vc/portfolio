/**
 * Motion settings. With `prefers-reduced-motion`, durations collapse to
 * zero: GSAP still writes every final value, so nothing is left
 * half-animated.
 */

const query =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

let reduced = query?.matches ?? false

query?.addEventListener('change', (event) => {
  reduced = event.matches
})

export const prefersReducedMotion = () => reduced

/** Shared GSAP eases; CSS mirrors them as `--ease-move` / `--ease-fade`. */
export const ease = {
  move: 'power4.inOut',
  fade: 'power2.inOut',
} as const

/** A duration in seconds, or 0 under reduced motion. */
export const dur = (seconds: number) => (reduced ? 0 : seconds)

/** A stagger or delay in seconds, or 0 under reduced motion. */
export const step = (seconds: number) => (reduced ? 0 : seconds)
