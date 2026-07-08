import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

// Large editorial feature — deep-teal panel with a soft image, amber eyebrow,
// and a pill action. Reads as the centrepiece of a section.
export function EditorialFeatureCard({ post, href, label = 'Featured reference' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[460px] p-7 sm:p-10 lg:min-h-[560px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,40,36,0.35),rgba(0,26,23,0.92))]" />
        <div className="relative z-10 flex h-full min-h-[400px] flex-col justify-end lg:min-h-[500px]">
          <span className={`${dc.type.eyebrow} text-[var(--slot4-accent-fill)]`}>{label}</span>
          <h3 className="editable-display mt-5 max-w-3xl text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[0.95] tracking-[-0.035em]">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75 sm:text-base">{getEditableExcerpt(post, 180)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)]">
            Open reference <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// Slim rail tile — image top, numbered chip, tight title.
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/5]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
        <span className="absolute left-3 top-3 rounded-full bg-[var(--slot4-page-bg)]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-4">
        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-2 line-clamp-3 text-lg font-bold leading-tight tracking-[-0.02em] ${pal.panelText}`}>{post.title}</h3>
      </div>
    </Link>
  )
}

// Compact index row — numbered marker + title + snippet.
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-accent-strong)]">{String(index + 1).padStart(2, '0')}</span>
        <div className="min-w-0">
          <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)}</p>
          <h3 className={`editable-display mt-1.5 line-clamp-2 text-lg font-bold leading-tight tracking-[-0.02em] ${pal.panelText}`}>{post.title}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.softMutedText}`}>{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

// Wide list card — image left, content right.
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[190px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)} · No. {String(index + 1).padStart(2, '0')}</p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-2xl font-bold leading-tight tracking-[-0.03em] ${pal.panelText} sm:text-[1.75rem]`}>{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.softMutedText}`}>{getEditableExcerpt(post, 180)}</p>
        <span className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${pal.accentText}`}>Open reference <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
      </div>
    </Link>
  )
}
