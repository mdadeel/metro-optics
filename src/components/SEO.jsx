import { Helmet } from 'react-helmet-async';
import {
  absoluteSiteUrl,
  canonicalSiteUrl,
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
} from '../lib/seo';

const DEFAULT_DESCRIPTION =
  'Explore eyeglasses, sunglasses and everyday frames from Metro Optics. Review available styles, product details and current prices before choosing your next pair.';
const DEFAULT_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

function formatMetaDescription(value) {
  const cleaned = String(value || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 160) return cleaned;
  const shortened = cleaned.slice(0, 157);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 120 ? lastSpace : 157).trim()}…`;
}

function safeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export default function SEO({
  title,
  description,
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = 'Metro Optics eyewear',
  url,
  type = 'website',
  noIndex = false,
  robots,
  structuredData,
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Eyeglasses & Sunglasses`;
  const metaDescription = formatMetaDescription(description);
  const canonicalUrl = canonicalSiteUrl(url);
  const imageUrl = absoluteSiteUrl(image);
  const robotsContent = robots || (noIndex ? 'noindex,follow' : DEFAULT_ROBOTS);
  const schemas = (Array.isArray(structuredData) ? structuredData : [structuredData]).filter(Boolean);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {schemas.map((schema, index) => (
        <script
          key={`${schema['@type'] || 'schema'}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
      ))}
    </Helmet>
  );
}
