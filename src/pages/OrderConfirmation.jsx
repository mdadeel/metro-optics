import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home, Truck } from 'lucide-react';
import { useOrderStore } from '../stores/useOrderStore';
import { formatPrice } from '../lib/utils';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const getOrderById = useOrderStore((state) => state.getOrderById);

  const order = getOrderById(orderId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-95">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Order Confirmed & Payment Received
        </span>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
          Thank You For Your Order!
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Your eyewear order is now being processed by our laboratory opticians.
        </p>
      </div>

      {order && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 text-xs">
            <div>
              <span className="text-gray-400 block">Order Number</span>
              <strong className="text-gray-900 dark:text-white font-mono text-sm">{order.id}</strong>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block">Total Paid</span>
              <strong className="text-primary font-black text-sm">{formatPrice(order.total)}</strong>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 uppercase text-[11px]">
              Delivery Destination:
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {order.customer?.name} <br />
              {order.customer?.address} <br />
              Phone: {order.customer?.phone}
            </p>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900 flex items-center gap-3 text-xs text-blue-800 dark:text-blue-300">
            <Truck className="w-5 h-5 shrink-0" />
            <span>
              Estimated delivery in <strong>2 - 4 business days</strong> with insured tracking.
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to={`/track-order?id=${orderId || ''}`}
          className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Track Live Progress</span>
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
