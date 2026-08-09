import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { CaretRight as ChevronRight } from "@phosphor-icons/react";
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'motion/react';

const FeaturedProducts = ({ onQuickView }) => {
    const { getBestsellers, loading, products } = useProducts();
    const bestsellers = getBestsellers(8);

    return (
        <section className="py-20 lg:py-28 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 lg:mb-16"
                >
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                            Bestselling Frames
                        </h2>
                        <p className="mt-3 text-muted-foreground text-base lg:text-lg">
                            Customer favorites — handpicked for you
                        </p>
                    </div>
                    <Link
                        to="/shop"
                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A5F] hover:text-[#2A4A75] transition-colors shrink-0"
                    >
                        View All
                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-16">
                            <LoadingSpinner text="Loading bestsellers..." />
                        </div>
                    ) : bestsellers && bestsellers.length > 0 ? (
                        bestsellers.map((product) => (
                            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
                        ))
                    ) : (
                        <div className="col-span-full flex justify-center py-16">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-foreground">No bestselling products found</h3>
                                <p className="text-muted-foreground text-sm mt-1">Check back later for our featured items!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
