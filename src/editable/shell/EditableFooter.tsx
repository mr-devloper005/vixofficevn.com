'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const footer = globalContent.footer
  // Discovery columns come from content — they surface ONLY the Reference
  // Library, never profiles.
  const columns = footer.columns
  const accountLinks = session
    ? [{ label: 'Submit a reference', href: '/create' }]
    : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }]

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-start gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-14">
          <div className="max-w-xl">
            <h2 className="editable-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              {footer.cta.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/70">{footer.cta.description}</p>
          </div>
          <form action="/signup" className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 pl-5">
            <Mail className="h-4 w-4 shrink-0 text-white/60" />
            <input
              name="email"
              type="email"
              placeholder={footer.cta.placeholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
            />
            <button className="shrink-0 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-[1.04]">
              {footer.cta.button}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center  border border-white/20 bg-white/5">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
            </span>
            <span className="editable-display text-xl font-bold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">{footer.description}</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{column.title}</h3>
            <div className="mt-5 grid gap-3">
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white">
                  {link.label} <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">Account</h3>
          <div className="mt-5 grid gap-3">
            {accountLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-white/70 transition hover:text-white">{link.label}</Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="text-left text-sm text-white/70 transition hover:text-white">Logout</button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-center justify-between gap-2 text-xs text-white/55 sm:flex-row">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span>{footer.bottomNote}</span>
        </div>
      </div>
    </footer>
  )
}
