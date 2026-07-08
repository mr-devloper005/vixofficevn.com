import { slot4BrandConfig } from '@/editable/theme/brand.config'

const brand = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'A working reference library of guides and reports',
      description:
        'Browse, preview, and download guides, reports, and references — organised into collections built for real work.',
      openGraphTitle: 'A working reference library',
      openGraphDescription:
        'Preview and download guides, reports, and references from a clean, well-organised library.',
      keywords: ['reference library', 'references', 'reports', 'guides', 'downloadable resources'],
    },
    hero: {
      badge: 'The reference library',
      // Second line is rendered with the amber-ink emphasis treatment.
      title: ['Every reference you need,', 'in one calm library.'],
      description:
        'Preview, download, and keep track of the guides, reports, and references that actually move your work forward — no clutter, no noise.',
      primaryCta: { label: 'Browse the library', href: '/pdf' },
      secondaryCta: { label: 'How it works', href: '/about' },
      searchPlaceholder: 'Search references, reports, and collections',
    },
    stats: {
      // Labels only — the values are derived from live data in HomeSections.
      eyebrow: 'Trusted reference',
      items: [
        { key: 'references', label: 'References in the library' },
        { key: 'collections', label: 'Collections' },
        { key: 'updated', label: 'Updated regularly' },
      ],
    },
    intro: {
      badge: 'Why this library',
      title: ['A reference desk that respects', 'your time.'],
      paragraphs: [
        'Instead of scattering references across folders and inboxes, everything lives in one place — previewed, categorised, and ready to download the moment you need it.',
        'Each reference keeps its context: what it covers, how big it is, and where it fits, so you can decide before you open it.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Full in-page reference previews before you download.',
        'Collections that group related references together.',
        'Clean metadata — pages, size, and format at a glance.',
        'A calm reading rhythm designed for real reference work.',
      ],
      primaryLink: { label: 'Open the library', href: '/pdf' },
      secondaryLink: { label: 'Read our story', href: '/about' },
    },
    collections: {
      eyebrow: 'Browse collections',
      title: 'Find references by the way you work.',
      description: 'Jump straight into a collection, or search the full library for a specific reference.',
    },
    process: {
      eyebrow: 'How it works',
      title: 'From search to download in three steps.',
      steps: [
        { title: 'Browse or search', description: 'Scan the library by collection or search for a specific reference.' },
        { title: 'Preview in place', description: 'Open the full reference preview and check it covers what you need.' },
        { title: 'Download & keep', description: 'Grab it in one click and get straight back to work.' },
      ],
    },
    benefits: {
      eyebrow: 'Built for reference',
      title: 'A library that stays out of your way.',
      description: 'Everything here is tuned for one thing: getting you to the right reference, fast.',
      items: [
        { title: 'Preview first', description: 'See the whole reference before you commit to a download.' },
        { title: 'Organised by design', description: 'Collections and categories keep related references together.' },
        { title: 'Always current', description: 'References are refreshed so you are never reading a stale copy.' },
      ],
    },
    latest: {
      eyebrow: 'Fresh in the library',
      title: 'The latest references, added recently.',
      viewAll: 'View the full library',
    },
    faq: {
      eyebrow: 'Good to know',
      title: 'Questions, answered.',
      items: [
        { q: 'What can I find here?', a: 'Downloadable guides, reports, and references, grouped into collections you can browse or search.' },
        { q: 'Can I preview before downloading?', a: 'Yes — every reference opens a full in-page preview so you can check it before you download.' },
        { q: 'How often is the library updated?', a: 'New references are added regularly, and existing references are refreshed to stay current.' },
        { q: 'Do I need an account?', a: 'Browsing and downloading are open. An account lets you submit new references to the library.' },
      ],
    },
    cta: {
      badge: 'Start reading',
      title: ['Open the reference library', 'and find what you came for.'],
      description: 'Preview and download the references that matter — all from one clean, dependable place.',
      primaryCta: { label: 'Browse the library', href: '/pdf' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest references in the library.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A calmer way to keep every reference in one place.',
    description: `${brand} is a working reference library — built to make references, reports, and guides feel organised, previewable, and genuinely easy to use.`,
    paragraphs: [
      'Instead of splitting resources across folders, drives, and inboxes, the library keeps related references together and easy to move through.',
      'Whether you arrive from a search or a collection, you can preview a reference in place and download it without losing your bearings.',
    ],
    values: [
      {
        title: 'Preview-first',
        description: 'We lead with the reference itself — full previews before any download, so you always know what you are getting.',
      },
      {
        title: 'Organised references',
        description: 'Collections and clear metadata keep the library structured, so the right reference is never more than a search away.',
      },
      {
        title: 'Simple and dependable',
        description: 'Clean navigation and predictable page structure help you find and keep useful references faster.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${brand}`,
    title: 'Tell us what reference you are looking for.',
    description:
      'Missing a reference, spotting a gap in a collection, or want to contribute a reference? Send it over and we will route it to the right place.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search guides, reports, and collections across the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find the right reference, faster.',
      description: 'Use keywords, categories, and collections to surface references from across the reference library.',
      placeholder: 'Search by title, topic, or collection',
    },
    resultsTitle: 'Matching references',
  },
  create: {
    metadata: {
      title: 'Submit a reference',
      description: 'Add a new reference to the reference library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to add a reference.',
      description: 'Use your account to open the submission workspace and add a reference to the reference library.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Add a reference to the library.',
      description: 'Choose the type, add the details, and prepare a clean entry with an upload, summary, and body content.',
    },
    formTitle: 'Reference details',
    submitLabel: 'Submit reference',
    successTitle: 'Reference submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the reference library.',
      badge: 'Member access',
      title: 'Welcome back to the library.',
      description: 'Sign in to keep browsing, manage your submissions, and add new references from your account.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Signed in. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account for the reference library.',
      badge: 'Get started',
      title: 'Create your account and start contributing.',
      description: 'Create an account to open the submission workspace, save details, and add references to the library.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related references',
      fallbackTitle: 'Reference details',
    },
    listing: {
      relatedTitle: 'Related references',
      fallbackTitle: 'Reference details',
    },
    image: {
      relatedTitle: 'Related references',
      fallbackTitle: 'Reference details',
    },
    profile: {
      relatedTitle: 'From the library',
      fallbackDescription: 'Details will appear here once available.',
      visitButton: 'Visit website',
    },
  },
} as const
