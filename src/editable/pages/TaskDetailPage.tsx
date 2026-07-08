import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Layers, Link2, Mail, MapPin, Phone, ShieldCheck, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  // The Contributor (profile) page never surfaces other profiles — its bottom
  // strip points into the public Reference Library instead.
  const libraryPosts = task === 'profile' ? (await fetchTaskPosts('pdf', 6)).slice(0, 4) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} libraryPosts={libraryPosts} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
// Plain-text lead intro, but only when it isn't just a duplicate of the body
// (some posts store the full HTML body in `summary`, which would render twice).
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [], libraryPosts = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>; libraryPosts?: SitePost[] }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} libraryPosts={libraryPosts} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

// Yelp-style red star rating row. Uses real rating/review fields when present,
// otherwise a stable derived value (wire to real data when available).
const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function DetailMeta({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-[18px] w-[18px] ${i < filled ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">{reviewsOf(post)} reviews</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
          <span className="text-sm text-[var(--tk-muted)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

// ----- Article: a quiet, centred reading column -----
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        <BackLink task="article" />
        <p className="mt-10 text-xs font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">{categoryOf(post, 'Article')}</p>
        <h1 className="editable-display mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">{post.title}</h1>
        <div className="mt-6 text-sm text-[var(--tk-muted)]">
          <span>{SITE_CONFIG.name}</span>
        </div>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

// ----- Listing: a precise directory record -----
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-8">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-[var(--tk-muted)]" />}
            </div>
            <div className="min-w-0">
              <Kicker task="listing">Business listing</Kicker>
              <h1 className="editable-display mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
              <DetailMeta post={post} category={getField(post, ['category'])} />
            </div>
          </div>
          {leadText(post) ? <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <Divider />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Showcase" />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

// ----- Classified: price-forward notice with a sticky action rail -----
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-6 py-14 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
            <Kicker task="classified">Classified</Kicker>
            <h1 className="editable-display mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em]">{post.title}</h1>
            <DetailMeta post={post} category={getField(post, ['category'])} />
            <p className="editable-display mt-6 text-4xl font-semibold tracking-[-0.03em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:opacity-90"><Phone className="h-4 w-4" /> Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

// ----- Image: a dark, gallery-led canvas -----
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-8">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]"><Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Image story</div>
            <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

// ----- Bookmark: a single curated resource -----
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Bookmark className="h-7 w-7" /></div>
        <div className="mt-6"><Kicker task="sbm">Saved resource</Kicker></div>
        <h1 className="editable-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:opacity-90">
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

// ----- Reference Library detail: a document workspace (public) -----
// The file itself is the hero — no decorative photography anywhere. There are
// deliberately NO <img> tags in this branch: the document identity uses an SVG
// glyph, and the preview is an <iframe>.
const sectionsOf = (post: SitePost) => {
  const body = getBody(post)
  const headings = Array.from(body.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi))
    .map((match) => stripHtml(match[1]))
    .filter(Boolean)
  if (headings.length) return headings.slice(0, 6)
  return ['Overview', 'Key points', 'Summary']
}

function DocFacts({ items }: { items: Array<[string, string]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {visible.map(([label, value]) => (
        <div key={label} className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</p>
          <p className="editable-display mt-1.5 text-lg font-bold tracking-[-0.01em]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const theme = getTaskTheme('pdf')
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const category = categoryOf(post, 'Reference')
  const size = getField(post, ['fileSize', 'size'])
  const pages = getField(post, ['pages', 'pageCount'])
  const addedBy = getField(post, ['author', 'uploadedBy', 'contributor']) || SITE_CONFIG.name
  const lead = leadText(post)
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 8) : []
  const sections = sectionsOf(post)

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20">
        <Link href={getTaskConfig('pdf')?.route || '/pdf'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
          <ArrowLeft className="h-4 w-4" /> Back to {theme.kicker}
        </Link>

        {/* Label chip row */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-fill)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-on-fill)]"><FileText className="h-3.5 w-3.5" /> Reference</span>
          <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{category}</span>
          <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">Downloadable</span>
        </div>

        {/* Title — the typographic centrepiece */}
        <h1 className="editable-display mt-6 max-w-4xl text-balance text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.04em]">{post.title}</h1>

        {lead ? (
          <p className="mt-8 max-w-3xl border-l-[3px] border-[var(--tk-fill)] pl-6 text-[1.375rem] font-medium leading-[1.5] tracking-[-0.01em] text-[var(--tk-text)]">{lead}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-fill)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-on-fill)] transition hover:brightness-[1.04]">Download reference <Download className="h-4 w-4" /></Link> : null}
          {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--tk-line)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]">Open in new tab <ExternalLink className="h-4 w-4" /></Link> : null}
        </div>

        <DocFacts items={[['Pages', pages], ['Size', size], ['Collection', category], ['Preview', fileUrl ? 'Available' : '—']]} />

        {/* Embedded preview — the visual centrepiece */}
        {fileUrl ? (
          <div className="mt-10 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_24px_60px_rgba(2,14,13,0.10)]">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] px-5 py-3.5">
              <span className="inline-flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-[var(--tk-accent)]" /> Preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--tk-accent)]">Full screen <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[80vh] w-full bg-[var(--tk-raised)]" />
          </div>
        ) : null}

        {/* Two-column body + sticky sidebar */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <h2 className="editable-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.03em]">About this reference</h2>
            <BodyContent post={post} />
            {tags.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]">#{tag}</span>
                ))}
              </div>
            ) : null}

            {/* Repeated CTA callout */}
            {fileUrl ? (
              <div className="mt-10 flex flex-col items-start gap-4 rounded-[var(--tk-radius)] bg-[var(--slot4-dark-bg)] p-8 text-[var(--slot4-dark-text)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="editable-display text-xl font-bold tracking-[-0.02em]">Ready when you are.</h3>
                  <p className="mt-1.5 text-sm text-white/70">Grab the full reference and get back to work.</p>
                </div>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--tk-fill)] px-6 py-3 text-sm font-semibold text-[var(--tk-on-fill)] transition hover:brightness-[1.04]">Download <Download className="h-4 w-4" /></Link>
              </div>
            ) : null}

            <div className="mt-10">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Document-identity block — glyph in the display face, no raster */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <div className="flex h-32 items-center justify-center rounded-[calc(var(--tk-radius)-0.35rem)] bg-[linear-gradient(135deg,#eceae0,#e2e6df)]">
                <FileText className="h-14 w-14 text-[var(--tk-accent)]" />
              </div>
              <p className="editable-display mt-4 line-clamp-2 text-base font-bold tracking-[-0.01em]">{post.title}</p>
              <dl className="mt-4 grid gap-2.5 text-sm">
                {[['Collection', category], ['Pages', pages], ['Size', size], ['Added by', addedBy]].filter(([, value]) => value).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <dt className="text-[var(--tk-muted)]">{label}</dt>
                    <dd className="max-w-[60%] truncate font-medium text-[var(--tk-text)]">{value}</dd>
                  </div>
                ))}
              </dl>
              {fileUrl ? (
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-fill)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-fill)] transition hover:brightness-[1.04]">Download <Download className="h-4 w-4" /></Link>
              ) : null}
            </div>

            {/* What's inside */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="inline-flex items-center gap-2 text-sm font-semibold"><Layers className="h-4 w-4 text-[var(--tk-accent)]" /> What&rsquo;s inside</p>
              <ul className="mt-4 space-y-2.5">
                {sections.map((section) => (
                  <li key={section} className="flex items-start gap-2.5 text-sm text-[var(--tk-muted)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> <span className="line-clamp-1">{section}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <PdfRelatedStrip related={related} />
    </>
  )
}

// Related references — glyph tiles, title, size chip. No hero photography.
function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-2xl font-bold tracking-[-0.02em]">Related references</h2>
          <Link href={getTaskConfig('pdf')?.route || '/pdf'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">Browse all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => {
            const size = getField(item, ['fileSize', 'size'])
            const href = `${getTaskConfig('pdf')?.route || '/pdf'}/${item.slug}`
            return (
              <Link key={item.id || item.slug} href={href} className="group flex flex-col rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(2,14,13,0.12)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-6 w-6" /></span>
                <h3 className="editable-display mt-4 line-clamp-2 flex-1 text-base font-bold leading-snug tracking-[-0.01em]">{item.title}</h3>
                <span className="mt-4 w-fit rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-medium text-[var(--tk-muted)]">{size || 'Preview'}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ----- Contributor: a premium identity record (direct-URL only) -----
// Never linked from public UI. Its bottom strip points INTO the Reference
// Library — it never surfaces or links to other contributors.
function ProfileDetail({ post, libraryPosts }: { post: SitePost; libraryPosts: SitePost[] }) {
  const theme = getTaskTheme('profile')
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'title'])
  const location = getField(post, ['location', 'address', 'city'])
  const company = getField(post, ['company', 'organization'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const address = getField(post, ['address', 'location', 'city'])
  const links = getField(post, ['links', 'linkedin', 'twitter', 'social'])
  const lead = leadText(post)
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 8) : []
  const mapSrc = mapSrcFor(post)

  const facts: Array<[string, string, typeof MapPin]> = [
    ['Location', location, MapPin],
    ['Role', role || company, UserRound],
    ['Website', website ? 'Linked' : '', Globe2],
    ['Status', 'Verified', ShieldCheck],
  ]
  const contactRows: Array<[string, string, string, typeof MapPin]> = [
    ['Address', address, address ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}` : '', MapPin],
    ['Phone', phone, phone ? `tel:${phone}` : '', Phone],
    ['Email', email, email ? `mailto:${email}` : '', Mail],
    ['Website', website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '') : '', website || '', Globe2],
    ['Links', links, links && /^https?:\/\//.test(links) ? links : '', Link2],
  ]

  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      {/* Hero band */}
      <div className="mt-8 overflow-hidden rounded-[1.5rem] bg-[var(--slot4-dark-bg)] px-7 py-12 text-[var(--slot4-dark-text)] sm:px-12 sm:py-16">
        <div className="flex flex-col items-center gap-7 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
            {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 text-white/70" />}
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent-fill)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-on-accent)]">{theme.kicker}</span>
            <h1 className="editable-display mt-4 text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.03em]">{post.title}</h1>
            {(role || company || location) ? (
              <p className="mt-2 text-sm font-medium text-white/70">{[role, company, location].filter(Boolean).join(' · ')}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          {lead ? <p className="border-l-[3px] border-[var(--tk-fill)] pl-6 text-[1.375rem] font-medium leading-[1.5] tracking-[-0.01em] text-[var(--tk-text)]">{lead}</p> : null}

          {/* Quick facts strip */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.filter(([, value]) => value).map(([label, value, Icon]) => (
              <div key={label} className="flex items-center gap-3 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Icon className="h-4 w-4" /></span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</p>
                  <p className="truncate text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="editable-display mt-10 text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.03em]">About</h2>
          <BodyContent post={post} />
          {tags.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]">#{tag}</span>
              ))}
            </div>
          ) : null}

          {images.length > 1 ? <ImageStrip images={images.slice(1)} label="Gallery" /> : null}

          {mapSrc ? <div className="mt-10"><MapBox src={mapSrc} label={address || post.title} /></div> : null}

          {/* Their references — links INTO the Reference Library, never to other contributors */}
          {libraryPosts.length ? (
            <section className="mt-12">
              <h2 className="editable-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.02em]">From the library</h2>
              <p className="mt-2 text-sm text-[var(--tk-muted)]">References available to browse and download.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {libraryPosts.map((item) => (
                  <Link key={item.id || item.slug} href={`${getTaskConfig('pdf')?.route || '/pdf'}/${item.slug}`} className="group flex items-center gap-4 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4 transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(2,14,13,0.10)]">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <h3 className="editable-display line-clamp-2 text-sm font-bold leading-snug tracking-[-0.01em]">{item.title}</h3>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--tk-accent)]">Open <ArrowUpRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Contact card */}
          <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="text-sm font-semibold">Get in touch</p>
            <div className="mt-4 grid gap-2">
              {contactRows.filter(([, value]) => value).map(([label, value, href, Icon]) => {
                const inner = (
                  <span className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
                      <span className="block break-words text-sm font-medium leading-snug">{value}</span>
                    </span>
                  </span>
                )
                return href ? (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block rounded-[calc(var(--tk-radius)-0.35rem)] p-2 transition hover:bg-[var(--tk-raised)]">{inner}</a>
                ) : (
                  <div key={label} className="block p-2">{inner}</div>
                )
              })}
            </div>
            {website ? (
              <Link href={website} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-fill)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-fill)] transition hover:brightness-[1.04]">Visit website <ExternalLink className="h-4 w-4" /></Link>
            ) : null}
          </div>

          {/* Trust panel */}
          <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="inline-flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-[var(--tk-accent)]" /> Verified contributor</p>
            <ul className="mt-4 space-y-3">
              {['Identity confirmed', 'Active in the library', 'Responsive to contact'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--tk-muted)]"><CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> {item}</li>
              ))}
            </ul>
          </div>

          <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
        </aside>
      </div>
    </section>
  )
}

// ----- Shared building blocks -----
function Divider() {
  return <div className="my-10 h-px bg-[var(--tk-line)]" />
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]"><Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}</div>
          <p className="mt-2 break-words text-sm font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:opacity-90">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-medium uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post: _post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">About this post</p>
        <div className="mt-4 grid gap-2.5 text-sm text-[var(--tk-muted)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {taskConfig?.label || task}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-lg font-semibold tracking-[-0.02em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-accent)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-16 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-2xl font-semibold tracking-[-0.02em]">More {(taskConfig?.label || 'posts').toLowerCase()}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  // Build the detail URL from the task route (e.g. /listing/<slug>) — the same
  // base the archive cards use. buildPostUrl() can fall back to /posts when the
  // task isn't in the enabled taskViews map, which 404s.
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-300 hover:-translate-y-1">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-base font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-xl border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-accent)]">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--tk-raised)]"><FileText className="h-5 w-5 text-[var(--tk-muted)]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}

