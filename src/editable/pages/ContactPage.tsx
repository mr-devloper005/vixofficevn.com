'use client'

import { Library, Mail, MessageSquare, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

// Reference-library contact lanes — no directory/profile framing.
const LANES = [
  { icon: Library, title: 'Request a reference', body: 'Looking for a specific guide or report we do not have yet? Tell us and we will track it down.' },
  { icon: Sparkles, title: 'Contribute a reference', body: 'Have something worth adding to the library? Send it over and we will review it for a collection.' },
  { icon: MessageSquare, title: 'Feedback & fixes', body: 'Spot a broken preview or a gap in a collection? Let us know and we will sort it.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-16 sm:py-24`}>
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <EditableReveal index={0}><span className={dc.badge.accentPill}><Mail className="h-3.5 w-3.5" /> {pagesContent.contact.eyebrow}</span></EditableReveal>
              <EditableReveal index={1}><h1 className={`${dc.type.heroTitle} mt-6`}>{pagesContent.contact.title}</h1></EditableReveal>
              <EditableReveal index={2}><p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p></EditableReveal>
              <div className="mt-8 space-y-4">
                {LANES.map((lane, index) => (
                  <EditableReveal key={lane.title} index={index + 1}>
                    <div className={`flex items-start gap-4 ${dc.surface.soft} p-6`}>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]"><lane.icon className="h-5 w-5" /></span>
                      <div>
                        <h2 className="editable-display text-lg font-bold tracking-[-0.02em]">{lane.title}</h2>
                        <p className="mt-1.5 text-sm leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                      </div>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal index={1}>
              <div className={`${dc.surface.card} p-7 sm:p-8`}>
                <h2 className="editable-display text-2xl font-bold tracking-[-0.02em]">{pagesContent.contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
