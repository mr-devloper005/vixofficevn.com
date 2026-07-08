'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

// The public submission surface centres on the Reference Library. Other task
// types stay functional in code but are not promoted here.
const SUBMISSION_TASK: TaskKey = 'pdf'

const fieldClass = 'w-full rounded-[0.75rem] border border-[color:rgba(2,14,13,0.16)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task: SUBMISSION_TASK,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.shell.section} py-16 sm:py-24`}>
            <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <div className="flex h-full min-h-72 items-center justify-center rounded-[1.5rem] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
                <Lock className="h-20 w-20 opacity-80" />
              </div>
              <div>
                <span className={dc.badge.accentPill}>{pagesContent.create.locked.badge}</span>
                <h1 className={`${dc.type.heroTitle} mt-6`}>{pagesContent.create.locked.title}</h1>
                <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>Sign in <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className={dc.button.secondary}>Get started</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-14 sm:py-20`}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <span className={dc.badge.accentPill}>{pagesContent.create.hero.badge}</span>
              <h1 className={`${dc.type.heroTitle} mt-6`}>{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
              <div className={`mt-8 ${dc.surface.soft} p-6`}>
                <p className="text-sm font-semibold">A good reference entry includes</p>
                <ul className="mt-4 space-y-2.5 text-sm text-[var(--slot4-muted-text)]">
                  {['A clear, descriptive title', 'A collection or category', 'A short summary of what it covers', 'The source link or upload'].map((item) => (
                    <li key={item} className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" /> {item}</li>
                  ))}
                </ul>
              </div>
            </aside>

            <form onSubmit={submit} className={`${dc.surface.card} p-6 sm:p-8`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="editable-display text-2xl font-bold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                <span className="rounded-full bg-[var(--slot4-accent-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-accent-strong)]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Reference title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Collection or category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Source or download URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Cover image URL (optional)" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, or notes" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-[0.75rem] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className={`${dc.button.primary} mt-6 w-full`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
