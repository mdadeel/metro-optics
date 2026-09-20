import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb component for e-commerce listings and detail pages.
 * @param {Array<{label: string, to?: string}>} items
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center text-xs text-gray-500 dark:text-gray-400 py-3 mb-4 overflow-x-auto whitespace-nowrap">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-primary transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center shrink-0">
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-gray-400" />
            {isLast || !item.to ? (
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-primary transition-colors capitalize"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
