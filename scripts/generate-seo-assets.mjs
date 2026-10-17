import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { loadEnv } from 'vite'

const root = process.cwd()
const publicDir = resolve(root, 'public')
const env = { ...loadEnv('production', root, 'VITE_'), ...process.env }
const DEFAULT_SITE_ORIGIN = 'https://metro-optics.vercel.app'
const rawSiteUrl = env.VITE_APP_URL || DEFAULT_SITE_ORIGIN

function normalizePublicOrigin(value) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`VITE_APP_URL must be an absolute public origin. Received: ${value}`)
  }

  if (url.protocol !== 'https:' || /localhost|127\.0\.0\.1/i.test(url.hostname)) {
    throw new Error('Production SEO assets require a public HTTPS VITE_APP_URL (not localhost).')
  }
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_APP_URL must be the site origin only, for example https://metro-optics.vercel.app.')
  }

  return url.origin
}

function isConfigured(value) {
  return Boolean(value) && !/(your_|placeholder|undefined)/i.test(value)
}

function hasLiveCatalogConfig() {
  return [env.VITE_FIREBASE_API_KEY, env.VITE_FIREBASE_AUTH_DOMAIN, env.VITE_FIREBASE_PROJECT_ID]
    .every(isConfigured)
}

const siteOrigin = normalizePublicOrigin(rawSiteUrl)
const liveCatalog = hasLiveCatalogConfig()
const publicPages = [
  ...(liveCatalog ? [{ path: '/', priority: '1.0' }, { path: '/shop', priority: '0.9' }] : []),
  { path: '/about', priority: '0.6' },
  { path: '/contact', priority: '0.6' },
  { path: '/faq', priority: '0.7' },
]

// Product URLs are intentionally not guessed from demo data. Add the live public
// catalog feed or a prerender/export step before listing product-detail URLs.
const sitemapUrls = publicPages
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.map(({ path, priority }) => [
    '  <url>',
    `    <loc>${siteOrigin}${path === '/' ? '/' : path}</loc>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n')

const robots = [
  '# Search engines and AI crawlers are allowed to crawl public content.',
  '# Private-route rules are crawl guidance, not access control.',
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin',
  'Disallow: /seed-data',
  'Disallow: /profile',
  'Disallow: /cart',
  'Disallow: /checkout',
  'Disallow: /invoice/',
  'Disallow: /order-confirmation',
  'Disallow: /login',
  'Disallow: /register',
  'Disallow: /forgot-password',
  'Disallow: /track-order',
  '',
  `Sitemap: ${siteOrigin}/sitemap.xml`,
  '',
].join('\n')

const llmsPages = liveCatalog
  ? [
      `- [Shop eyewear](${siteOrigin}/shop): Browse the current collection and open a product page for live price and availability.`,
      `- [Frequently asked questions](${siteOrigin}/faq): Answers about ordering, lens options, delivery, returns and support.`,
      `- [Contact Metro Optics](${siteOrigin}/contact): Current contact details and support options.`,
      `- [About Metro Optics](${siteOrigin}/about): The store's approach to eyewear and customer guidance.`,
    ]
  : [
      `- [Frequently asked questions](${siteOrigin}/faq): Answers about ordering, lens options, delivery, returns and support.`,
      `- [Contact Metro Optics](${siteOrigin}/contact): Current contact details and support options.`,
      `- [About Metro Optics](${siteOrigin}/about): The store's approach to eyewear and customer guidance.`,
    ]

const llms = [
  '# Metro Optics',
  '',
  '> Eyewear storefront for eyeglasses, sunglasses and everyday frames.',
  '',
  'Use the linked pages as the source of truth. Product prices, colors, sizes and availability can change; rely on the current product page rather than copied summaries.',
  'For prescription or clinical vision questions, consult a qualified eye-care professional.',
  '',
  '## Public pages',
  ...llmsPages,
  '',
  '## Site map',
  `- [XML sitemap](${siteOrigin}/sitemap.xml)`,
  '',
].join('\n')

await mkdir(publicDir, { recursive: true })
await Promise.all([
  writeFile(resolve(publicDir, 'robots.txt'), robots, 'utf8'),
  writeFile(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8'),
  writeFile(resolve(publicDir, 'llms.txt'), llms, 'utf8'),
])

console.log(`Generated robots.txt, sitemap.xml and llms.txt for ${siteOrigin}${liveCatalog ? ' (live catalog configured)' : ' (demo catalog; product pages omitted)'}.`)
