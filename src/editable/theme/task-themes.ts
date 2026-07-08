import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task surfaces — ensoro reference (warm editorial).

  Every task (archive + detail) shares ONE cohesive identity: warm cream
  surfaces, green-black ink, a readable teal accent for eyebrows/icons/links,
  and a warm-amber fill for primary actions. Per-task copy (kicker / note)
  still varies so each surface keeps a little voice, but the visual language
  is unified. Tokens are delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  /** amber fill for primary actions + on-fill ink */
  fill: string
  onFill: string
  glow: string
  radius: string
}

const FONT_DISPLAY = "'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const FONT_BODY = "'Kanit', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared warm palette — every task inherits this; only kicker/note differ.
const base = {
  dark: false,
  fontDisplay: FONT_DISPLAY,
  fontBody: FONT_BODY,
  bg: '#f5f4ef',
  surface: '#fffefa',
  raised: '#ecebe2',
  text: '#020e0d',
  muted: '#47514e',
  line: 'rgba(2,14,13,0.12)',
  accent: '#0b5d52',
  accentSoft: '#f4e3cd',
  onAccent: '#f5f4ef',
  fill: '#e9a65c',
  onFill: '#020e0d',
  glow: 'rgba(233,166,92,0.16)',
  radius: '1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Reading room', note: 'In-depth reads, guides and references worth your time.' },
  listing: { ...base, kicker: 'Directory', note: 'Find, compare and connect with useful entries.' },
  classified: { ...base, kicker: 'Notice board', note: 'Fresh offers and postings, ready to act on.' },
  image: { ...base, kicker: 'Gallery', note: 'A visual feed of standout images and collections.' },
  sbm: { ...base, kicker: 'Collections', note: 'Curated links and resources worth saving.' },
  // Public surface — the Reference Library.
  pdf: { ...base, kicker: 'Reference Library', note: 'Downloadable guides, reports and reference documents.' },
  // Direct-URL only — the display label appears solely on the profile detail page.
  profile: { ...base, kicker: 'Contributor', note: 'The people behind the reference collection.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-fill': t.fill,
    '--tk-on-fill': t.onFill,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Article-body headings/links inherit the task's teal accent; keep the
    // global amber fill intact for pill CTAs rendered inside detail pages.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.fill,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
