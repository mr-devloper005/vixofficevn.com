import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, FileText, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

// The public search surface only ever returns Reference Library entries.
const PUBLIC_TASK = 'pdf'
const PUBLIC_ROUTE = SITE_CONFIG.taskViews.pdf || '/pdf'

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => stripHtml(post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || '').replace(/\s+/g, ' ').trim()
const categoryOf = (post: SitePost) => compactRaw(getContent(post).category) || post.tags?.[0] || 'Reference'
const sizeOf = (post: SitePost) => compactRaw(getContent(post).fileSize) || compactRaw(getContent(post).size)

const matches = (post: SitePost, query: string, category: string) => {
  const content = getContent(post)
  if (compactText(content.type) === 'comment') return false
  // Only surface Reference Library entries in the public search.
  if ((getPostTaskKey(post) || compactText(content.type)) !== PUBLIC_TASK) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const href = `${PUBLIC_ROUTE}/${post.slug}`
  const summary = summaryOf(post)
  const size = sizeOf(post)
  return (
    <Link href={href} className={`group flex flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#eceae0,#e2e6df)]">
        <FileText className="h-12 w-12 text-[var(--slot4-accent)] opacity-70 transition duration-500 group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-page-bg)]/92 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-page-text)]">{categoryOf(post)}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="editable-display line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        {summary ? <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--editable-border)] pt-3 text-xs font-medium text-[var(--slot4-muted-text)]">
          <span>{size || 'Preview & download'}</span>
          <span className="inline-flex items-center gap-1 text-[var(--slot4-accent)]">Open <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: PUBLIC_TASK } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : getMockPostsForTask(PUBLIC_TASK)
  const results = posts.filter((post) => matches(post, normalized, category)).slice(0, normalized ? 80 : 36)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-14 sm:py-20`}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <EditableReveal index={0}>
              <div>
                <span className={dc.badge.accentPill}><Search className="h-3.5 w-3.5" /> {pagesContent.search.hero.badge}</span>
                <h1 className={`${dc.type.heroTitle} mt-6`}>{pagesContent.search.hero.title}</h1>
                <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.65] text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <form action="/search" className={`${dc.surface.soft} p-5 sm:p-7`}>
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-full border border-[color:rgba(2,14,13,0.16)] bg-[var(--slot4-surface-bg)] px-5 py-3.5">
                  <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
                </label>
                <label className="mt-3 flex items-center gap-3 rounded-full border border-[color:rgba(2,14,13,0.16)] bg-[var(--slot4-surface-bg)] px-5 py-3.5">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="category" defaultValue={category} placeholder="Collection or category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
                </label>
                <button className={`${dc.button.primary} mt-4 w-full`} type="submit">Search the library <Search className="h-4 w-4" /></button>
              </form>
            </EditableReveal>
          </div>

          <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={dc.type.eyebrow}>{results.length} results</p>
              <h2 className={`${dc.type.sectionTitle} mt-3`}>{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href={PUBLIC_ROUTE} className={dc.button.secondary}>Browse the library <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <SearchResultCard post={post} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className={`mt-8 ${dc.surface.soft} border-dashed p-12 text-center`}>
              <Search className="mx-auto h-7 w-7 text-[var(--slot4-muted-text)]" />
              <p className="editable-display mt-5 text-2xl font-bold tracking-[-0.02em]">No matching references found.</p>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Try a different keyword or collection.</p>
            </div>
          )}

          <div className="mt-14">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
