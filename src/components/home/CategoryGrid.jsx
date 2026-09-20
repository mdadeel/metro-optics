import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../lib/constants';

export default function CategoryGrid() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Shop by Category
          </h3>
          <p className="text-xs text-gray-500">Explore frames crafted for every facial geometry and lifestyle</p>
        </div>
      </div>

      {/* 2-Row Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src={cat.featuredImage}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                Explore Collection
              </span>
              <h4 className="text-base font-black leading-tight mt-0.5 group-hover:text-primary-light transition-colors">
                {cat.name}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
