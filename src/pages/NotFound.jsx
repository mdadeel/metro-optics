import { Link } from 'react-router-dom';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="mo-not-found-page min-h-[70vh] flex items-center justify-center px-4 py-20">
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        noIndex
      />
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <h1 className="text-[10rem] font-black leading-none text-primary/10 select-none">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-foreground -mt-16 mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition shadow-sm active:scale-95"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Shop
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="bg-muted/50 rounded-2xl p-6 border border-border/40">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Popular Categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Sunglasses', 'Glasses', 'Accessories'].map(
              (cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="px-4 py-2 bg-background border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition"
                >
                  {cat}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}
