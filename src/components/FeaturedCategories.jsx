import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { motion } from 'motion/react';

const categories = [
    {
        id: 1,
        name: 'Glasses',
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

const FeaturedCategories = () => {
    return (
        <section className="py-20 lg:py-28 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                        Shop by Category
                    </h2>
                    <p className="mt-3 text-muted-foreground text-base lg:text-lg max-w-md mx-auto">
                        Find the perfect eyewear for your lifestyle
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                        >
                            <Link
                                to={`/shop?category=${encodeURIComponent(category.name)}`}
                                className="group relative block overflow-hidden rounded-xl bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#0F172A]/10 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                                    <h3 className="text-white text-lg lg:text-xl font-semibold tracking-tight">{category.name}</h3>
                                    <p className="text-white/60 text-sm mt-1 line-clamp-1">{category.description}</p>
                                    <div className="flex items-center gap-1.5 mt-3 text-white/80 text-sm font-medium">
                                        <span>{category.count} Products</span>
                                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
