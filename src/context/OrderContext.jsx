import { createContext, useState, useEffect, useContext } from 'react';
// Context files commonly export both hook and provider component
// eslint-disable-next-line react-refresh/only-export-components
import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

// eslint-disable-next-line react-refresh/only-export-components
export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAdmin } = useAuth();

    useEffect(() => {
        // Don't subscribe if no user is logged in
        if (!user) {
            setOrders(prev => {
                if (prev.length > 0) return [];
                return prev;
            });
            setLoading(prev => {
                if (prev) return false;
                return prev;
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
            return;
        }

        // Security: Admins see all orders, regular users only see their own
        let q;
        if (isAdmin) {
            // Admins can view all orders
            q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        } else {
            // Regular users only see their own orders (prevents data leakage)
            q = query(
                collection(db, 'orders'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const orderList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(orderList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders: ", error);
            // Fallback to empty list for demo/offline mode
            console.warn("Falling back to empty order list (Offline/Demo mode)");
            setOrders([]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, isAdmin]);

    const createOrder = async (orderData) => {
        try {
            const newOrder = {
                createdAt: new Date().toISOString(),
                status: 'pending',
                ...orderData
            };
            const docRef = await addDoc(collection(db, 'orders'), newOrder);
            // toast.success("Order placed successfully!"); // Usually handled in Checkout page
            return docRef.id;
        } catch (error) {
            console.error("Error creating order: ", error);
            toast.error("Failed to place order");
            throw error;
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const orderRef = doc(db, 'orders', id);
            await updateDoc(orderRef, { status });
            toast.success(`Order status updated to ${status}`);
        } catch (error) {
            console.error("Error updating order status: ", error);
            toast.error("Failed to update status");
        }
    };

    const getOrderById = (id) => {
        return orders.find(order => order.id === id);
    };

    return (
        <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, getOrderById, loading }}>
            {children}
        </OrderContext.Provider>
    );
};
