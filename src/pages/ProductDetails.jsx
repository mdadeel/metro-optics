import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import { formatPrice, calculateDiscount } from '../lib/utils';
import { LENS_TYPES } from '../lib/constants';
import SEO from '../components/SEO';
import {
  buildBreadcrumbSchema,
  buildProductSchema,
  getProductAvailability,
  isDemoCatalog,
} from '../lib/seo';

const detailPanels = [
  { id: 'details', label: 'Details' },
  { id: 'specs', label: 'Specifications' },
];

function RelatedFrameCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="mo-related-card">
      <span className="mo-related-card__image"><img src={product.image || product.images?.[0]} alt={product.name} loading="lazy" /></span>
      <span className="mo-related-card__brand">{product.brand || 'Metro Optics'}</span>
      <strong>{product.name}</strong>
      <span className="mo-related-card__price">{formatPrice(product.price)} <ArrowUpRight size={13} aria-hidden="true" /></span>
    </Link>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const getProductById = useProductStore((state) => state.getProductById);
  const product = getProductById(id);

  if (!product && loading) {
    return (
      <div className="mo-detail-page mo-detail-not-found">
        <SEO title="Loading product" description="Loading product details from the Metro Optics collection." url={`/product/${encodeURIComponent(id)}`} noIndex />
        <p className="mo-eyebrow">LOADING</p>
        <h1 className="mo-display">Finding this frame.</h1>
        <p>Product details are loading. Please wait a moment.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mo-detail-page mo-detail-not-found">
        <SEO title="Frame not found" description="This product could not be found in the Metro Optics collection. Browse the current collection to see available frames." url={`/product/${encodeURIComponent(id)}`} noIndex />
        <p className="mo-eyebrow">NOT FOUND</p>
        <h1 className="mo-display">This frame has moved on.</h1>
        <p>We couldn’t find that style. Take a look at the rest of the collection.</p>
        <Link to="/shop" className="mo-button mo-button--dark">Back to the collection <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return <ProductDetailsContent key={String(product.id)} product={product} products={products} />;
}

function ProductDetailsContent({ product, products }) {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  const [selectedLens, setSelectedLens] = useState(product.lensType || LENS_TYPES[0]);
  const [quantity, setQuantity] = useState(1);
  const [activePanel, setActivePanel] = useState('details');

  const images = useMemo(() => {
    if (product.images?.length) return product.images;
    if (product.image) return [product.image];
    return [];
  }, [product]);
  const discount = calculateDiscount(product.originalPrice, product.price);
  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  const categoryLabel = product.category?.replaceAll('-', ' ') || 'eyewear';
  const productPath = `/product/${encodeURIComponent(product.id)}`;
  const productIsDemo = String(product.id).startsWith('demo-') || isDemoCatalog(products);
  const productDescription = product.description || `Explore ${product.name} in the Metro Optics collection. View the current price and product options before ordering.`;
  const productSchema = productIsDemo ? null : buildProductSchema(product, productPath);
  const productBreadcrumbSchema = productIsDemo
    ? null
    : buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: product.name, path: productPath },
      ]);
  const productAvailability = getProductAvailability(product);
  const isOutOfStock = productAvailability === 'https://schema.org/OutOfStock';
  const sku = product.sku || product.inventory?.sku;

  const handleAddToCart = () => addToCart(product, quantity, { selectedColor, selectedSize, selectedLens });
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="mo-detail-page">
      <SEO
        title={product.name}
        description={productDescription}
        url={productPath}
        image={images[0] || undefined}
        imageAlt={`${product.name} eyewear`}
        type="product"
        noIndex={productIsDemo}
        structuredData={[productSchema, productBreadcrumbSchema]}
      />
      <nav className="mo-detail-crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link><ChevronRight size={13} aria-hidden="true" />
        <Link to="/shop">Shop</Link><ChevronRight size={13} aria-hidden="true" />
        <Link to={`/shop?category=${product.category}`} className="mo-detail-crumbs__category">{categoryLabel}</Link>
        <ChevronRight size={13} aria-hidden="true" /><span>{product.name}</span>
      </nav>

      <div className="mo-detail-layout">
        <section className="mo-detail-gallery" aria-label="Product images">
          <div className="mo-detail-main-image">
            {discount > 0 && <span className="mo-detail-sale">SAVE {discount}%</span>}
            <img src={images[activeImageIndex] || images[0]} alt={product.name} />
            <span className="mo-detail-image-index">{String(activeImageIndex + 1).padStart(2, '0')} <i /> {String(images.length || 1).padStart(2, '0')}</span>
          </div>
          {images.length > 1 && (
            <div className="mo-detail-thumbnails" aria-label="Choose product image">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={activeImageIndex === index ? 'is-active' : ''}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={activeImageIndex === index}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mo-detail-info" aria-labelledby="mo-product-title">
          <div className="mo-detail-overline">
            <span>{product.brand || 'Metro Optics'}</span>
            {productAvailability && (
              <span className={`mo-detail-stock${isOutOfStock ? ' is-unavailable' : ''}`}>
                {!isOutOfStock && <Check size={12} aria-hidden="true" />}
                {isOutOfStock ? 'Currently unavailable' : 'Available now'}
              </span>
            )}
          </div>
          <h1 id="mo-product-title" className="mo-display">{product.name}</h1>
          {sku && <p className="mo-detail-sku">SKU {sku}</p>}

          <div className="mo-detail-price-row">
            <strong>{formatPrice(product.price)}</strong>
            {product.originalPrice > product.price && <del>{formatPrice(product.originalPrice)}</del>}
            {discount > 0 && <span>You save {formatPrice(product.originalPrice - product.price)}</span>}
          </div>
          <p className="mo-detail-description">{product.description}</p>

          {product.colors?.length > 0 && (
            <fieldset className="mo-detail-option">
              <legend>Frame colour <span>{selectedColor}</span></legend>
              <div className="mo-detail-choice-list">
                {product.colors.map((color) => (
                  <button key={color} type="button" className={selectedColor === color ? 'is-selected' : ''} onClick={() => setSelectedColor(color)} aria-pressed={selectedColor === color}>{color}</button>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="mo-detail-option mo-detail-lens-option">
            <legend>Choose your lens <span>{selectedLens}</span></legend>
            <div className="mo-detail-lens-grid">
              {LENS_TYPES.slice(0, 4).map((lens) => (
                <button key={lens} type="button" className={selectedLens === lens ? 'is-selected' : ''} onClick={() => setSelectedLens(lens)} aria-pressed={selectedLens === lens}>
                  <span className="mo-detail-radio"><i /></span><span>{lens}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {product.sizes?.length > 0 && (
            <fieldset className="mo-detail-option">
              <legend>Frame size <span>{selectedSize}</span></legend>
              <div className="mo-detail-choice-list">
                {product.sizes.map((size) => (
                  <button key={size} type="button" className={selectedSize === size ? 'is-selected' : ''} onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size}>{size}</button>
                ))}
                <Link to="/faq" className="mo-detail-size-help"><Ruler size={13} /> Fit guide</Link>
              </div>
            </fieldset>
          )}

          <div className="mo-detail-purchase">
            <div className="mo-detail-quantity" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={14} /></button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
            </div>
            <button type="button" className="mo-detail-add" onClick={handleAddToCart} disabled={isOutOfStock}><ShoppingBag size={16} /> Add to bag</button>
            <button type="button" className="mo-detail-buy" onClick={handleBuyNow} disabled={isOutOfStock}><Zap size={15} /> Buy now</button>
          </div>
          <div className="mo-detail-utility">
            <button type="button" onClick={() => toggleWishlist(product)} aria-pressed={inWishlist} className={inWishlist ? 'is-active' : ''}><Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} /> {inWishlist ? 'Saved to wishlist' : 'Save to wishlist'}</button>
          </div>

          <div className="mo-detail-promises">
            <div><Truck size={17} /><span><strong>Complimentary delivery</strong><small>On orders over $99</small></span></div>
            <div><RotateCcw size={17} /><span><strong>30-day returns</strong><small>Easy, no-stress exchanges</small></span></div>
            <div><ShieldCheck size={17} /><span><strong>Authenticity assured</strong><small>Original frames, always</small></span></div>
          </div>
        </section>
      </div>

      <section className="mo-detail-information" aria-label="Product information">
        <div className="mo-detail-tabs" role="group" aria-label="Product information sections">
          {detailPanels.map((panel) => (
            <button key={panel.id} type="button" className={activePanel === panel.id ? 'is-active' : ''} onClick={() => setActivePanel(panel.id)} aria-pressed={activePanel === panel.id}>
              {panel.label}
            </button>
          ))}
        </div>
        {activePanel === 'details' && (
          <div className="mo-detail-panel">
            <div><p className="mo-eyebrow">DESIGNED WITH INTENTION</p><h2 className="mo-display">A good frame changes everything.</h2></div>
            <div><p>{product.description}</p><p>Made to feel just right from the first wear, with a carefully considered silhouette and everyday comfort at its core. Pair it with your prescription or wear it as is.</p></div>
          </div>
        )}
        {activePanel === 'specs' && (
          product.specs && Object.keys(product.specs).length > 0 ? (
            <div className="mo-detail-specs">
              {Object.entries(product.specs).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </div>
          ) : (
            <p className="mo-detail-empty-specs">Detailed specifications are not available for this frame yet. Contact our team if you need a specific measurement or material detail.</p>
          )
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="mo-related" aria-labelledby="mo-related-title">
          <div className="mo-related__heading"><div><p className="mo-eyebrow">MORE TO LOVE</p><h2 id="mo-related-title" className="mo-display">Similar frames, same feeling.</h2></div><Link to={`/shop?category=${product.category}`}>Explore collection <ArrowRight size={15} /></Link></div>
          <div className="mo-related__grid">{relatedProducts.map((item) => <RelatedFrameCard key={item.id} product={item} />)}</div>
        </section>
      )}
    </div>
  );
}
