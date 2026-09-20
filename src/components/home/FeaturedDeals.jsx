import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import { useProductStore } from '../../stores/useProductStore';

export default function FeaturedDeals() {
  const products = useProductStore((state) => state.products);
  const deals = useMemo(
    () => products.filter((p) => p.isDeal || p.originalPrice > p.price),
    [products]
  );

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Best Deals & Hot Offers
            </h3>
            <p className="text-xs text-gray-500">Hand-picked seasonal discounts on premium eyewear</p>
          </div>
        </div>

        <Link
          to="/shop?deals=true"
          className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 group"
        >
          <span>View All Deals</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 5-Column Grid (StarTech style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {deals.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
