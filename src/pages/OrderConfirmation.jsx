import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Home, Truck } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../lib/utils';
import SEO from '../components/SEO';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getOrderById, fetchOrderById } = useOrders();
  const [fetchedResult, setFetchedResult] = useState({ id: null, order: null });

  const contextOrder = getOrderById(orderId);
  const hasFetchedCurrentId = fetchedResult.id === orderId;
  const order = contextOrder || (hasFetchedCurrentId ? fetchedResult.order : null);
  const isLoading = Boolean(orderId) && !contextOrder && !hasFetchedCurrentId;

  useEffect(() => {
    if (!orderId || contextOrder) return undefined;
    let cancelled = false;
    fetchOrderById(orderId)
      .then((result) => {
        if (!cancelled) setFetchedResult({ id: orderId, order: result || null });
      })
      .catch(() => {
        if (!cancelled) setFetchedResult({ id: orderId, order: null });
      });
    return () => {
      cancelled = true;
    };
  }, [contextOrder, fetchOrderById, orderId]);

  const customer = order?.customer || {};
  const customerName = customer.name || order?.customerName || 'Customer';
  const customerAddress = customer.address || order?.address || '';
  const customerPhone = customer.phone || order?.phone || '';

  return (
    <div className="mo-confirmation-page">
      <SEO title="Order Confirmation" description="View the confirmation and status details for your Metro Optics order." url="/order-confirmation" noIndex />
      <div className="mo-confirmation-icon" aria-hidden="true"><CheckCircle /></div>

      <div className="mo-confirmation-heading">
        <p className="mo-eyebrow">ORDER RECEIVED</p>
        <h1>Thank you for your order.</h1>
        <p>We’ve received your eyewear order and will keep you updated as it moves through fulfilment.</p>
      </div>

      {isLoading && <p className="mo-confirmation-loading" role="status">Loading your order details…</p>}

      {order && (
        <section className="mo-confirmation-card" aria-label="Order details">
          <div className="mo-confirmation-card__top">
            <div>
              <span>Order number</span>
              <strong>{order.id}</strong>
            </div>
            <div className="mo-confirmation-card__total">
              <span>Order total</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>
          {(customerAddress || customerPhone) && (
            <div className="mo-confirmation-destination">
              <h2>Delivery destination</h2>
              <p>{customerName}{customerAddress ? ` · ${customerAddress}` : ''}{customerPhone ? ` · ${customerPhone}` : ''}</p>
            </div>
          )}
          <div className="mo-confirmation-delivery">
            <Truck aria-hidden="true" />
            <span>You can check the latest order status at any time using your order number.</span>
          </div>
        </section>
      )}

      {!isLoading && !order && (
        <div className="mo-confirmation-missing" role="status">
          <p>{orderId ? 'Your order was submitted, but its details are not available in this session.' : 'Your order reference is missing.'}</p>
          <p>Keep your order number from the checkout confirmation, or contact us for help.</p>
        </div>
      )}

      <div className="mo-confirmation-actions">
        <Link to={`/track-order${orderId ? `?id=${encodeURIComponent(orderId)}` : ''}`} className="mo-interior-button">
          <Package size={16} aria-hidden="true" />
          Track your order
        </Link>
        <Link to="/" className="mo-confirmation-home-link">
          <Home size={16} aria-hidden="true" />
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
