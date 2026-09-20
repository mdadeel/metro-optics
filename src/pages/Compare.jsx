import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, GitCompare } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import { useCompareStore } from '../stores/useCompareStore';
import { useCartStore } from '../stores/useCartStore';
import { formatPrice } from '../lib/utils';

export default function Compare() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const addToCart = useCartStore((state) => state.addToCart);

  if (items.length === 0) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto">
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          No Products in Comparison
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Click the compare icon on any eyewear model to view side-by-side technical specifications and dimensions.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const specRows = [
    { label: 'Brand', key: 'brand' },
    { label: 'Category', key: 'category' },
    { label: 'Frame Shape', key: 'shape' },
    { label: 'Lens Technology', key: 'lensType' },
    { label: 'Customer Rating', render: (p) => `${p.rating || 4.8} / 5.0 (${p.reviews || 40} reviews)` },
    { label: 'SKU Identifier', key: 'sku' },
    { label: 'In-Stock Status', render: (p) => (p.inStock ? 'Available' : 'Pre-order') },
  ];

  return (
    <div className="max-w-[1320px] mx-auto px-4 py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Product Comparison' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Compare Eyewear Models ({items.length} of 4)
          </h1>
          <p className="text-xs text-gray-500">Side-by-side optical geometry and lens feature evaluation</p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs text-red-600 hover:underline font-bold"
        >
          Clear Comparison
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="p-4 w-48 bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold uppercase">
                Product
              </th>
              {items.map((product) => (
                <th key={product.id} className="p-4 min-w-[220px] align-top relative">
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-28 h-28 object-cover rounded-xl border border-gray-200 dark:border-gray-700 mx-auto mb-3"
                  />
                  <Link
                    to={`/product/${product.id}`}
                    className="font-bold text-sm text-gray-900 dark:text-white hover:text-primary block line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <span className="text-base font-black text-primary block mt-1">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="mt-3 w-full py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {specRows.map((row) => (
              <tr key={row.label} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td className="p-4 font-bold text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 whitespace-nowrap">
                  {row.label}
                </td>
                {items.map((product) => (
                  <td key={product.id} className="p-4 font-semibold text-gray-900 dark:text-white">
                    {row.render ? row.render(product) : product[row.key] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
