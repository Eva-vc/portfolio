import { createContext, useContext } from 'react'

/** State shared by the persistent shell (header, label) and the routes. */
export interface ShellState {
  artworkIndex: number
  setArtworkIndex: (i: number) => void
  slideIndex: number
  setSlideIndex: (i: number) => void
  infoPanel: number
  setInfoPanel: (i: number) => void
}

export const ShellContext = createContext<ShellState>({
  artworkIndex: 0,
  setArtworkIndex: () => {},
  slideIndex: 0,
  setSlideIndex: () => {},
  infoPanel: 0,
  setInfoPanel: () => {},
})

export const useShell = () => useContext(ShellContext)

/** One step through a set, clamped (no wrap-around). */
export const clampStep = (current: number, dir: 1 | -1, count: number) =>
  Math.min(Math.max(current + dir, 0), count - 1)
