import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  Glasses,
  Heart,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';
import { CATEGORIES, BRANDS } from '../lib/constants';
import { formatPrice } from '../lib/utils';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import NewsletterSection from '../components/home/NewsletterSection';
import SEO from '../components/SEO';
import { buildWebPageSchema, isDemoCatalog } from '../lib/seo';

const categoryCards = [
  { id: 'sunglasses', number: '01', kicker: 'MADE FOR THE SUN', title: 'Sunglasses' },
  { id: 'optical', number: '02', kicker: 'YOUR EVERYDAY ICON', title: 'Optical frames' },
  { id: 'blue-light', number: '03', kicker: 'EYES ON THE SCREEN', title: 'Blue light' },
  { id: 'reading', number: '04', kicker: 'A CLOSER LOOK', title: 'Reading glasses' },
];

const productTabs = [
  { label: 'All favourites', value: 'all' },
  { label: 'Optical', value: 'optical' },
  { label: 'Sunglasses', value: 'sunglasses' },
  { label: 'Blue light', value: 'blue-light' },
];

function SectionHeading({ eyebrow, title, description, action, actionLabel = 'Shop all' }) {
  return (
    <div className="mo-section-heading">
      <div className="mo-section-heading__copy">
        {eyebrow && <p className="mo-eyebrow">{eyebrow}</p>}
        <h2 className="mo-display">{title}</h2>
        {description && <p className="mo-section-heading__description">{description}</p>}
      </div>
      {action && (
        <Link to={action} className="mo-text-link">
          {actionLabel}
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      )}
    </div>
  );
}

function PremiumProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const saved = isInWishlist(product.id);
  const image = product.image || product.images?.[0];
  const productCategory = product.category?.replaceAll('-', ' ') || 'Eyewear';

  return (
    <article className="mo-product-card">
      <div className="mo-product-card__visual">
        <Link to={`/product/${product.id}`} className="mo-product-card__image-link" aria-label={`View ${product.name}`}>
          <img src={image} alt={product.name} loading="lazy" />
        </Link>
        <div className="mo-product-card__badges">
          {product.tags?.includes('new') && <span className="mo-product-badge mo-product-badge--new">Just in</span>}
          {product.tags?.includes('bestseller') && <span className="mo-product-badge">Bestseller</span>}
        </div>
        <button
          type="button"
          className={`mo-product-card__save${saved ? ' is-saved' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={saved}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="mo-product-card__details">
        <div className="mo-product-card__meta">
          <span>{product.brand || 'Metro Optics'}</span>
        </div>
        <Link to={`/product/${product.id}`} className="mo-product-card__name">
          {product.name}
        </Link>
        <div className="mo-product-card__bottom">
          <div className="mo-product-card__price">
            <span>{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && <del>{formatPrice(product.originalPrice)}</del>}
          </div>
          <span className="mo-product-card__category">{productCategory}</span>
        </div>
        <button type="button" className="mo-product-card__add" onClick={() => addToCart(product, 1)}>
          <ShoppingBag size={15} aria-hidden="true" />
          Add to bag
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const products = useProductStore((state) => state.products);
  const [activeTab, setActiveTab] = useState('all');

  const featuredProducts = useMemo(() => {
    const featured = products.filter((product) => product.isFeatured || product.tags?.includes('bestseller'));
    const source = featured.length ? featured : products;
    const filtered = activeTab === 'all'
      ? source
      : source.filter((product) => product.category === activeTab);
    const fallback = activeTab === 'all' ? source : products.filter((product) => product.category === activeTab);
    return (filtered.length ? filtered : fallback).slice(0, 4);
  }, [activeTab, products]);

  const categoryById = (id) => CATEGORIES.find((category) => category.id === id);
  const sunglasses = categoryById('sunglasses');
  const homeDescription = 'Shop eyeglasses, sunglasses, blue-light and reading frames from Metro Optics. Explore available styles, product details and support for finding a fit.';
  const homeSchema = buildWebPageSchema({
    name: 'Eyeglasses & Sunglasses | Metro Optics',
    description: homeDescription,
    path: '/',
  });

  return (
    <div className="mo-home">
      <SEO
        title="Eyeglasses & Sunglasses"
        description={homeDescription}
        image="/metro-optics-og.jpg"
        imageAlt="Metro Optics eyewear editorial campaign"
        url="/"
        noIndex={isDemoCatalog(products)}
        structuredData={isDemoCatalog(products) ? null : homeSchema}
      />
      <div className="mo-page-width">
        <section className="mo-hero" aria-labelledby="mo-hero-title">
          <div className="mo-hero__copy">
            <p className="mo-eyebrow"><span className="mo-eyebrow__dot" /> THE FRAME EDIT · 2026</p>
            <h1 id="mo-hero-title" className="mo-display">A clearer view<br />of <em>your</em> world.</h1>
            <p className="mo-hero__description">
              Find the frames that feel like you. Thoughtful design, beautiful materials, and lenses made for real life.
            </p>
            <div className="mo-hero__actions">
              <Link to="/shop" className="mo-button mo-button--dark">
                Find your frames <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link to="/shop?category=sunglasses" className="mo-button mo-button--quiet">Explore sunglasses</Link>
            </div>
            <div className="mo-hero__note">
              <div className="mo-hero__note-icon"><Glasses size={17} aria-hidden="true" /></div>
              <p><strong>Made to be yours.</strong><span>Easy to wear. Hard to forget.</span></p>
            </div>
          </div>
          <div className="mo-hero__visual">
            <img src="/metro-hero.webp" alt="A woman wearing warm amber Metro Optics eyeglasses" width="1264" height="848" fetchPriority="high" decoding="async" />
            <div className="mo-hero__edition"><Sparkles size={14} aria-hidden="true" /><span>New season<br /><strong>in focus</strong></span></div>
            <div className="mo-hero__caption"><span>01 / 04</span><span>THE EVERYDAY ICONS</span></div>
          </div>
          <span className="mo-hero__grain" aria-hidden="true" />
        </section>

        <section className="mo-benefits" aria-label="Shopping benefits">
          <div className="mo-benefit">
            <span className="mo-benefit__icon"><Truck size={19} aria-hidden="true" /></span>
            <div><strong>Complimentary delivery</strong><span>On orders over $99</span></div>
          </div>
          <div className="mo-benefit">
            <span className="mo-benefit__icon"><BadgeCheck size={19} aria-hidden="true" /></span>
            <div><strong>Expertly made lenses</strong><span>Precision in every pair</span></div>
          </div>
          <div className="mo-benefit">
            <span className="mo-benefit__icon"><RotateCcw size={19} aria-hidden="true" /></span>
            <div><strong>Easy 30-day returns</strong><span>Find the right fit, risk-free</span></div>
          </div>
          <div className="mo-benefit">
            <span className="mo-benefit__icon"><ShieldCheck size={19} aria-hidden="true" /></span>
            <div><strong>Authenticity, assured</strong><span>Only original eyewear</span></div>
          </div>
        </section>

        <section className="mo-categories mo-section" aria-labelledby="mo-categories-title">
          <SectionHeading
            eyebrow="A FRAME FOR EVERY YOU"
            title="Find your point of view."
            description="A little structure, a lot of personality. Start with a style that speaks to you."
            action="/shop"
            actionLabel="Explore all styles"
          />
          <div className="mo-category-grid">
            {categoryCards.map((card) => {
              const category = categoryById(card.id);
              if (!category) return null;
              return (
                <Link key={card.id} to={`/shop?category=${category.slug}`} className={`mo-category-card mo-category-card--${card.id}`}>
                  <img src={category.featuredImage} alt="" loading="lazy" />
                  <span className="mo-category-card__number">{card.number}</span>
                  <div className="mo-category-card__content">
                    <span className="mo-category-card__kicker">{card.kicker}</span>
                    <h3>{card.title}</h3>
                  </div>
                  <span className="mo-category-card__arrow"><ArrowUpRight size={19} aria-hidden="true" /></span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mo-products mo-section" aria-labelledby="mo-products-title">
          <SectionHeading
            eyebrow="THE ONES YOU LOVE"
            title="Consider this your shortlist."
            description="Thoughtfully chosen frames, with good looks built in."
            action="/shop"
            actionLabel="Shop all eyewear"
          />
          <div className="mo-product-toolbar">
            <div className="mo-product-tabs" role="group" aria-label="Filter featured frames">
              {productTabs.map((tab) => (
                <button
                  type="button"
                  key={tab.value}
                  className={`mo-product-tab${activeTab === tab.value ? ' is-active' : ''}`}
                  onClick={() => setActiveTab(tab.value)}
                  aria-pressed={activeTab === tab.value}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Link to="/shop?sort=newest" className="mo-product-toolbar__more">See what’s new <ChevronRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="mo-product-grid">
            {featuredProducts.map((product) => <PremiumProductCard key={product.id} product={product} />)}
          </div>
        </section>

        <section className="mo-lookbook" aria-label="Sunglasses collection">
          <div className="mo-lookbook__image">
            <img src={sunglasses?.featuredImage} alt="A look from the Metro Optics sunglasses collection" loading="lazy" />
            <span className="mo-lookbook__stamp">SUN<br />STUDY<br /><strong>№ 02</strong></span>
          </div>
          <div className="mo-lookbook__copy">
            <p className="mo-eyebrow">A LITTLE MORE SUN, PLEASE</p>
            <h2 className="mo-display">Out of office.<br /><em>Into the light.</em></h2>
            <p>Good sunglasses do more than finish a look. Meet your new favourite pair, with UV protection that works as hard as you do.</p>
            <Link to="/shop?category=sunglasses" className="mo-button mo-button--light">
              Shop the sun edit <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <span className="mo-lookbook__index">METRO OPTICS — SUMMER / 26</span>
          </div>
        </section>

        <section className="mo-brands mo-section" aria-labelledby="mo-brands-title">
          <div className="mo-brands__intro">
            <p className="mo-eyebrow">GOOD COMPANY</p>
            <h2 id="mo-brands-title" className="mo-display">The names you know.<br /><em>The quality you feel.</em></h2>
          </div>
          <div className="mo-brands__list" aria-label="Featured eyewear brands">
            {BRANDS.slice(0, 6).map((brand, index) => (
              <Link to={`/shop?brand=${encodeURIComponent(brand)}`} key={brand} className={`mo-brand-name mo-brand-name--${index + 1}`}>
                {brand}
              </Link>
            ))}
          </div>
          <Link to="/shop" className="mo-brands__link">Discover all brands <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </section>

        <section className="mo-fit-banner" aria-labelledby="mo-fit-title">
          <div className="mo-fit-banner__mark"><Glasses size={26} aria-hidden="true" /></div>
          <div className="mo-fit-banner__copy">
            <p className="mo-eyebrow">A BETTER FIT STARTS HERE</p>
            <h2 id="mo-fit-title" className="mo-display">Not sure what suits you?</h2>
            <p>Our frame guide makes choosing a little easier. Discover shapes, sizes, and the small details that make a big difference.</p>
          </div>
          <Link to="/faq" className="mo-fit-banner__link">Read the frame guide <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <span className="mo-fit-banner__ornament" aria-hidden="true">M/O</span>
        </section>

        <NewsletterSection />
      </div>
    </div>
  );
}
