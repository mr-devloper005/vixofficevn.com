import type { CSSProperties } from 'react'

/*
  Design system — ensoro reference (warm editorial).

  Palette: warm cream page base, near-black green ink, a deep-teal dark
  contrast band, and a single warm-amber accent used for pill buttons and
  highlights. Typography pairs Geist (bold geometric display, ultra-tight
  leading) with Kanit (condensed humanist body). Buttons are full pills
  (100px). Cards are flat with a 10px radius and a hairline ink border.

  Everything downstream consumes these values through CSS variables, so a
  palette or type change here cascades across the whole editable surface.
*/

export const editableRootStyle = {
  // Warm cream base + green-black ink.
  '--slot4-page-bg': '#f5f4ef',
  '--slot4-page-text': '#020e0d',
  '--slot4-panel-bg': '#ecebe2',
  '--slot4-surface-bg': '#fffefa',
  '--slot4-muted-text': '#47514e',
  '--slot4-soft-muted-text': '#6b7370',
  // Teal is the readable "ink accent" (eyebrows, icons, links, hairlines).
  '--slot4-accent': '#0b5d52',
  // Amber is the signature fill (pill buttons, highlights).
  '--slot4-accent-fill': '#e9a65c',
  '--slot4-accent-strong': '#b9762b',
  '--slot4-accent-soft': '#f4e3cd',
  // Amber is light, so ink sits on top of it.
  '--slot4-on-accent': '#020e0d',
  // Deep-teal dark band.
  '--slot4-dark-bg': '#003d36',
  '--slot4-dark-text': '#f5f4ef',
  '--slot4-media-bg': '#e5e3d9',
  '--slot4-cream': '#fffefa',
  '--slot4-warm': '#efeee6',
  '--slot4-lavender': '#f5f4ef',
  '--slot4-gray': '#ecebe2',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f5f4ef',
  '--editable-page-text': '#020e0d',
  '--editable-container': '1120px',
  '--editable-border': 'rgba(2,14,13,0.12)',
  '--editable-nav-bg': '#f5f4ef',
  '--editable-nav-text': '#020e0d',
  '--editable-nav-active': '#0b5d52',
  '--editable-nav-active-text': '#020e0d',
  '--editable-cta-bg': '#e9a65c',
  '--editable-cta-text': '#020e0d',
  '--editable-search-bg': '#fffefa',
  '--editable-footer-bg': '#003d36',
  '--editable-footer-text': '#f5f4ef',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_1px_2px_rgba(2,14,13,0.05)]',
  shadowStrong: 'shadow-[0_24px_60px_rgba(2,14,13,0.10)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,61,54,0.05),rgba(0,20,18,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8',
    sectionY: 'py-16 sm:py-24 lg:py-28',
  },
  layout: {
    safeGrid: 'grid gap-7 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[150px] shrink-0 snap-start sm:w-[170px]',
  },
  type: {
    // Geist labels, teal, tracked.
    eyebrow: 'text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]',
    // Huge, ultra-tight geometric display.
    heroTitle: 'editable-display text-[clamp(2.75rem,7vw,5rem)] font-bold leading-[0.9] tracking-[-0.04em]',
    sectionTitle: 'editable-display text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.03em]',
    body: 'text-[1.0625rem] leading-[1.6]',
    // No serif in this reference — emphasis reads as a warm amber-ink highlight.
    emphasis: 'text-[var(--slot4-accent-strong)]',
  },
  surface: {
    card: `rounded-[0.625rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[0.625rem] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[1.5rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    // Full pill, amber fill, ink text.
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold tracking-[0.01em] text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-[1.04] active:scale-[0.98]`,
    // Ink outline that fills on hover.
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[color:rgba(2,14,13,0.28)] bg-transparent px-7 py-3.5 text-sm font-semibold tracking-[0.01em] text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] active:scale-[0.98]`,
    // Deep-teal fill.
    accent: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-dark-text)] transition duration-300 hover:brightness-110 active:scale-[0.98]`,
    ghost: `inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:text-[var(--slot4-accent)]`,
  },
  badge: {
    pill: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
    accentPill: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent-strong)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[0.625rem] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[1.25rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(2,14,13,0.12)]',
    fade: 'transition duration-500 hover:opacity-80',
    zoom: 'transition duration-700 group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Wrap section headers and grid items in EditableReveal with staggered index props.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
