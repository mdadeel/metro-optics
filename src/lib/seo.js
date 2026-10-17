export const SITE_NAME = 'Metro Optics';
export const DEFAULT_SITE_ORIGIN = 'https://metro-optics.vercel.app';
export const SITE_ORIGIN = normalizeOrigin(import.meta.env.VITE_APP_URL || DEFAULT_SITE_ORIGIN);
export const DEFAULT_SOCIAL_IMAGE = '/metro-optics-og.jpg';

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return DEFAULT_SITE_ORIGIN;
  }
}

export function absoluteSiteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.startsWith('/') ? path : `/${path}`, `${SITE_ORIGIN}/`).toString();
}

export function canonicalSiteUrl(path) {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonicalPath = String(currentPath).split(/[?#]/, 1)[0] || '/';
  const normalizedPath = canonicalPath === '/' ? '/' : canonicalPath.replace(/\/+$/, '');
  return absoluteSiteUrl(normalizedPath);
}

export function buildWebPageSchema({ name, description, path = '/', type = 'WebPage' }) {
  const url = canonicalSiteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    inLanguage: 'en',
  };
}

export function buildBreadcrumbSchema(items = []) {
  const itemListElement = items
    .filter((item) => item?.name)
    .map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: canonicalSiteUrl(item.path) } : {}),
    }));

  if (!itemListElement.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export function getProductAvailability(product) {
  if (!product) return null;
  if (typeof product.inStock === 'boolean') {
    return product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  }

  const stock = product.stock ?? product.inventory?.stock;
  if (stock !== null && stock !== undefined && stock !== '' && Number.isFinite(Number(stock))) {
    return Number(stock) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  }

  return null;
}

export function buildProductSchema(product, path) {
  if (!product?.name) return null;

  const images = [...new Set([...(product.images || []), product.image].filter(Boolean))]
    .map((image) => absoluteSiteUrl(image));
  const price = Number(product.price);
  const sku = product.sku || product.inventory?.sku;
  const offer = Number.isFinite(price) && price > 0
    ? {
        '@type': 'Offer',
        url: canonicalSiteUrl(path),
        priceCurrency: 'USD',
        price: price.toFixed(2),
        ...(getProductAvailability(product) ? { availability: getProductAvailability(product) } : {}),
      }
    : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${canonicalSiteUrl(path)}#product`,
    name: product.name,
    ...(images.length ? { image: images } : {}),
    ...(product.description ? { description: product.description } : {}),
    ...(sku ? { sku: String(sku) } : {}),
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
    ...(product.category ? { category: product.category } : {}),
    ...(offer ? { offers: offer } : {}),
    mainEntityOfPage: canonicalSiteUrl(path),
  };
}

export function buildItemListSchema(products = [], { path = '/shop', startPosition = 1 } = {}) {
  const itemListElement = products
    .filter((product) => product?.id != null && product?.name)
    .map((product, index) => {
      const productPath = `/product/${encodeURIComponent(product.id)}`;
      return {
        '@type': 'ListItem',
        position: startPosition + index,
        url: canonicalSiteUrl(productPath),
        item: {
          '@type': 'Product',
          name: product.name,
          url: canonicalSiteUrl(productPath),
          ...(product.image || product.images?.[0]
            ? { image: absoluteSiteUrl(product.image || product.images[0]) }
            : {}),
        },
      };
    });

  if (!itemListElement.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalSiteUrl(path)}#collection`,
    url: canonicalSiteUrl(path),
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListUnordered',
      numberOfItems: itemListElement.length,
      itemListElement,
    },
  };
}

export function isDemoCatalog(products = []) {
  return products.length === 0 || products.every((product) => String(product?.id || '').startsWith('demo-'));
}
