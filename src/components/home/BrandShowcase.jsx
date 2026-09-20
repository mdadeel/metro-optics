import { Link } from 'react-router-dom';
import { BRANDS } from '../../lib/constants';

export default function BrandShowcase() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Official Brand Partners
          </h3>
          <p className="text-xs text-gray-500">100% authentic eyewear backed by global manufacturer warranties</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {BRANDS.map((brand) => (
          <Link
            key={brand}
            to={`/shop?brand=${encodeURIComponent(brand)}`}
            className="flex items-center justify-center py-4 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary hover:shadow-md transition-all group text-center"
          >
            <span className="text-sm font-black text-gray-700 dark:text-gray-300 group-hover:text-primary tracking-wider uppercase">
              {brand}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
