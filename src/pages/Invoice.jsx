import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Printer, CheckCircle, ArrowLeft, Eyeglasses as Glasses, ShieldWarning as ShieldAlert } from "@phosphor-icons/react";
import '../styles/pages/invoice.css';

const Invoice = () => {
    const { id } = useParams();
    const { getOrderById, fetchOrderById } = useOrders();
    const { user, isAdmin } = useAuth();
    const [fetchedOrder, setFetchedOrder] = useState(null);

    const contextOrder = getOrderById(id);
    const order = contextOrder || fetchedOrder;

    // Fallback: right after checkout the new order may not have arrived in the
    // Firestore snapshot yet — fetch it directly so the invoice never shows
    // "Order not found" as a false negative.
    useEffect(() => {
        if (contextOrder || !id) return;
        let cancelled = false;
        fetchOrderById(id).then((result) => {
            if (!cancelled) setFetchedOrder(result);
        });
        return () => {
            cancelled = true;
        };
    }, [contextOrder, id, fetchOrderById]);

    // Security: Verify order ownership (IDOR protection)
    if (!order) {
        return (
            <div className="invoice-page">
                <div className="invoice-container" style={{ textAlign: 'center' }}>
                    Order not found.
                </div>
            </div>
        );
    }

    // Check if user owns this order or is admin
    if (!isAdmin && order.userId !== user?.uid) {
        return (
            <div className="invoice-page">
                <div className="invoice-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
                    <h2 style={{ color: '#ef4444', marginBottom: '8px' }}>Access Denied</h2>
                    <p style={{ color: '#6b7280' }}>You don't have permission to view this invoice.</p>
                    <Link to="/" style={{ color: '#3b82f6', marginTop: '16px', display: 'inline-block' }}>
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Price breakdown. New orders store subtotal/shipping/tax explicitly;
    // legacy orders only stored `total`, so reconstruct from the line items.
    const itemsSubtotal = (order.items || []).reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );
    const shipping = Number(order.shipping ?? 100);
    const subtotal = Number(order.subtotal ?? itemsSubtotal);
    const tax = Number(order.tax ?? Math.max(0, Number(order.total) - subtotal - shipping));
    const invoiceTotals = { subtotal, shipping, tax };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="invoice-page">
            <div className="invoice-actions-bar">
                <Link to="/" className="invoice-back-link">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
                <button onClick={handlePrint} className="invoice-print-btn">
                    <Printer size={20} />
                    Print Invoice
                </button>
            </div>

            <div className="invoice-container">
                {/* Header */}
                <div className="invoice-header">
                    <div className="invoice-logo">
                        <div className="invoice-brand">
                            <Glasses size={32} />
                            <span>Metro Optics</span>
                        </div>
                        <div className="invoice-company-address">
                            123 Eye Care Lane<br />
                            Dhaka, Bangladesh<br />
                            support@metrooptics.com
                        </div>
                    </div>
                    <div className="invoice-details">
                        <h1 className="invoice-title">INVOICE</h1>
                        <div className="invoice-meta">
                            <p>#{order.id}</p>
                            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="invoice-addresses">
                    <div className="invoice-address">
                        <h3>Bill To</h3>
                        <p className="invoice-customer-name">{order.customerName}</p>
                        <p>{order.address}</p>
                        <p>{order.phone}</p>
                        <p>{order.email}</p>
                    </div>
                    <div className="invoice-payment-info">
                        <h3>Payment Method</h3>
                        <div className={`payment-badge ${order.paymentMethod === 'bKash' ? 'bkash' : 'cod'}`}>
                            {order.paymentMethod}
                        </div>
                        {order.paymentMethod === 'bKash' && (
                            <p className="trx-id">TRX ID: {order.transactionId}</p>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className="invoice-table-wrapper">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th className="text-center">Qty</th>
                                <th className="text-right">Price</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-meta">{item.lensType || item.category}</div>
                                    </td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-right">৳{item.price}</td>
                                    <td className="text-right font-bold">৳{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="invoice-footer-section">
                    <div className="invoice-totals">
                        <div className="invoice-total-row">
                            <span>Subtotal</span>
                            <span>৳{invoiceTotals.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="invoice-total-row">
                            <span>Shipping</span>
                            <span>৳{invoiceTotals.shipping.toLocaleString()}</span>
                        </div>
                        {invoiceTotals.tax > 0 && (
                            <div className="invoice-total-row">
                                <span>Tax (5%)</span>
                                <span>৳{invoiceTotals.tax.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="invoice-total-row final">
                            <span>Total</span>
                            <span>৳{Number(order.total).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Thank You */}
                <div className="invoice-thank-you">
                    <CheckCircle size={24} />
                    <span>Thank you for your order!</span>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
