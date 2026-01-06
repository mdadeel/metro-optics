import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const FeaturedProducts = ({ onQuickView }) => {
    const { getBestsellers } = useProducts();
    const bestsellers = getBestsellers(8);

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
                    {bestsellers.map((product) => (
                        <div key={product.id} className="featured-products-card-wrapper">
                            <ProductCard product={product} onQuickView={onQuickView} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
