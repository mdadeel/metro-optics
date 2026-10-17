import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Printer, CheckCircle, ArrowLeft, ShieldWarning as ShieldAlert } from '@phosphor-icons/react';
import LogoMark from '../components/layout/LogoMark';
import SEO from '../components/SEO';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/utils';
import '../styles/pages/invoice.css';

function getDisplayDate(value) {
    if (!value) return 'Date unavailable';
    const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime())
        ? 'Date unavailable'
        : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function asAmount(value) {
    if (value === null || value === undefined || value === '') return null;
    const amount = Number(value);
    return Number.isFinite(amount) ? amount : null;
}

const Invoice = () => {
    const { id } = useParams();
    const { getOrderById, fetchOrderById } = useOrders();
    const { user, isAdmin } = useAuth();
    const [fetchedResult, setFetchedResult] = useState({ id: null, order: null });
    const invoiceSEO = <SEO title="Invoice" description="View a private Metro Optics order invoice." url={`/invoice/${encodeURIComponent(id || '')}`} noIndex />;

    const contextOrder = getOrderById(id);
    const hasFetchedCurrentId = fetchedResult.id === id;
    const order = contextOrder || (hasFetchedCurrentId ? fetchedResult.order : null);
    const isLoading = Boolean(id) && !contextOrder && !hasFetchedCurrentId;

    useEffect(() => {
        if (!id || contextOrder) return undefined;
        let cancelled = false;
        fetchOrderById(id)
            .then((result) => {
                if (!cancelled) setFetchedResult({ id, order: result || null });
            })
            .catch(() => {
                if (!cancelled) setFetchedResult({ id, order: null });
            });
        return () => {
            cancelled = true;
        };
    }, [contextOrder, fetchOrderById, id]);

    if (isLoading) {
        return (
            <div className="invoice-page">
                {invoiceSEO}
                <div className="invoice-container invoice-message" role="status">Loading invoice…</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="invoice-page">
                {invoiceSEO}
                <div className="invoice-container invoice-message" role="status">
                    <h1 className="invoice-title">Invoice not found</h1>
                    <p>We couldn't find an order with that number.</p>
                    <Link to="/profile/orders" className="invoice-back-link">Back to your orders</Link>
                </div>
            </div>
        );
    }

    // Keep invoice access limited to the order owner (including older order
    // records that stored the customer's verified email instead of a user ID).
    const matchesAccount = Boolean(user?.uid && (
        order.userId === user.uid
        || order.userEmail === user.email
        || order.email === user.email
        || order.customer?.email === user.email
    ));
    if (!isAdmin && !matchesAccount) {
        return (
            <div className="invoice-page">
                {invoiceSEO}
                <div className="invoice-container invoice-message" role="alert">
                    <ShieldAlert size={36} aria-hidden="true" />
                    <h1 className="invoice-title">You can’t view this invoice</h1>
                    <p>This invoice is only available to the account that placed the order.</p>
                    <Link to="/profile/orders" className="invoice-back-link">Back to your orders</Link>
                </div>
            </div>
        );
    }

    const items = Array.isArray(order.items) ? order.items : [];
    const itemsSubtotal = items.reduce(
        (sum, item) => sum + (asAmount(item.price) || 0) * (asAmount(item.quantity) || 0),
        0
    );
    const subtotal = asAmount(order.subtotal) ?? itemsSubtotal;
    const shipping = asAmount(order.shipping);
    const tax = asAmount(order.tax);
    const total = asAmount(order.total) ?? subtotal + (shipping || 0) + (tax || 0);
    const customer = order.customer || {};
    const customerName = customer.name || order.customerName || order.name || 'Customer';
    const address = customer.address || order.address || '';
    const phone = customer.phone || order.phone || '';
    const email = customer.email || order.email || order.userEmail || '';
    const paymentMethod = order.paymentMethod
        ? String(order.paymentMethod).replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
        : 'Not specified';

    const handlePrint = () => window.print();

    return (
        <div className="invoice-page">
            {invoiceSEO}
            <div className="invoice-actions-bar">
                <Link to="/profile/orders" className="invoice-back-link">
                    <ArrowLeft size={17} aria-hidden="true" />
                    Back to orders
                </Link>
                <button type="button" onClick={handlePrint} className="invoice-print-btn">
                    <Printer size={17} aria-hidden="true" />
                    Print invoice
                </button>
            </div>

            <div className="invoice-container">
                <header className="invoice-header">
                    <div className="invoice-logo">
                        <div className="invoice-brand">
                            <LogoMark size={27} />
                            <span>Metro Optics</span>
                        </div>
                        <div className="invoice-company-address">
                            Eyewear, considered.<br />
                            <a href="mailto:support@metrooptics.com">support@metrooptics.com</a>
                        </div>
                    </div>
                    <div className="invoice-details">
                        <p className="mo-eyebrow">YOUR ORDER SUMMARY</p>
                        <h1 className="invoice-title">INVOICE</h1>
                        <div className="invoice-meta">
                            <p>Order #{order.id}</p>
                            <p>{getDisplayDate(order.createdAt)}</p>
                        </div>
                    </div>
                </header>

                <section className="invoice-addresses" aria-label="Order details">
                    <div className="invoice-address">
                        <h2>Deliver to</h2>
                        <p className="invoice-customer-name">{customerName}</p>
                        {address && <p>{address}</p>}
                        {phone && <p><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></p>}
                        {email && <p><a href={`mailto:${email}`}>{email}</a></p>}
                    </div>
                    <div className="invoice-payment-info">
                        <h2>Payment method</h2>
                        <p className="payment-badge">{paymentMethod}</p>
                        {order.transactionId && <p className="trx-id">Transaction ID: {order.transactionId}</p>}
                    </div>
                </section>

                <div className="invoice-table-wrapper">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th scope="col">Item description</th>
                                <th scope="col" className="text-center">Qty</th>
                                <th scope="col" className="text-right">Price</th>
                                <th scope="col" className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const price = asAmount(item.price) || 0;
                                const quantity = asAmount(item.quantity) || 0;
                                return (
                                    <tr key={item.cartItemId || item.id || `${item.name}-${index}`}>
                                        <td>
                                            <div className="item-name">{item.name || 'Eyewear item'}</div>
                                            {(item.lensType || item.category || item.selectedColor || item.selectedSize) && (
                                                <div className="item-meta">
                                                    {[item.lensType, item.category, item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-center">{quantity}</td>
                                        <td className="text-right">{formatPrice(price)}</td>
                                        <td className="text-right font-bold">{formatPrice(price * quantity)}</td>
                                    </tr>
                                );
                            })}
                            {items.length === 0 && (
                                <tr><td colSpan="4" className="invoice-empty-items">No item details are available for this order.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <section className="invoice-footer-section" aria-label="Order totals">
                    <div className="invoice-totals">
                        <div className="invoice-total-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        {shipping !== null && (
                            <div className="invoice-total-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                            </div>
                        )}
                        {tax !== null && tax > 0 && (
                            <div className="invoice-total-row">
                                <span>Tax</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                        )}
                        <div className="invoice-total-row final">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </section>

                <div className="invoice-thank-you">
                    <CheckCircle size={20} aria-hidden="true" />
                    <span>Thank you for choosing Metro Optics.</span>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
