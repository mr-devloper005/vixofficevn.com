import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export default function AboutPage() {
  const about = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className={`${dc.shell.section} py-16 sm:py-24`}>
          <div className="max-w-3xl">
            <EditableReveal index={0}><span className={dc.badge.accentPill}>{about.badge}</span></EditableReveal>
            <EditableReveal index={1}><h1 className={`${dc.type.heroTitle} mt-6`}>About {SITE_CONFIG.name}</h1></EditableReveal>
            <EditableReveal index={2}><p className="mt-6 text-[1.125rem] leading-[1.7] text-[var(--slot4-muted-text)]">{about.description}</p></EditableReveal>
          </div>
        </section>

        {/* Story + checklist band */}
        <section className="bg-[var(--slot4-panel-bg)]">
          <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                {about.paragraphs.map((paragraph, index) => (
                  <EditableReveal key={paragraph} index={index}>
                    <p className="max-w-xl text-[1.0625rem] leading-[1.75] text-[var(--slot4-muted-text)]">{paragraph}</p>
                  </EditableReveal>
                ))}
                <EditableReveal index={2}>
                  <Link href="/pdf" className={`${dc.button.primary} mt-2`}>Open the library <ArrowRight className="h-4 w-4" /></Link>
                </EditableReveal>
              </div>
              <EditableReveal index={1}>
                <div className={`${dc.surface.card} p-8`}>
                  <span className={dc.type.eyebrow}>What we value</span>
                  <ul className="mt-6 space-y-6">
                    {about.values.map((value) => (
                      <li key={value.title} className="flex items-start gap-4">
                        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]"><Check className="h-4 w-4" /></span>
                        <div>
                          <h2 className="editable-display text-lg font-bold tracking-[-0.02em]">{value.title}</h2>
                          <p className="mt-1.5 text-sm leading-6 text-[var(--slot4-muted-text)]">{value.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </EditableReveal>
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
          <div className={`${dc.shell.section} flex flex-col items-center gap-6 py-16 text-center sm:py-20`}>
            <h2 className="editable-display max-w-2xl text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.02] tracking-[-0.03em]">Find your next reference.</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/pdf" className={dc.button.primary}>Browse the library <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Contact us</Link>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
