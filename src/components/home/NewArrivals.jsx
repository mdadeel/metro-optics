import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import { useProductStore } from '../../stores/useProductStore';

export default function NewArrivals() {
  const products = useProductStore((state) => state.products);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              New Arrivals & Trending Silhouettes
            </h3>
            <p className="text-xs text-gray-500">Fresh designer releases direct from Milan and Tokyo</p>
          </div>
        </div>

        <Link
          to="/shop?sort=newest"
          className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 group"
        >
          <span>View All New</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
