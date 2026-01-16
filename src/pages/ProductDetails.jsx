import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
    ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight,
    Star, Check, Truck, Shield, Package, ChevronDown,
    User, Calendar, ThumbsUp, Glasses, Sparkles, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getEnhancedProduct, getRelatedProducts } from '../data/productEnhancements';
import PrescriptionForm from '@/components/PrescriptionForm';
import SEO from '../components/SEO';
import './ProductDetailsPage.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { settings } = useSiteSettings();
    const navigate = useNavigate();

    const product = products.find(p => String(p.id) === String(id));
    const [lensType, setLensType] = useState('frame-only');
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Prescription state
    const [prescriptionData, setPrescriptionData] = useState(null);

    // Initialize selections in useEffect to avoid state updates during render
    useEffect(() => {
        if (product && !selectedColor && product?.variants?.colors?.length > 0) {
            const firstColor = product.variants.colors[0];
            setSelectedColor(prev => prev !== firstColor ? firstColor : prev);
        }
        if (product && !selectedSize && product?.variants?.sizes?.length > 0) {
            const firstSize = product.variants.sizes[0];
            setSelectedSize(prev => prev !== firstSize ? firstSize : prev);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product, selectedColor, selectedSize]);

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Product not found</h2>
                <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
            </div>
        );
    }

    // Get enhanced data
    const enhanced = getEnhancedProduct(product.id);
    const images = enhanced.images.length > 0 ? enhanced.images : [product.image];
    const specifications = enhanced.specifications;
    const reviews = enhanced.reviews;
    const relatedProducts = getRelatedProducts(product, products);

    // Dynamic prescription price from settings or default
    const prescriptionPrice = settings?.prescriptionPrice ? Number(settings.prescriptionPrice) : 500;

    const lensOptions = [
        { id: 'frame-only', label: 'Frame Only', price: 0, description: 'Just the frame, no lenses.' },
        { id: 'zero-power', label: 'Zero Power', price: 0, description: 'Anti-glare lenses with no power. Free.' },
        { id: 'prescription', label: 'Prescription Power', price: prescriptionPrice, description: 'Single vision lenses based on your prescription.' },
    ];

    const selectedLens = lensOptions.find(l => l.id === lensType);
    const totalPrice = (product.price + selectedLens.price) * quantity;

    const handleAddToCart = () => {
        if (lensType === 'prescription' && !prescriptionData) {
            // Should be disabled by button state, but safety check
            return;
        }

        addToCart({
            ...product,
            price: product.price + selectedLens.price,
            quantity,
            lensType: selectedLens.label,
            color: selectedColor,
            size: selectedSize,
            prescription: lensType === 'prescription' ? prescriptionData : null,
            name: `${product.name} (${selectedLens.label})`
        });
    };

    // Calculate average rating
    const avgRating = product.ratings?.average || 0;
    const reviewCount = product.ratings?.count || 0;

    // Render star rating
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
                fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
            />
        ));
    };

    return (
        <div className="product-details-page">
            <SEO
                title={product.name}
                description={product.description}
                image={product.image}
                url={`/product/${product.id}`}
                keywords={`${product.category}, ${product.brand || 'eyewear'}, glasses`}
                type="product"
            />
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <ChevronRight size={16} />
                <Link to="/shop">Shop</Link>
                <ChevronRight size={16} />
                <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
                <ChevronRight size={16} />
                <span>{product.name}</span>
            </div>

            <div className="product-details-container">
                {/* Left Side - Image Gallery */}
                <div className="product-gallery-section">
                    <div className="product-main-image">
                        <img src={images[activeImage]} alt={product.name} />

                        {product.isBestseller && (
                            <Badge className="product-badge bestseller-badge">Bestseller</Badge>
                        )}
                        {product.isNew && (
                            <Badge className="product-badge new-badge">New</Badge>
                        )}

                        {/* Image Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                    className="image-nav-btn prev-btn"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                    className="image-nav-btn next-btn"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="product-thumbnails">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side - Product Info */}
                <div className="product-info-section">
                    <div className="product-header">
                        <p className="product-category">{product.category}</p>
                        <h1 className="product-title">{product.name}</h1>

                        {/* Rating */}
                        <div className="product-rating">
                            <div className="stars-container">
                                {renderStars(avgRating)}
                            </div>
                            <span className="rating-text">{avgRating.toFixed(1)}</span>
                            <span className="review-count">({reviewCount} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="product-price-section">
                            <span className="current-price">৳{totalPrice.toLocaleString()}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="original-price">৳{product.originalPrice.toLocaleString()}</span>
                                    <Badge variant="destructive" className="discount-badge">
                                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                    </Badge>
                                </>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>
                    </div>

                    <Separator />

                    {/* Color Selection */}
                    {product.variants?.colors && product.variants.colors.length > 0 && (
                        <div className="variant-section">
                            <label className="variant-label">Color: <strong>{selectedColor}</strong></label>
                            <div className="variant-options">
                                {product.variants.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`variant-btn ${selectedColor === color ? 'active' : ''}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    {product.variants?.sizes && product.variants.sizes.length > 0 && (
                        <div className="variant-section">
                            <label className="variant-label">Size: <strong>{selectedSize}</strong></label>
                            <div className="variant-options">
                                {product.variants.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`variant-btn ${selectedSize === size ? 'active' : ''}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lens Selection - Visual Grid */}
                    {product.category === 'Eyeglasses' && (
                        <div className="lens-selection-section">
                            <label className="variant-label">Select Lens Type</label>
                            <div className="lens-selector-grid">
                                {lensOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => setLensType(option.id)}
                                        className={`lens-card ${lensType === option.id ? 'selected' : ''}`}
                                    >
                                        <div className="lens-card-icon">
                                            {option.id === 'frame-only' && <Glasses size={24} />}
                                            {option.id === 'zero-power' && <Sparkles size={24} />}
                                            {option.id === 'prescription' && <FileText size={24} />}
                                        </div>
                                        <div className="lens-card-info">
                                            <span className="lens-card-title">{option.label}</span>
                                            <span className="lens-card-price">
                                                {option.price === 0 ? 'Free' : `+৳${option.price}`}
                                            </span>
                                        </div>
                                        {lensType === option.id && <div className="lens-check-mark">✓</div>}
                                    </div>
                                ))}
                            </div>
                            <p className="lens-helper-text">
                                {lensOptions.find(l => l.id === lensType)?.description}
                            </p>

                            {/* Prescription Form Injection */}
                            {lensType === 'prescription' && (
                                <div className="mt-6">
                                    <PrescriptionForm onValidationChange={setPrescriptionData} />
                                </div>
                            )}
                        </div>
                    )}

                    <Separator />

                    {/* Quantity Selector */}
                    <div className="quantity-section">
                        <label className="variant-label">Quantity</label>
                        <div className="quantity-selector">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="qty-btn"
                            >
                                -
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                                className="qty-btn"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <Button
                            onClick={handleAddToCart}
                            size="lg"
                            className="add-to-cart-btn"
                            disabled={lensType === 'prescription' && !prescriptionData}
                        >
                            <ShoppingCart className="mr-2" size={20} />
                            {lensType === 'prescription' && !prescriptionData
                                ? "Enter Prescription"
                                : `Add to Cart - ৳${totalPrice.toLocaleString()}`
                            }
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => toggleWishlist(product)}
                            className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                        >
                            <Heart
                                size={20}
                                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                            />
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-features">
                        <div className="trust-item">
                            <Truck size={20} />
                            <span>Free Shipping on orders over ৳2000</span>
                        </div>
                        <div className="trust-item">
                            <Shield size={20} />
                            <span>7 Day Return Policy</span>
                        </div>
                        <div className="trust-item">
                            <Package size={20} />
                            <span>Secure Packaging</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="product-tabs-section">
                <Tabs defaultValue="specs" className="product-tabs">
                    <TabsList className="tabs-list">
                        <TabsTrigger value="specs">Specifications</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                        <TabsTrigger value="description">Description</TabsTrigger>
                    </TabsList>

                    <TabsContent value="specs" className="tab-content">
                        <Card className="specs-card">
                            <h3>Technical Specifications</h3>
                            {Object.keys(specifications).length > 0 ? (
                                <div className="specs-grid">
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <div key={key} className="spec-row">
                                            <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                            <span className="spec-value">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No specifications available for this product.</p>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="reviews" className="tab-content">
                        <div className="reviews-section">
                            {reviews.length > 0 ? (
                                <>
                                    <div className="reviews-header">
                                        <h3>Customer Reviews</h3>
                                        <Button variant="outline">Write a Review</Button>
                                    </div>

                                    <div className="reviews-list">
                                        {reviews.map((review) => (
                                            <Card key={review.id} className="review-card">
                                                <div className="review-header">
                                                    <div className="review-author">
                                                        <div className="author-avatar">
                                                            <User size={20} />
                                                        </div>
                                                        <div className="author-info">
                                                            <p className="author-name">{review.author}</p>
                                                            <div className="review-stars">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="review-meta">
                                                        <span className="review-date">
                                                            <Calendar size={14} />
                                                            {new Date(review.date).toLocaleDateString()}
                                                        </span>
                                                        {review.verified && (
                                                            <Badge variant="secondary" className="verified-badge">
                                                                <Check size={12} />
                                                                Verified Purchase
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {review.title && (
                                                    <h4 className="review-title">{review.title}</h4>
                                                )}
                                                <p className="review-comment">{review.comment}</p>

                                                <div className="review-footer">
                                                    <button className="helpful-btn">
                                                        <ThumbsUp size={14} />
                                                        Helpful ({review.helpful})
                                                    </button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Card className="no-reviews">
                                    <p>No reviews yet. Be the first to review this product!</p>
                                    <Button className="mt-4">Write a Review</Button>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="description" className="tab-content">
                        <Card className="description-card">
                            <h3>Product Description</h3>
                            <p>{product.description}</p>

                            {product.features && product.features.length > 0 && (
                                <>
                                    <h4 className="mt-6">Key Features:</h4>
                                    <ul className="features-list">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx}>
                                                <Check size={18} className="check-icon" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>You May Also Like</h2>
                    <div className="related-products-grid">
                        {relatedProducts.map((relatedProduct) => (
                            <Card
                                key={relatedProduct.id}
                                className="related-product-card"
                                onClick={() => navigate(`/product/${relatedProduct.id}`)}
                            >
                                <img src={relatedProduct.image} alt={relatedProduct.name} />
                                <div className="related-product-info">
                                    <p className="related-product-name">{relatedProduct.name}</p>
                                    <p className="related-product-price">৳{relatedProduct.price.toLocaleString()}</p>
                                    <div className="related-product-rating">
                                        {renderStars(relatedProduct.ratings?.average || 0)}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
