import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedCategories = () => {
    const categories = [
        {
            id: 1,
            name: 'Eyeglasses',
            image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop',
            count: 12,
            description: 'Stylish frames for everyday wear'
        },
        {
            id: 2,
            name: 'Sunglasses',
            image: 'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=800&auto=format&fit=crop',
            count: 10,
            description: 'Protect your eyes in style'
        },
        {
            id: 3,
            name: 'Reading Glasses',
            image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&auto=format&fit=crop',
            count: 2,
            description: 'Comfortable readers for any task'
        },
        {
            id: 4,
            name: 'Blue Light Glasses',
            image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop',
            count: 2,
            description: 'Digital eye strain relief'
        },
        {
            id: 5,
            name: 'Kids Glasses',
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
            count: 1,
            description: 'Durable frames for children'
        },
        {
            id: 6,
            name: 'Sports Glasses',
            image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&auto=format&fit=crop',
            count: 2,
            description: 'Performance eyewear for athletes'
        }
    ];

    return (
        <section className="featured-categories">
            <div className="featured-categories-container">
                <div className="featured-categories-header">
                    <h2 className="featured-categories-title">Shop by Category</h2>
                    <p className="featured-categories-subtitle">
                        Find the perfect eyewear for your lifestyle
                    </p>
                </div>

                <div className="featured-categories-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/shop?category=${encodeURIComponent(category.name)}`}
                            className="category-card"
                        >
                            <div className="category-card-image-wrapper">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="category-card-image"
                                    loading="lazy"
                                />
                            </div>
                            <div className="category-card-content">
                                <h3 className="category-card-name">{category.name}</h3>
                                <p className="category-card-description">{category.description}</p>
                                <div className="category-card-footer">
                                    <span className="category-card-count">{category.count} Products</span>
                                    <ArrowRight className="category-card-icon" size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
