import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { MagnifyingGlass as Search, Package, Truck, CheckCircle, Clock, SignIn } from "@phosphor-icons/react";

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');
    const { getOrderById, fetchOrderById, loading } = useOrders();
    const { user } = useAuth();

    const handleTrack = async (e) => {
        e.preventDefault();
        const id = orderId.trim();
        if (!id) return;

        // Firestore document IDs are strings — never coerce with Number()
        const localOrder = getOrderById(id);
        if (localOrder) {
            setOrder(localOrder);
            setSearched(true);
            setError('');
            return;
        }

        // Fall back to a direct Firestore read (rules allow users to read
        // only their own orders, so this is IDOR-safe)
        const fetched = await fetchOrderById(id);
        if (fetched) {
            setOrder(fetched);
            setError('');
        } else {
            setOrder(null);
            setError('Order not found. Please check the ID and try again.');
        }
        setSearched(true);
    };

    const steps = [
        { status: 'pending', label: 'Order Placed', icon: Clock, description: 'We have received your order.' },
        { status: 'processing', label: 'Processing', icon: Package, description: 'We are preparing your items.' },
        { status: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way.' },
        { status: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Package delivered successfully.' },
    ];

    // Match statuses case-insensitively so both 'pending' and 'Pending' work
    const getCurrentStepIndex = (status) => {
        if (!status) return -1;
        const normalized = String(status).toLowerCase();
        return steps.findIndex(s => s.status === normalized);
    };

    const currentStepIndex = order ? getCurrentStepIndex(order.status) : -1;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
                <p className="text-gray-500">Sign in with the account used at checkout, then enter your Order ID to see the current status.</p>
            </div>

            {/* Search Box */}
            <div className="max-w-md mx-auto mb-12">
                <form onSubmit={handleTrack} className="relative">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter Order ID (e.g., 4K9fTq2ZxR...)"
                        className="w-full px-6 py-4 pr-12 rounded-full border-2 border-gray-200 focus:border-primary focus:ring-primary outline-none text-lg shadow-sm transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                        aria-label="Track order"
                    >
                        <Search className="w-6 h-6" />
                    </button>
                </form>
                {!user && !error && !order && (
                    <p className="text-gray-500 text-center mt-4 flex items-center justify-center gap-1.5">
                        <SignIn size={16} aria-hidden="true" />
                        <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                        &nbsp;to track your orders
                    </p>
                )}
                {error && <p className="text-red-500 text-center mt-4" role="alert">{error}</p>}
            </div>

            {/* Loading state from orders subscription */}
            {user && loading && !searched && (
                <p className="text-center text-gray-500">Loading your orders…</p>
            )}

            {/* Timeline Result */}
            {order && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="text-xl font-bold text-gray-900">#{order.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-xl font-bold text-primary">৳{order.total}</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

                        <div className="space-y-12">
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const Icon = step.icon;

                                return (
                                    <div key={step.status} className="relative flex items-start group">
                                        {/* Dot / Icon */}
                                        <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-500 ${isCompleted
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-white border-gray-200 text-gray-300'
                                            }`}>
                                            <Icon className="w-8 h-8" />
                                        </div>

                                        {/* Content */}
                                        <div className="ml-6 pt-2">
                                            <h3 className={`text-lg font-bold transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                                                }`}>
                                                {step.label}
                                            </h3>
                                            <p className={`text-sm transition-colors ${isCompleted ? 'text-gray-600' : 'text-gray-300'
                                                }`}>
                                                {step.description}
                                            </p>
                                            {isCurrent && (
                                                <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full animate-pulse">
                                                    Current Status
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
