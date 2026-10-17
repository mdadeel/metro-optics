import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import ProductCard from '../components/product/ProductCard';
import { useCartStore } from '../stores/useCartStore';
import { useProductStore } from '../stores/useProductStore';
import { formatPrice } from '../lib/utils';
import SEO from '../components/SEO';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getSubtotal, getShipping, getTax, getTotal } =
    useCartStore();
  const products = useProductStore((state) => state.products);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  const recommendations = products.slice(0, 4);
  const pageSEO = <SEO title="Your Shopping Bag" description="Review items in your Metro Optics shopping bag before checkout." url="/cart" noIndex />;

  if (items.length === 0) {
    return (
      <div className="mo-cart-page mo-cart-page--empty max-w-[1320px] mx-auto px-4 py-16 text-center space-y-4">
        {pageSEO}
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore our designer frames and sunglasses with certified prescription lens options.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mo-cart-page max-w-[1320px] mx-auto px-4 py-6 space-y-8">
      {pageSEO}
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
        Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table Column (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th scope="col" className="p-4">Product</th>
                  <th scope="col" className="p-4">Unit price</th>
                  <th scope="col" className="p-4">Quantity</th>
                  <th scope="col" className="p-4">Subtotal</th>
                  <th scope="col" className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item) => (
                  <tr key={item.cartItemId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-4" data-label="Product">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-800 shrink-0"
                        />
                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <div className="text-[11px] text-gray-400 mt-0.5 space-x-2">
                            <span>Color: {item.selectedColor}</span>
                            <span>•</span>
                            <span>Size: {item.selectedSize}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-gray-900 dark:text-white whitespace-nowrap" data-label="Unit price">
                      {formatPrice(item.price)}
                    </td>

                    <td className="p-4 whitespace-nowrap" data-label="Quantity">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-fit">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="px-3 text-xs font-bold" aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>

                    <td className="p-4 font-black text-primary whitespace-nowrap" data-label="Subtotal">
                      {formatPrice(item.price * item.quantity)}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap" data-label="Remove">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <Link
              to="/shop"
              className="text-xs font-bold text-primary hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-800">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {shipping === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : formatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Estimated State Tax (8.25%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(tax)}</span>
            </div>

            <hr className="my-2 border-gray-100 dark:border-gray-800" />

            <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-1">
              <span>Total Amount</span>
              <span className="text-primary text-xl font-black">{formatPrice(total)}</span>
            </div>
          </div>

          {shipping > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
              Add <strong>{formatPrice(99 - subtotal)}</strong> more to unlock Free Nationwide Shipping!
            </div>
          )}

          <Link
            to="/checkout"
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit Bank Grade SSL Checkout</span>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="space-y-4 pt-6">
        <h3 className="text-lg font-black text-gray-900 dark:text-white">
          Frequently Added Together
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recommendations.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
