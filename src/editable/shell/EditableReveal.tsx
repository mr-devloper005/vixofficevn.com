'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

/*
  Scroll-reveal wrapper — IntersectionObserver-driven fade + slide-up.

  The hidden state is only applied AFTER mount (via the `editable-reveal-ready`
  class added to <html>), so visitors with JS disabled always see fully
  rendered content. Per-item stagger comes from `index` → transitionDelay.
  A `prefers-reduced-motion` guard in editable-global.css disables the motion.
*/

let readyFlagged = false

export function EditableReveal({
  children,
  as: Tag = 'div',
  index = 0,
  className = '',
  delayStep = 90,
  maxDelay = 640,
}: {
  children: ReactNode
  as?: ElementType
  index?: number
  className?: string
  delayStep?: number
  maxDelay?: number
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!readyFlagged) {
      // Flag the document once so the hidden pre-state only exists with JS on.
      document.documentElement.classList.add('editable-reveal-ready')
      readyFlagged = true
    }

    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const delay = Math.min(index * delayStep, maxDelay)

  return (
    <Tag
      ref={ref}
      className={`editable-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
