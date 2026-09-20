import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Zap,
  GitCompare,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
} from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import ProductCard from '../components/product/ProductCard';
import ProductQuickView from '../components/product/ProductQuickView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useWishlistStore } from '../../src/stores/useWishlistStore';
import { useCompareStore } from '../../src/stores/useCompareStore';
import { formatPrice, calculateDiscount } from '../lib/utils';
import { LENS_TYPES } from '../lib/constants';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, products } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCompare, isInCompare } = useCompareStore();

  const product = getProductById(id) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    () => product?.colors?.[0] || 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState(
    () => product?.sizes?.[0] || 'Standard'
  );
  const [selectedLens, setSelectedLens] = useState('Standard Clear');
  const [quantity, setQuantity] = useState(1);

  const images = useMemo(() => {
    if (product?.images && product.images.length > 0) return product.images;
    if (product?.image) return [product.image];
    return ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'];
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black mb-2">Eyewear Model Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">The requested product could not be located.</p>
        <Link to="/shop" className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.originalPrice, product.price);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, { selectedColor, selectedSize });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, { selectedColor, selectedSize });
    navigate('/checkout');
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 5);

  return (
    <div className="max-w-[1320px] mx-auto px-4 py-6 space-y-10">
      {/* Breadcrumb Trail */}
      <Breadcrumb
        items={[
          { label: 'Shop', to: '/shop' },
          { label: product.category, to: `/shop?category=${product.category}` },
          { label: product.name },
        ]}
      />

      {/* Main Product Layout (Gallery + Buying Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md">
            {discount > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-accent text-white text-xs font-black px-2.5 py-1 rounded shadow">
                Save {discount}%
              </span>
            )}
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnail List */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-primary shadow-sm scale-105'
                      : 'border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchasing Panel (7 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header info */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                {product.brand} Official
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                <span>In Stock & Ready</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {product.rating} ({product.reviews || 48} verified reviews)
              </span>
              <span>•</span>
              <span>SKU: {product.sku || 'MO-RB-3025'}</span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl flex items-baseline gap-3">
            <span className="text-3xl font-black text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                Save ${Math.round(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-2">
                Frame Color: <span className="text-primary font-semibold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      selectedColor === color
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary/50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lens Type Selection */}
          <div>
            <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-2">
              Lens Configuration:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LENS_TYPES.slice(0, 4).map((lens) => (
                <button
                  key={lens}
                  onClick={() => setSelectedLens(lens)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all ${
                    selectedLens === lens
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {lens}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-2">
                Bridge & Lens Sizing:
              </label>
              <div className="flex gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      selectedSize === sz
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden self-start">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-black min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            {/* Buy Now Fast Checkout */}
            <button
              onClick={handleBuyNow}
              className="py-3.5 px-6 bg-accent hover:bg-accent-hover text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 border rounded-xl transition-all ${
                inWishlist
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-accent'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Compare Icon */}
            <button
              onClick={() => addToCompare(product)}
              className={`p-3.5 border rounded-xl transition-all ${
                inCompare
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary'
              }`}
              aria-label="Compare"
            >
              <GitCompare className="w-5 h-5" />
            </button>
          </div>

          {/* Guarantee Highlights */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2 text-[11px] text-gray-500 text-center">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-primary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Rx Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Description, Specifications, Reviews) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <Tabs defaultValue="specs">
          <TabsList className="mb-6">
            <TabsTrigger value="specs">Specifications & Dimensions</TabsTrigger>
            <TabsTrigger value="desc">Full Description</TabsTrigger>
            <TabsTrigger value="reviews">Customer Reviews ({product.reviews || 48})</TabsTrigger>
          </TabsList>

          {/* Specifications Table */}
          <TabsContent value="specs">
            <div className="space-y-4">
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                Technical Specifications & Fit Details
              </h3>
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {product.specs ? (
                  Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-3">
                      <span className="font-bold text-gray-500 uppercase">{key}</span>
                      <span className="col-span-2 font-semibold text-gray-900 dark:text-white">
                        {val}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-gray-500 uppercase">Frame Material</span>
                      <span className="col-span-2 font-semibold text-gray-900 dark:text-white">
                        Italian Hypoallergenic Cellulose Acetate
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-gray-500 uppercase">Lens Material</span>
                      <span className="col-span-2 font-semibold text-gray-900 dark:text-white">
                        Impact-Resistant Polycarbonate UV400
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-gray-500 uppercase">Hinge Construction</span>
                      <span className="col-span-2 font-semibold text-gray-900 dark:text-white">
                        5-Barrel Stainless Steel Hinge
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-gray-500 uppercase">Warranty</span>
                      <span className="col-span-2 font-semibold text-gray-900 dark:text-white">
                        2-Year Comprehensive Manufacturer Protection
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Description */}
          <TabsContent value="desc">
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-4">
              <p>{product.description}</p>
              <p>
                Engineered with optical ergonomics in mind, this silhouette provides balanced temple weight distribution to eliminate discomfort during prolonged wear. Lenses are treated with oleophobic and hydrophobic coatings to resist fingerprint smudges, rain droplets, and static dust accumulation.
              </p>
            </div>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="text-base font-black text-gray-900 dark:text-white">
                    Verified Customer Feedback
                  </h4>
                  <p className="text-xs text-gray-500">Based on {product.reviews || 48} verified eyewear purchases</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-primary">{product.rating}</span>
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Marcus V. — Verified Buyer
                    </span>
                    <span className="text-[11px] text-gray-400">2 days ago</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    "The frame quality blew me away. Super lightweight yet robust, and my custom prescription lenses are crystal clear with zero distortion!"
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Elena R. — Verified Buyer
                    </span>
                    <span className="text-[11px] text-gray-400">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    "Fast delivery to New York in 2 days. The case and microfiber cloth included are very premium. Will definitely order again!"
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* You May Also Like (5-Column Grid) */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              You May Also Like
            </h3>
            <p className="text-xs text-gray-500">Similar models in {product.category}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <ProductQuickView />
    </div>
  );
}
