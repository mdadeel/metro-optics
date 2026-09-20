import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../config/firebase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const OrderContext = createContext(null);

// localStorage helpers for demo mode
const DEMO_ORDERS_KEY = 'metro_demo_orders';

function getDemoOrders() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveDemoOrders(orders) {
  try {
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save demo orders:', e);
  }
}

export function OrderProvider({ children }) {
  const { user, isAdmin, isDemoMode } = useAuth();
  const isDemo = isDemoMode || !hasFirebaseConfig || !db;

  const [orders, setOrders] = useState(() => {
    return (!hasFirebaseConfig || !db) ? getDemoOrders() : [];
  });
  const [loading, setLoading] = useState(false);
  const unsubscribeRef = useRef(null);

  const [prevUserId, setPrevUserId] = useState(user?.uid || null);
  if (prevUserId !== (user?.uid || null)) {
    setPrevUserId(user?.uid || null);
    if (!isDemo) {
      setOrders([]);
    }
  }

  // Live Firestore subscription when connected
  useEffect(() => {
    if (!user || isDemo) {
      return;
    }

    try {
      let q;
      if (isAdmin) {
        q = query(collection(db, 'orders'));
      } else {
        q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
      }

      unsubscribeRef.current = onSnapshot(
        q,
        (snapshot) => {
          const fetched = snapshot.docs
            .map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }))
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          setOrders(fetched);
          setLoading(false);
        },
        (err) => {
          console.error('Orders snapshot error:', err);
          setLoading(false);
          toast.error('Failed to load orders');
        }
      );
    } catch (err) {
      console.error('Orders query error:', err);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user, isAdmin, isDemo]);

  // createOrder returns string orderId for seamless navigation to /invoice/:id
  const createOrder = useCallback(
    async (orderData) => {
      const orderPayload = {
        ...orderData,
        userId: user?.uid || null,
        userEmail: user?.email || orderData.email,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // --- DEMO MODE ---
      if (isDemoMode || !hasFirebaseConfig || !db) {
        const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const newOrder = {
          id: orderId,
          ...orderPayload,
        };
        const existing = getDemoOrders();
        existing.unshift(newOrder);
        saveDemoOrders(existing);
        setOrders((prev) => [newOrder, ...prev]);
        toast.success('Order placed successfully!');
        return orderId;
      }

      // --- LIVE FIREBASE ---
      try {
        const docRef = await addDoc(collection(db, 'orders'), orderPayload);
        toast.success('Order placed successfully!');
        return docRef.id;
      } catch (err) {
        console.error('Create order error:', err);
        toast.error('Failed to place order');
        throw err;
      }
    },
    [user, isDemoMode]
  );

  const updateOrderStatus = useCallback(
    async (id, status) => {
      if (isDemoMode || !hasFirebaseConfig || !db) {
        const allDemo = getDemoOrders().map((o) =>
          o.id === id ? { ...o, status } : o
        );
        saveDemoOrders(allDemo);
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        toast.success(`Order status updated to ${status}`);
        return;
      }

      try {
        const orderRef = doc(db, 'orders', id);
        await updateDoc(orderRef, { status });
        toast.success(`Order status updated to ${status}`);
      } catch (err) {
        console.error('Error updating order status:', err);
        toast.error('Failed to update status');
      }
    },
    [isDemoMode]
  );

  const getOrderById = useCallback(
    (id) => orders.find((order) => order.id === id),
    [orders]
  );

  const fetchOrderById = useCallback(
    async (id) => {
      if (!id) return null;
      if (isDemoMode || !hasFirebaseConfig || !db) {
        return getDemoOrders().find((o) => o.id === id) || null;
      }
      try {
        const snap = await getDoc(doc(db, 'orders', id));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
      } catch (err) {
        console.error('Error fetching order:', err);
        return null;
      }
    },
    [isDemoMode]
  );

  const value = useMemo(() => {
    const visibleOrders = isDemo
      ? (!user ? [] : isAdmin ? orders : orders.filter((o) => !o.userId || o.userId === user?.uid))
      : orders;

    return {
      orders: visibleOrders,
      loading,
      createOrder,
      updateOrderStatus,
      getOrderById,
      fetchOrderById,
    };
  }, [isDemo, user, isAdmin, orders, loading, createOrder, updateOrderStatus, getOrderById, fetchOrderById]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}

export default OrderContext;
