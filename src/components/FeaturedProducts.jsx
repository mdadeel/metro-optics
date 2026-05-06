import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const FeaturedProducts = ({ onQuickView }) => {
    const { getBestsellers, loading, products } = useProducts();
    const bestsellers = getBestsellers(8);
    
    // Debug logging
    console.log('FeaturedProducts Debug:', {
        loading,
        productsLength: products?.length,
        bestsellersLength: bestsellers?.length,
        products
    });
    
    return (
        <section className="featured-products">
            <div className="featured-products-container">
                <div className="featured-products-header">
                    <div>
                        <h2 className="featured-products-title">Bestselling Frames</h2>
                        <p className="featured-products-subtitle">
                            Customer favorites - handpicked for you
                        </p>
                    </div>
                    <Link to="/shop" className="featured-products-view-all">
                        View All
                        <ChevronRight size={16} />
                    </Link>
                </div>
                
                <div className="featured-products-grid">
                    {loading ? (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            padding: '40px 0', 
                            width: '100%', 
                            gridColumn: '1 / -1' 
                        }}>
                            <LoadingSpinner text="Loading bestsellers..." />
                        </div>
                    ) : bestsellers && bestsellers.length > 0 ? (
                        bestsellers.map((product) => (
                            <div key={product.id} className="featured-products-card-wrapper">
                                <ProductCard product={product} onQuickView={onQuickView} />
                            </div>
                        ))
                    ) : (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            padding: '40px 0', 
                            width: '100%', 
                            gridColumn: '1 / -1',
                            textAlign: 'center'
                        }}>
                            <div>
                                <h3>No bestselling products found</h3>
                                <p>Check back later for our featured items!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
