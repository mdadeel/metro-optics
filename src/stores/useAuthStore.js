import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, hasFirebaseConfig } from '../config/firebase';
import { toast } from 'sonner';

const DEMO_USERS = {
  'admin@metrooptics.com': {
    uid: 'demo-admin-001',
    email: 'admin@metrooptics.com',
    displayName: 'Admin User',
    role: 'admin',
    password: 'admin123',
  },
  'user@metrooptics.com': {
    uid: 'demo-user-001',
    email: 'user@metrooptics.com',
    displayName: 'Demo Customer',
    role: 'customer',
    password: 'user123',
  },
};

function getPersistedDemoUser() {
  if (typeof window === 'undefined' || hasFirebaseConfig) return null;
  try {
    const saved = localStorage.getItem('metro_demo_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const initialDemo = getPersistedDemoUser();

export const useAuthStore = create((set) => ({
  user: initialDemo,
  userRole: initialDemo?.role || null,
  isAdmin: initialDemo?.role === 'admin',
  loading: Boolean(hasFirebaseConfig && auth),
  hasFirebaseConfig,
  isDemoMode: !hasFirebaseConfig,

  initAuth: () => {
    if (!hasFirebaseConfig || !auth) {
      set({ loading: false });
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, userRole: null, isAdmin: false, loading: false });
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'customer';
        set({
          user: firebaseUser,
          userRole: role,
          isAdmin: role === 'admin',
          loading: false,
        });
      } catch {
        set({
          user: firebaseUser,
          userRole: 'customer',
          isAdmin: false,
          loading: false,
        });
      }
    });

    return unsubscribe;
  },

  login: async (email, password) => {
    if (!hasFirebaseConfig) {
      const demoUser = DEMO_USERS[email.toLowerCase().trim()];
      if (demoUser && demoUser.password === password) {
        const { password: _, ...safeUser } = demoUser;
        set({
          user: safeUser,
          userRole: demoUser.role,
          isAdmin: demoUser.role === 'admin',
        });
        localStorage.setItem('metro_demo_user', JSON.stringify(safeUser));
        toast.success(`Welcome back, ${safeUser.displayName}!`);
        return { user: safeUser, role: demoUser.role, isAdmin: demoUser.role === 'admin' };
      }
      throw new Error('Invalid demo credentials. Try admin@metrooptics.com / admin123');
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const role = userDoc.exists() ? userDoc.data().role : 'customer';
    const isAdmin = role === 'admin';

    set({ user: firebaseUser, userRole: role, isAdmin });
    return { user: firebaseUser, role, isAdmin };
  },

  register: async (email, password, displayName) => {
    if (!hasFirebaseConfig) {
      throw new Error('Registration requires active Firebase connection.');
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    await updateProfile(firebaseUser, { displayName });
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email,
      displayName,
      role: 'customer',
      createdAt: serverTimestamp(),
    });

    set({ user: firebaseUser, userRole: 'customer', isAdmin: false });
    toast.success('Account created successfully!');
    return { user: firebaseUser, role: 'customer' };
  },

  logout: async () => {
    if (!hasFirebaseConfig) {
      set({ user: null, userRole: null, isAdmin: false });
      localStorage.removeItem('metro_demo_user');
      toast.success('Logged out');
      return;
    }
    await firebaseSignOut(auth);
    set({ user: null, userRole: null, isAdmin: false });
    toast.success('Logged out');
  },
}));
