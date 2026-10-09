export interface ContactRow {
  label: string
  value: string
  href?: string
}

export interface InfoPanel {
  id: string
  /** Shown in the label's caption line. */
  label: string
}

export const infoPanels: InfoPanel[] = [
  { id: 'biography', label: 'Who am I?' },
  { id: 'contact', label: 'Contact' },
]

export const site = {
  artistLines: ['Eva van Caem'],

  bio: {
    lead: 'I am a textile-focused designer and maker with a fascination for materiality, systems and the possibilities of making. I enjoy solving complex problems through precise, hands-on work, turning ideas into tangible and often unexpected outcomes.',
    body: [
      'While textiles are my main field, I am not interested in being limited by one discipline, material or technique. I am highly collaborative and naturally curious, quickly building connections and finding people to learn from or work with.',
      'I listen as much as I talk, because there is always more to discover. I approach challenges with patience, persistence and a healthy amount of stubbornness—if there is a way to make something work, I will probably find it.',
    ],
  },

  contact: {
    lead: 'For exhibition enquiries, the full CV or a conversation, send me an email.',
    rows: [
      { label: 'Email', value: 'evavancaem@hotmail.nl', href: 'mailto:evavancaem@hotmail.nl' },
      { label: 'Instagram', value: '@evavc_' },
    ] as ContactRow[],
  },
}
