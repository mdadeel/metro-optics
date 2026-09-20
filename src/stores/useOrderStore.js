import { create } from 'zustand';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../config/firebase';
import { toast } from 'sonner';

const DEMO_ORDERS_KEY = 'metro_demo_orders';

function getStoredDemoOrders() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveStoredDemoOrders(orders) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save demo orders:', e);
  }
}

export const useOrderStore = create((set, get) => ({
  orders: getStoredDemoOrders(),
  loading: false,

  fetchUserOrders: (user) => {
    if (!user) {
      set({ orders: [], loading: false });
      return () => {};
    }

    if (!hasFirebaseConfig || !db) {
      const all = getStoredDemoOrders();
      const filtered = all.filter((o) => o.userId === user.uid);
      set({ orders: filtered, loading: false });
      return () => {};
    }

    set({ loading: true });
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          set({ orders: list, loading: false });
        },
        (err) => {
          console.warn('Orders snapshot error:', err);
          set({ loading: false });
        }
      );
      return unsubscribe;
    } catch {
      set({ loading: false });
      return () => {};
    }
  },

  createOrder: async (user, orderData) => {
    if (!user) throw new Error('Must be logged in to place an order');

    const orderPayload = {
      ...orderData,
      userId: user.uid,
      userEmail: user.email,
      status: 'confirmed',
    };

    if (!hasFirebaseConfig || !db) {
      const demoOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        ...orderPayload,
        createdAt: new Date().toISOString(),
      };
      const existing = getStoredDemoOrders();
      const updated = [demoOrder, ...existing];
      saveStoredDemoOrders(updated);
      set({ orders: updated.filter((o) => o.userId === user.uid) });
      toast.success('Order placed successfully! (Demo Mode)');
      return demoOrder;
    }

    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderPayload,
        createdAt: serverTimestamp(),
      });
      toast.success('Order placed successfully!');
      return { id: docRef.id, ...orderPayload };
    } catch (err) {
      toast.error('Failed to create order');
      throw err;
    }
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => String(o.id) === String(orderId));
  },
}));
