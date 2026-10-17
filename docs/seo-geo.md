# SEO, GEO and AEO implementation

This implementation follows the current `seo-geo` guidance from `aaron-he-zhu/aaron-marketing-skills` (the linked standalone repository now points to that active bundle), especially `geo-content-optimizer`, `serp-markup-builder`, `technical-seo-checker` and `site-structure-optimizer`.

## Shipped

- Page-specific titles, concise descriptions, canonical URLs, Open Graph/Twitter cards and robots directives for storefront routes.
- Organization and WebSite JSON-LD in the initial HTML; page-specific Product, CollectionPage/ItemList, BreadcrumbList, AboutPage, ContactPage and FAQPage JSON-LD is emitted with the corresponding visible route content.
- Search URLs use `/shop?q=...`, matching the WebSite `SearchAction` target. Search result pages are `noindex` and canonicalize to `/shop`.
- Private/account, cart, checkout, invoice, order-confirmation, tracking, authentication and not-found routes are `noindex`. `/admin/` and development seeding paths are excluded in `robots.txt`.
- `robots.txt` allows search engines and AI crawlers to access public content by default. AI training crawlers are included; private routes are disallowed as crawl guidance only, not access control.
- `sitemap.xml` lists only stable public routes. It adds the home/shop routes when Firebase catalog configuration is present; dynamic product URLs are deliberately not guessed from the demo catalog.
- `llms.txt` points answer engines to the public help, contact and about pages (and the live shop when configured). Treat `llms.txt` as an inexpensive discovery convention, not a proven ranking or citation signal.
- Product structured data reflects the displayed price/currency and only catalog-supplied images, descriptions, brand, category, SKU and stock state. It does not invent item condition, ratings, review counts or shipping/return terms; the storefront no longer shows the former default-star/default-review placeholders.
- Customer and admin route components are lazy-loaded to keep the initial JavaScript chunks smaller. The generated hero is served as a 36 KB WebP instead of a 2.1 MB PNG; the 1200×630 social preview and Geist font files are separately optimized/self-hosted.

## Required production configuration

Set `VITE_APP_URL` to the confirmed canonical origin `https://metro-optics.vercel.app` (or a later verified custom domain), with no path or route. The production build generates the root `robots.txt`, `sitemap.xml` and `llms.txt` from that origin. A development or local origin is rejected by the SEO asset generator.

The catalog is indexable only when the production build has valid `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN` and `VITE_FIREBASE_PROJECT_ID` values and the public catalog actually returns non-demo products. Without a live catalog, product/shop routes stay noindex and the sitemap omits them. The customer product store is hydrated from the existing Firestore product collection; an empty/error result does not fall back to listing demo products as indexable inventory.

## Important launch limitation

Metro Optics is currently a Vite client-rendered React app. Route-level Helmet tags and Product/FAQ JSON-LD are inserted after JavaScript runs. The initial HTML has site-level identity metadata and JSON-LD, but it does not contain each route's rendered body, product details or route-specific head tags. Google can render many JavaScript pages, but some AI answer crawlers do not. **Reliable indexing and citations for product pages therefore still need server rendering or static prerendering from the real public catalog, plus product URLs in the sitemap.** Do not publish the demo product records as a substitute.

The current data does not establish a verified public storefront address, coordinates, sameAs profiles, or an independently sourced review feed, so this work intentionally avoids LocalBusiness/GeoCoordinates, social-profile, Review and AggregateRating schema. Confirm those business facts before adding local SEO markup. Likewise, FAQPage markup matches the visible answers but should not be shipped with an expectation of Google FAQ rich results; the current skill guidance says those results were retired for most sites.

## Post-deploy checklist

1. Confirm the canonical hostname and HTTPS redirect; update `VITE_APP_URL` to the final origin.
2. Verify the raw HTML and rendered DOM for `/`, `/shop`, a real `/product/:id`, `/about`, `/contact` and `/faq`.
3. Validate JSON-LD with Schema.org Validator and Google's rich-result tooling where eligible; check Search Console and Bing Webmaster Tools for indexing and sitemap errors.
4. Submit the generated sitemap, check that public product pages are indexable, and ensure private routes remain `noindex` and access-controlled.
5. Check PageSpeed Insights / CrUX and actual image delivery after deployment. Build/lint success is not a Core Web Vitals measurement.
6. Verify the generated crawler rules after deploy. The current policy allows AI crawlers, and robots directives are crawl instructions, not access control.
