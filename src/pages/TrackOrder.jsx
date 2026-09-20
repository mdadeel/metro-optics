import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import { useOrderStore } from '../stores/useOrderStore';
import { formatPrice } from '../lib/utils';

const trackingSteps = [
  { id: 'confirmed', title: 'Order Confirmed', desc: 'Prescription & payment validated' },
  { id: 'lab', title: 'Optical Lab Fitting', desc: 'Digital CNC lens cutting & bevelling' },
  { id: 'qc', title: 'Laser QC Verification', desc: 'Diopter & pupillary distance checked' },
  { id: 'courier', title: 'Out for Delivery', desc: 'Insured express courier in transit' },
  { id: 'delivered', title: 'Delivered', desc: 'Safely arrived at destination' },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const getOrderById = useOrderStore((state) => state.getOrderById);

  const [inputOrderId, setInputOrderId] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState(() => {
    return initialId ? getOrderById(initialId.trim()) : null;
  });
  const [searched, setSearched] = useState(() => Boolean(initialId));

  const handleSearch = (idToSearch) => {
    const id = (idToSearch || inputOrderId).trim();
    if (!id) return;
    const found = getOrderById(id);
    setActiveOrder(found);
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Track Order' }]} />

      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          Track Your Eyewear Order
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Enter your Order ID (found on your email receipt or order confirmation) to monitor laboratory crafting and transit progress.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex gap-2 max-w-md mx-auto"
      >
        <input
          type="text"
          value={inputOrderId}
          onChange={(e) => setInputOrderId(e.target.value)}
          placeholder="e.g. ORD-123456 or demo ID..."
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-primary shadow-sm"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>
      </form>

      {/* Tracking Result */}
      {searched && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 text-xs">
            <div>
              <span className="text-gray-400 block">Status for Order</span>
              <strong className="text-base font-black text-gray-900 dark:text-white font-mono">
                {activeOrder ? activeOrder.id : inputOrderId}
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold rounded-full text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Processing in Optical Lab</span>
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6 py-4">
            {trackingSteps.map((step, idx) => {
              const isCompleted = idx <= 1; // First 2 steps simulated complete
              const isCurrent = idx === 1;
              return (
                <div key={step.id} className="flex gap-4 relative">
                  {/* Vertical Line */}
                  {idx < trackingSteps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 -bottom-4 w-0.5 ${
                        isCompleted ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'
                      }`}
                    />
                  )}

                  {/* Step Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      isCompleted
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-0.5">
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-primary'
                          : isCompleted
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {activeOrder && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex justify-between">
              <span>Customer: {activeOrder.customer?.name}</span>
              <span className="font-bold text-gray-900 dark:text-white">
                Total: {formatPrice(activeOrder.total)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
