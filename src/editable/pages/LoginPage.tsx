import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</p>
            <h1 className="editable-display mt-4 max-w-xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.04em]">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-[1.0625rem] leading-[1.7] text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_24px_60px_rgba(2,14,13,0.08)] sm:p-9">
            <h2 className="editable-display text-2xl font-bold tracking-[-0.02em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">New here? <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
