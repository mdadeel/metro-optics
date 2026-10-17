import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import { checkoutSchema } from '../lib/validators';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';
import SEO from '../components/SEO';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getSubtotal, getShipping, getTax, getTotal, clearCart } = useCartStore();
  const createOrder = useOrderStore((state) => state.createOrder);

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.displayName?.split(' ')[0] || '',
      lastName: user?.displayName?.split(' ')[1] || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      paymentMethod: 'credit-card',
    },
  });

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  const pageSEO = <SEO title="Secure Checkout" description="Enter delivery and payment details to place your Metro Optics order." url="/checkout" noIndex />;

  if (items.length === 0) {
    return (
      <div className="mo-checkout-page mo-checkout-page--empty max-w-[1320px] mx-auto px-4 py-20 text-center space-y-4">
        {pageSEO}
        <h2 className="text-2xl font-black">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-xs inline-block">
          Browse Shop
        </Link>
      </div>
    );
  }

  const onPlaceOrder = async (formData) => {
    setSubmitting(true);
    try {
      const activeUser = user || {
        uid: 'guest-' + Date.now(),
        email: formData.email,
        displayName: `${formData.firstName} ${formData.lastName}`,
      };

      const orderPayload = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        },
        items,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: formData.paymentMethod,
      };

      const created = await createOrder(activeUser, orderPayload);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation?orderId=${created.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to complete order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mo-checkout-page max-w-[1320px] mx-auto px-4 py-6 space-y-8">
      {pageSEO}
      <Breadcrumb items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
        Secure Checkout
      </h1>

      <form onSubmit={handleSubmit(onPlaceOrder)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Shipping & Delivery Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkout-first-name" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    First name
                  </label>
                  <input
                    id="checkout-first-name"
                    autoComplete="given-name"
                    {...register('firstName')}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:border-primary"
                  />
                  {errors.firstName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-last-name" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Last name
                  </label>
                  <input
                    id="checkout-last-name"
                    autoComplete="family-name"
                    {...register('lastName')}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:border-primary"
                  />
                  {errors.lastName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-email" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Email address
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:border-primary"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Phone number
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    autoComplete="tel"
                    {...register('phone')}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:border-primary"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="checkout-address" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Street address
                  </label>
                  <input
                    id="checkout-address"
                    autoComplete="street-address"
                    {...register('address')}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:border-primary"
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-city" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    City
                  </label>
                  <input
                    id="checkout-city"
                    autoComplete="address-level2"
                    {...register('city')}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:border-primary"
                  />
                  {errors.city && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="checkout-state" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      State / region
                    </label>
                    <input
                      id="checkout-state"
                      autoComplete="address-level1"
                      {...register('state')}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-postal-code" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      ZIP / postal code
                    </label>
                    <input
                      id="checkout-postal-code"
                      autoComplete="postal-code"
                      {...register('zipCode')}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary transition-all">
                  <input
                    type="radio"
                    value="credit-card"
                    {...register('paymentMethod')}
                    className="text-primary focus:ring-primary"
                  />
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Credit / debit card
                    </span>
                    <span className="text-[11px] text-gray-400">
Choose a card payment method
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary transition-all">
                  <input
                    type="radio"
                    value="paypal"
                    {...register('paymentMethod')}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      PayPal Express
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Pay safely via your verified PayPal account
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary transition-all">
                  <input
                    type="radio"
                    value="cash-on-delivery"
                    {...register('paymentMethod')}
                    className="text-primary focus:ring-primary"
                  />
                  <Truck className="w-5 h-5 text-emerald-500" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Cash on Delivery (Available in NY / NJ Hubs)
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Pay cash upon delivery inspection
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Checkout Review Sidebar (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-800">
              Your Order ({items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">
                      {item.name}
                    </p>
                    <span className="text-[11px] text-gray-400">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                  <span className="font-black text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Insured Shipping</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {shipping === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (8.25%)</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatPrice(tax)}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                <span>Final Total</span>
                <span className="text-primary text-xl font-black">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <span>Confirm & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Includes 2-Year Frame Warranty & 30-Day Money Back</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
