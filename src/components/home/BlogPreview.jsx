import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'How to Choose the Perfect Frame Shape for Your Face',
    excerpt: 'Round, oval, square, or heart-shaped? Discover the optical geometry secrets that accentuate your natural contours.',
    date: 'Sep 15, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    category: 'Frame Fitting',
  },
  {
    id: 2,
    title: 'Blue Light Cut Lenses: Separating Science from Myth',
    excerpt: 'An optometrist’s deep dive into HEV 415-455nm blue wavelengths, circadian rhythm disruption, and computer vision syndrome.',
    date: 'Sep 10, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
    category: 'Eye Health',
  },
  {
    id: 3,
    title: 'Polarized vs Non-Polarized: Complete Driving & Water Guide',
    excerpt: 'Why horizontal glare filtering matters for highway safety and maritime clarity, plus when to avoid polarization.',
    date: 'Sep 02, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    category: 'Lens Tech',
  },
];

export default function BlogPreview() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Optical Insights & Frame Guides
          </h3>
          <p className="text-xs text-gray-500">Expert articles reviewed by licensed New York optometrists</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <article
            key={art.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {art.category}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {art.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readTime}
                </span>
              </div>

              <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                {art.title}
              </h4>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                {art.excerpt}
              </p>

              <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                <Link
                  to="/faq"
                  className="text-xs font-bold text-primary flex items-center gap-1 group-hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
