import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Check, FileText, Folder, Library, Search, Sparkles,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8'
const home = pagesContent.home

function getContentObj(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = getContentObj(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = getContentObj(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Reference'
}

function fileMetaOf(post?: SitePost | null) {
  const content = getContentObj(post)
  const size = (typeof content.fileSize === 'string' && content.fileSize) || (typeof content.size === 'string' && content.size) || ''
  const pages = content.pages ? String(content.pages) : ''
  return { size, pages }
}

function hasRealImage(post: SitePost) {
  const img = getEditablePostImage(post)
  return Boolean(img) && !img.includes('placeholder')
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function poolOf(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

/* -------------------------- Reference resource card -------------------------- */
// Library-first: leads with the document, not hero photography. Uses a cover
// when one exists, otherwise a tinted document glyph.
function ResourceCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const { size } = fileMetaOf(post)
  const showImage = hasRealImage(post)
  return (
    <Link href={href} className={`group flex flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        {showImage ? (
          <img src={getEditablePostImage(post)} alt={post.title} className={`h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#eceae0,#e2e6df)]">
            <FileText className="h-12 w-12 text-[var(--slot4-accent)] opacity-70" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[var(--slot4-page-bg)]/92 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-page-text)] shadow-sm">{category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="editable-display line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 110)}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[var(--editable-border)] pt-3 text-xs font-medium text-[var(--slot4-muted-text)]">
          <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {size || 'Preview & download'}</span>
          <span className="inline-flex items-center gap-1 text-[var(--slot4-accent)] transition group-hover:translate-x-0.5">Open <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------- Hero -------------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolOf(posts, timeSections)
  const featured = pool[0]
  const [line1, line2] = home.hero.title

  return (
    <section className="relative overflow-hidden border-b border-[var(--editable-border)]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(233,166,92,0.22),transparent_68%)]" />
      <div className={`relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24 ${container}`}>
        <div>
          <EditableReveal index={0}>
            <span className={dc.badge.accentPill}><Library className="h-3.5 w-3.5" /> {home.hero.badge}</span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.heroTitle} mt-6 text-balance`}>
              {line1} <span className="text-[var(--slot4-accent-strong)]">{line2}</span>
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.65] text-[var(--slot4-muted-text)]">{home.hero.description}</p>
          </EditableReveal>
          <EditableReveal index={3}>
            <form action="/search" className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-[color:rgba(2,14,13,0.16)] bg-[var(--slot4-surface-bg)] p-1.5 pl-5 shadow-[0_10px_30px_rgba(2,14,13,0.06)]">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
              <input name="q" placeholder={home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]" />
              <button className="shrink-0 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-2.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-[1.04]">Search</button>
            </form>
          </EditableReveal>
          <EditableReveal index={4}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={home.hero.primaryCta.href} className={dc.button.primary}>{home.hero.primaryCta.label} <ArrowRight className="h-4 w-4" /></Link>
              <Link href={home.hero.secondaryCta.href} className={dc.button.secondary}>{home.hero.secondaryCta.label}</Link>
            </div>
          </EditableReveal>
        </div>

        {featured ? (
          <EditableReveal index={2}>
            <div className={`overflow-hidden ${dc.surface.dark} p-3`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.15rem] bg-[#02332e]">
                {hasRealImage(featured) ? (
                  <img src={getEditablePostImage(featured)} alt={featured.title} className="absolute inset-0 h-full w-full object-cover opacity-70" />
                ) : (
                  <div className="flex h-full items-center justify-center"><FileText className="h-16 w-16 text-[var(--slot4-accent-fill)] opacity-80" /></div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,26,23,0.9))]" />
                <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-accent-fill)] px-3 py-1 text-[11px] font-semibold text-[var(--slot4-on-accent)]">Latest reference</span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{categoryOf(featured)}</p>
                  <h2 className="editable-display mt-1.5 line-clamp-2 text-2xl font-bold leading-tight tracking-[-0.02em] text-white">{featured.title}</h2>
                </div>
              </div>
              <Link href={postHref(primaryTask, featured, primaryRoute)} className="mt-3 flex items-center justify-between rounded-[1rem] bg-white/5 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                Preview this reference <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

/* ------------------------------ Stat strip ------------------------------ */
export function EditableStatStrip({ posts, timeSections }: HomeSectionProps) {
  const pool = poolOf(posts, timeSections)
  const count = pool.length
  const collections = new Set(pool.map((post) => categoryOf(post).toLowerCase())).size
  if (!count) return null
  const values: Record<string, string> = {
    references: `${count}+`,
    collections: `${Math.max(collections, 1)}`,
    updated: 'Weekly',
  }
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`grid grid-cols-1 gap-8 py-10 sm:grid-cols-3 ${container}`}>
        {home.stats.items.map((item, index) => (
          <EditableReveal key={item.key} index={index}>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="editable-display text-4xl font-bold tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-5xl">{values[item.key] || '—'}</span>
              <span className="mt-2 text-sm font-medium text-[var(--slot4-muted-text)]">{item.label}</span>
            </div>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------- Intro -------------------------------- */
export function EditableIntro({ primaryRoute }: HomeSectionProps) {
  const intro = home.intro
  return (
    <section className={`${container} ${dc.shell.sectionY}`}>
      <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <EditableReveal index={0}><span className={dc.type.eyebrow}>{intro.badge}</span></EditableReveal>
          <EditableReveal index={1}>
            <h2 className={`${dc.type.sectionTitle} mt-4`}>
              {intro.title[0]} <span className="text-[var(--slot4-accent-strong)]">{intro.title[1]}</span>
            </h2>
          </EditableReveal>
          <div className="mt-6 space-y-4">
            {intro.paragraphs.map((p, i) => (
              <EditableReveal key={i} index={i + 2}>
                <p className="max-w-xl text-[1.0625rem] leading-[1.7] text-[var(--slot4-muted-text)]">{p}</p>
              </EditableReveal>
            ))}
          </div>
          <EditableReveal index={5}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryRoute || intro.primaryLink.href} className={dc.button.primary}>{intro.primaryLink.label} <ArrowRight className="h-4 w-4" /></Link>
              <Link href={intro.secondaryLink.href} className={dc.button.secondary}>{intro.secondaryLink.label}</Link>
            </div>
          </EditableReveal>
        </div>
        <EditableReveal index={2}>
          <div className={`${dc.surface.soft} p-8`}>
            <span className={dc.type.eyebrow}>{intro.sideBadge}</span>
            <ul className="mt-6 space-y-4">
              {intro.sidePoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]"><Check className="h-3.5 w-3.5" /></span>
                  <span className="text-[15px] leading-6 text-[var(--slot4-page-text)]">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ---------------------------- Collections ----------------------------- */
export function EditableCollections({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolOf(posts, timeSections)
  // Prefer real categories present in the library; fall back to canonical set.
  const present = Array.from(new Set(pool.map((post) => categoryOf(post)))).filter((name) => name && name !== 'Reference')
  const fromPosts = present
    .map((name) => {
      const match = CATEGORY_OPTIONS.find((option) => option.name.toLowerCase() === name.toLowerCase())
      return match || { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), name }
    })
  const collections = (fromPosts.length ? fromPosts : CATEGORY_OPTIONS.slice(0, 6)).slice(0, 6)
  if (!collections.length) return null
  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <EditableReveal index={0}><span className={dc.type.eyebrow}>{home.collections.eyebrow}</span></EditableReveal>
            <EditableReveal index={1}><h2 className={`${dc.type.sectionTitle} mt-4`}>{home.collections.title}</h2></EditableReveal>
            <EditableReveal index={2}><p className="mt-4 text-[1.0625rem] leading-7 text-[var(--slot4-muted-text)]">{home.collections.description}</p></EditableReveal>
          </div>
          <EditableReveal index={2}>
            <Link href={primaryRoute} className={`${dc.button.secondary} shrink-0`}>All references <ArrowRight className="h-4 w-4" /></Link>
          </EditableReveal>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <EditableReveal key={collection.slug} index={index}>
              <Link
                href={`${primaryRoute}?category=${encodeURIComponent(collection.slug)}`}
                className={`group flex items-center justify-between gap-4 ${dc.surface.card} p-6 ${dc.motion.lift}`}
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)] transition group-hover:scale-105"><Folder className="h-5 w-5" /></span>
                  <span className="editable-display text-lg font-bold tracking-[-0.02em] text-[var(--slot4-page-text)]">{collection.name}</span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[var(--slot4-muted-text)] transition group-hover:text-[var(--slot4-accent)]" />
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Process ------------------------------- */
export function EditableProcess() {
  const process = home.process
  return (
    <section className={`${container} ${dc.shell.sectionY}`}>
      <div className="max-w-2xl">
        <EditableReveal index={0}><span className={dc.type.eyebrow}>{process.eyebrow}</span></EditableReveal>
        <EditableReveal index={1}><h2 className={`${dc.type.sectionTitle} mt-4`}>{process.title}</h2></EditableReveal>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {process.steps.map((step, index) => (
          <EditableReveal key={step.title} index={index}>
            <div className={`h-full ${dc.surface.soft} p-8`}>
              <span className="editable-display text-5xl font-bold tracking-[-0.04em] text-[var(--slot4-accent-fill)]">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="editable-display mt-5 text-xl font-bold tracking-[-0.02em] text-[var(--slot4-page-text)]">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{step.description}</p>
            </div>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------- Benefits (dark band) ------------------------ */
export function EditableBenefits() {
  const benefits = home.benefits
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <div className="max-w-2xl">
          <EditableReveal index={0}><span className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{benefits.eyebrow}</span></EditableReveal>
          <EditableReveal index={1}><h2 className="editable-display mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.03em]">{benefits.title}</h2></EditableReveal>
          <EditableReveal index={2}><p className="mt-4 text-[1.0625rem] leading-7 text-white/70">{benefits.description}</p></EditableReveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.items.map((item, index) => (
            <EditableReveal key={item.title} index={index}>
              <div className="h-full rounded-[1.25rem] border border-white/12 bg-white/[0.04] p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]"><Sparkles className="h-5 w-5" /></span>
                <h3 className="editable-display mt-5 text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-white/70">{item.description}</p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------- Latest resources -------------------------- */
export function EditableLatest({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const latest = poolOf(posts, timeSections).slice(0, 6)
  if (!latest.length) return null
  return (
    <section className={`${container} ${dc.shell.sectionY}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <EditableReveal index={0}><span className={dc.type.eyebrow}>{home.latest.eyebrow}</span></EditableReveal>
          <EditableReveal index={1}><h2 className={`${dc.type.sectionTitle} mt-4`}>{home.latest.title}</h2></EditableReveal>
        </div>
        <EditableReveal index={2}>
          <Link href={primaryRoute} className={`${dc.button.secondary} shrink-0`}>{home.latest.viewAll} <ArrowRight className="h-4 w-4" /></Link>
        </EditableReveal>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((post, index) => (
          <EditableReveal key={post.id || post.slug} index={index}>
            <ResourceCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------- FAQ --------------------------------- */
export function EditableFaq() {
  const faq = home.faq
  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <EditableReveal index={0}><span className={dc.type.eyebrow}>{faq.eyebrow}</span></EditableReveal>
            <EditableReveal index={1}><h2 className={`${dc.type.sectionTitle} mt-4`}>{faq.title}</h2></EditableReveal>
          </div>
          <div className="divide-y divide-[var(--editable-border)]">
            {faq.items.map((item, index) => (
              <EditableReveal key={item.q} index={index}>
                <details className="group py-5" {...(index === 0 ? { open: true } : {})}>
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-[var(--slot4-page-text)] marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] transition group-open:rotate-45 group-open:border-[var(--slot4-accent)] group-open:text-[var(--slot4-accent)]">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--slot4-muted-text)]">{item.a}</p>
                </details>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ CTA band ------------------------------ */
export function EditableHomeCta() {
  const cta = home.cta
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className={`flex flex-col items-center gap-7 py-20 text-center sm:py-28 ${container}`}>
        <EditableReveal index={0}><span className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{cta.badge}</span></EditableReveal>
        <EditableReveal index={1}>
          <h2 className="editable-display max-w-3xl text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.035em]">
            {cta.title[0]} <span className="text-[var(--slot4-accent-fill)]">{cta.title[1]}</span>
          </h2>
        </EditableReveal>
        <EditableReveal index={2}><p className="max-w-xl text-[1.0625rem] leading-7 text-white/70">{cta.description}</p></EditableReveal>
        <EditableReveal index={3}>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={cta.primaryCta.href} className={dc.button.primary}>{cta.primaryCta.label} <ArrowRight className="h-4 w-4" /></Link>
            <Link href={cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">{cta.secondaryCta.label}</Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
