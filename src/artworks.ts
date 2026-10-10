export interface Slide {
  /** Image or PDF. `file.pdf#page=3` addresses one page of a multi-page PDF. */
  src: string
  /** Layered over the page beneath; a PDF renders as matte film (white is clear). */
  seeThrough?: boolean
  /** A landscape picture that opens full screen when clicked. */
  fullscreen?: boolean
  /** Label text for this slide onward (inherited until changed). */
  text?: string[]
  meta?: string
  /** Label PDF/image for this slide onward, in place of the text. */
  label?: string
}

export interface Artwork {
  slug: string
  /** Label PDF/image shown on the home page and when the project opens. */
  label?: string
  /** Label text; also used for screen readers when a label PDF is shown. */
  title: string[]
  meta: string
  slides: Slide[]
}

/**
 * The works, in order. Files are in public/echte_artworks:
 *
 *   project_N_slide_K.pdf   page K of project N
 *   label_N_voor.pdf        project N's label (front)
 *   label_N_achter.pdf      project N's label (back)
 *
 * Project 6 has several cards, each named after the slides it covers
 * (e.g. label_6_slides_3-6_*). Paths are from the site root.
 */
const dir = '/echte_artworks'

export const artworks: Artwork[] = [
  {
    slug: 'project-one',
    label: `${dir}/Extra coloured cards-1.pdf`,
    title: ['[Project one]'],
    meta: '[Year] · [Medium]',
    slides: [{ src: `${dir}/project_1_page_1.pdf`, label: `${dir}/Extra coloured cards-2.pdf` }],
  },
  {
    slug: 'project-knit',
    label: `${dir}/Extra coloured cards-5.pdf`,
    title: ['[Project one]'],
    meta: '[Year] · [Medium]',
    slides: [{ src: `${dir}/Portfolio v3 graduation projects v3-1.pdf`, label: `${dir}/Extra coloured cards-6.pdf`}, { src: `${dir}/Portfolio v3 graduation projects v3-2.pdf`}, {src: `${dir}/55486863081_fb7b4f7af6_o.jpg`, fullscreen: true}],
  },
  {
    slug: 'project-ski',
    label: `${dir}/Extra coloured cards-3.pdf`,
    title: ['[Project one]'],
    meta: '[Year] · [Medium]',
    slides: [{ src: `${dir}/Portfolio v3 graduation projects v3-3.pdf`, label: `${dir}/Extra coloured cards-4.pdf`}, { src: `${dir}/Portfolio v3 graduation projects v3-4.pdf`}, {src: `${dir}/project_ski_3.pdf`}],
  },
  {
    slug: 'project-two',
    label: `${dir}/label_2_voor.pdf`,
    title: ['[Project two]'],
    meta: '[Year] · [Medium]',
    slides: [
      { src: `${dir}/project_2_slide_1.pdf`, label: `${dir}/label_2_achter.pdf` },
      { src: `${dir}/project_2_slide_2.pdf`, seeThrough: true },
      { src: `${dir}/project_2_slide_3.pdf` },
    ],
  },
  {
    slug: 'project-three',
    label: `${dir}/label_3_voor.pdf`,
    title: ['[Project three]'],
    meta: '[Year] · [Medium]',
    slides: [
      { src: `${dir}/project_3_slide_1.pdf`, label: `${dir}/label_3_achter.pdf` },
      { src: `${dir}/project_3_slide_2.pdf` },
    ],
  },
  {
    slug: 'project-four',
    label: `${dir}/label_4_voor.pdf`,
    title: ['[Project four]'],
    meta: '[Year] · [Medium]',
    slides: [
      { src: `${dir}/project_4_slide_1.pdf`, label: `${dir}/label_4_achter.pdf` },
      { src: `${dir}/project_4_slide_2.pdf` },
    ],
  },
  {
    slug: 'project-five',
    label: `${dir}/label_5_voor.pdf`,
    title: ['[Project five]'],
    meta: '[Year] · [Medium]',
    slides: [
      { src: `${dir}/project_5_slide_1.pdf`, label: `${dir}/label_5_achter.pdf` },
      { src: `${dir}/project_5_slide_2.pdf` },
    ],
  },
  {
    slug: 'project-six',
    label: `${dir}/label_6_slides_1-2_voor.pdf`,
    title: ['[Project six]'],
    meta: '[Year] · [Medium]',
    slides: [
      { src: `${dir}/project_6_slide_1.pdf` },
      { src: `${dir}/project_6_slide_2.pdf`, label: `${dir}/label_6_slides_1-2_achter.pdf`, seeThrough: true },
      { src: `${dir}/project_6_slide_3.pdf`, label: `${dir}/label_6_slides_3-6_voor.pdf`, seeThrough: true },
      { src: `${dir}/project_6_slide_4.pdf`, label: `${dir}/label_6_slides_3-6_achter.pdf`, seeThrough: true },
      { src: `${dir}/project_6_slide_5.pdf`, seeThrough: true },
      { src: `${dir}/project_6_slide_6.pdf` },
      { src: `${dir}/project_6_slide_7.pdf`, label: `${dir}/label_6_slides_7-8_voor.pdf` },
      { src: `${dir}/project_6_slide_8.pdf`, label: `${dir}/label_6_slides_7-8_achter.pdf` },
    ],
  },
  {
    slug: 'project-seven',
    label: `${dir}/label_7_voor.pdf`,
    title: ['[Project seven]'],
    meta: '[Year] · [Medium]',
    slides: [
      { src: `${dir}/project_7_slide_1.pdf` },
      { src: `${dir}/project_7_slide_2.pdf`, label: `${dir}/label_7_achter.pdf` },
    ],
  },
  {
    slug: 'project-eight',
    label: `${dir}/label_8_voor.pdf`,
    title: ['[Project eight]'],
    meta: '[Year] · [Medium]',
    slides: [
      { src: `${dir}/project_8_slide_1.pdf` },
      { src: `${dir}/project_8_slide_2.pdf`, label: `${dir}/label_8_achter.pdf`},
      {src: `${dir}/Portfolio just pages without numbers-1-18.pdf`},
      {src: `${dir}/Portfolio just pages without numbers-1-19.pdf`},
      {src: `${dir}/Portfolio just pages without numbers-1-20.pdf`}
    ],
  },
]
