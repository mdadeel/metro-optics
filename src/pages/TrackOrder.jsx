import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, CircleHelp } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../lib/utils';
import SEO from '../components/SEO';

const trackingSteps = [
  { id: 'pending', title: 'Order received', description: 'We have received your order.' },
  { id: 'confirmed', title: 'Order confirmed', description: 'Your order is confirmed and being prepared.' },
  { id: 'processing', title: 'Preparing your order', description: 'Our team is preparing your frames.' },
  { id: 'shipped', title: 'On its way', description: 'Your order has been handed to the carrier.' },
  { id: 'delivered', title: 'Delivered', description: 'Your order has arrived.' },
];

const statusIndex = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
};

function getOrderDate(value) {
  if (!value) return null;
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const { orders, getOrderById, fetchOrderById } = useOrders();
  const [inputOrderId, setInputOrderId] = useState(initialId);
  const [searchedOrderId, setSearchedOrderId] = useState(initialId);
  const [searchResult, setSearchResult] = useState(() => ({ id: initialId, order: null, loading: Boolean(initialId) }));

  const findInCurrentOrders = useCallback((id) => orders.find(
    (order) => String(order.id).toLowerCase() === id.trim().toLowerCase()
  ) || getOrderById(id), [orders, getOrderById]);

  useEffect(() => {
    if (!initialId) return undefined;
    let cancelled = false;
    const localOrder = findInCurrentOrders(initialId);
    Promise.resolve(localOrder || fetchOrderById(initialId))
      .then((result) => {
        if (!cancelled) setSearchResult({ id: initialId, order: result || null, loading: false });
      })
      .catch(() => {
        if (!cancelled) setSearchResult({ id: initialId, order: null, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [initialId, findInCurrentOrders, fetchOrderById]);

  const activeOrder = useMemo(() => {
    if (!searchedOrderId) return null;
    return findInCurrentOrders(searchedOrderId)
      || (searchResult.id.toLowerCase() === searchedOrderId.trim().toLowerCase() ? searchResult.order : null);
  }, [findInCurrentOrders, searchedOrderId, searchResult]);

  const normalizedStatus = String(activeOrder?.status || '').trim().toLowerCase();
  const currentStepIndex = statusIndex[normalizedStatus] ?? -1;
  const isCancelled = normalizedStatus === 'cancelled' || normalizedStatus === 'canceled';
  const isSearching = searchResult.loading && searchResult.id.toLowerCase() === searchedOrderId.trim().toLowerCase();

  const handleSearch = async (event) => {
    event.preventDefault();
    const id = inputOrderId.trim();
    if (!id) return;
    setSearchedOrderId(id);

    const localOrder = findInCurrentOrders(id);
    if (localOrder) {
      setSearchResult({ id, order: localOrder, loading: false });
      return;
    }

    setSearchResult({ id, order: null, loading: true });
    try {
      const result = await fetchOrderById(id);
      setSearchResult({ id, order: result || null, loading: false });
    } catch {
      setSearchResult({ id, order: null, loading: false });
    }
  };

  return (
    <div className="mo-track-page">
      <SEO title="Track an Order" description="Check the latest status of a Metro Optics order using the order number from your confirmation." url="/track-order" noIndex />
      <div className="mo-interior-shell">
        <Breadcrumb items={[{ label: 'Track an order' }]} />
        <header className="mo-page-heading mo-track-heading">
          <p className="mo-eyebrow">HERE FOR THE JOURNEY</p>
          <h1 className="mo-display">Track your order.</h1>
          <p>Enter the order number from your confirmation to check its latest status.</p>
        </header>

        <form className="mo-track-search" onSubmit={handleSearch} role="search">
          <label className="sr-only" htmlFor="track-order-id">Order number</label>
          <Search size={18} aria-hidden="true" />
          <input
            id="track-order-id"
            type="search"
            value={inputOrderId}
            onChange={(event) => setInputOrderId(event.target.value)}
            placeholder="Enter your order number"
            autoComplete="off"
            required
          />
          <button type="submit" aria-label="Find order"><span>Find order</span><Search size={15} aria-hidden="true" /></button>
        </form>

        {isSearching && <p className="mo-track-loading" role="status">Looking up order…</p>}

        {searchedOrderId && activeOrder && (
          <section className="mo-track-result" aria-labelledby="mo-track-result-title" aria-live="polite">
            <div className="mo-track-result__top">
              <div>
                <p className="mo-eyebrow">ORDER STATUS</p>
                <h2 id="mo-track-result-title">Order <span>#{activeOrder.id}</span></h2>
                {getOrderDate(activeOrder.createdAt) && <p>Placed {getOrderDate(activeOrder.createdAt)}</p>}
              </div>
              <span className={`mo-track-status mo-track-status--${normalizedStatus || 'unknown'}`}>{normalizedStatus || 'Status unavailable'}</span>
            </div>

            {isCancelled ? (
              <div className="mo-track-cancelled" role="status">
                <CircleHelp size={20} aria-hidden="true" />
                <p>This order was cancelled. If you need help, <Link to="/contact">contact our team</Link>.</p>
              </div>
            ) : currentStepIndex >= 0 ? (
              <ol className="mo-track-steps" aria-label="Order progress">
                {trackingSteps.map((step, index) => {
                  const completed = index < currentStepIndex;
                  const current = index === currentStepIndex;
                  return (
                    <li key={step.id} className={`${completed ? 'is-complete' : ''}${current ? ' is-current' : ''}`} aria-current={current ? 'step' : undefined}>
                      <span className="mo-track-step__icon">
                        {completed ? <CheckCircle2 size={17} aria-hidden="true" /> : index === 3 ? <Truck size={17} aria-hidden="true" /> : index === 0 ? <Package size={17} aria-hidden="true" /> : <Clock size={16} aria-hidden="true" />}
                      </span>
                      <span className="mo-track-step__copy"><strong>{step.title}</strong><small>{step.description}</small></span>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="mo-track-cancelled" role="status">
                <CircleHelp size={20} aria-hidden="true" />
                <p>We found the order, but its current status is not available yet. <Link to="/contact">Contact us</Link> if you need help.</p>
              </div>
            )}

            <div className="mo-track-result__summary">
              <span>{activeOrder.customer?.name || activeOrder.customerName || 'Customer'}</span>
              <strong>Total {formatPrice(activeOrder.total)}</strong>
            </div>
          </section>
        )}

        {searchedOrderId && !isSearching && !activeOrder && (
          <div className="mo-track-not-found" role="status">
            <Package size={25} aria-hidden="true" />
            <div><h2>We couldn't find that order.</h2><p>Check the order number and try again. You can also <Link to="/contact">contact our team</Link> for help.</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
