import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading room',
    headline: 'Long-form references with a calmer reading rhythm.',
    description: 'Essays, guides, and explainers presented like a publication rather than a directory.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading surfaces need space, hierarchy, and fewer distractions.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving postings and time-sensitive notices.',
    description: 'Practical, quick-to-scan entries with less decoration and more action.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritise clarity, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Collections',
    headline: 'Curated links arranged like useful shelves.',
    description: 'Grouped resources, tools, and references that read like a tidy collection.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    // Direct-URL surface only — never linked publicly.
    eyebrow: 'Contributor',
    headline: 'The people behind the reference collection.',
    description: 'A contributor record with identity, context, and the references they have shared.',
    filterLabel: 'Filter category',
    secondaryNote: 'Make identity and credibility visible before anything else.',
    chips: ['Identity first', 'Verified', 'Their references'],
  },
  pdf: {
    // The public Reference Library surface.
    eyebrow: 'Reference Library',
    headline: 'Guides, reports, and references you can actually use.',
    description:
      'Preview each reference in place, check the details, and download the ones that fit — all from one calm, well-organised library.',
    filterLabel: 'Filter by collection',
    secondaryNote: 'A reference library needs preview cues, clear context, and clean browsing.',
    chips: ['Preview first', 'Downloadable', 'Organised collections'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Entries built for discovery and comparison.',
    description: 'A directory rhythm with context, metadata, and a practical search flow.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritise comparison, context, and direct action paths.',
    chips: ['Directory', 'Compare', 'Discovery'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'A gallery-first way to browse visual references.',
    description: 'Visual entries with stronger cards and a portfolio-like rhythm.',
    filterLabel: 'Filter category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
