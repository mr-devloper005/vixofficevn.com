import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A working reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Reference Library',
    // Nav stays clean — no task-archive links. Static pages only.
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Submit', href: '/create' },
    },
  },
  footer: {
    tagline: 'A curated home for references and reports',
    description:
      'A working reference library — download guides, reports, and references, organised into collections you can actually use.',
    columns: [
      {
        title: 'Discover',
        links: [{ label: 'Reference Library', href: '/pdf' }],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    cta: {
      title: 'Get new references in your inbox',
      description: 'A short note whenever fresh references and collections are added to the library.',
      placeholder: 'you@example.com',
      button: 'Subscribe',
    },
    bottomNote: 'Built for clean discovery and dependable reference.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
