import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, hasFirebaseConfig } from '../config/firebase';
import { toast } from 'sonner';

const AuthContext = createContext(null);

// DEMO USERS for offline development
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

function getInitialDemoUser() {
  if (typeof window === 'undefined' || hasFirebaseConfig) return null;
  try {
    const saved = localStorage.getItem('metro_demo_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getInitialDemoUser());
  const [userRole, setUserRole] = useState(() => getInitialDemoUser()?.role || null);
  const [isAdmin, setIsAdmin] = useState(() => getInitialDemoUser()?.role === 'admin');
  const [loading, setLoading] = useState(() => Boolean(hasFirebaseConfig && auth));

  // Single source of truth for auth state
  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUserRole(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Fetch role BEFORE setting user state to prevent race condition
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'customer';

        setUser(firebaseUser);
        setUserRole(role);
        setIsAdmin(role === 'admin');
      } catch (err) {
        console.error('Failed to fetch user role:', err);
        setUser(firebaseUser);
        setUserRole('customer');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // login now RETURNS { user, role, isAdmin } so callers can await verification
  const login = useCallback(async (email, password) => {
    // --- DEMO MODE ---
    if (!hasFirebaseConfig || !auth) {
      const demoUser = DEMO_USERS[email];
      if (demoUser && demoUser.password === password) {
        const { password: _, ...safeUser } = demoUser;
        setUser(safeUser);
        setUserRole(demoUser.role);
        setIsAdmin(demoUser.role === 'admin');
        localStorage.setItem('metro_demo_user', JSON.stringify(safeUser));
        toast.success(`Welcome back, ${safeUser.displayName}!`);
        return { user: safeUser, role: demoUser.role, isAdmin: demoUser.role === 'admin' };
      }
      throw new Error('Invalid demo credentials. Use admin@metrooptics.com / admin123 or user@metrooptics.com / user123');
    }

    // --- LIVE FIREBASE ---
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    // Await role fetch BEFORE returning
    let role = 'customer';
    if (db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        role = userDoc.exists() ? userDoc.data().role : 'customer';
      } catch (e) {
        console.warn('Could not fetch user role directly:', e);
      }
    }

    // Force state update synchronously so AdminRoute sees correct isAdmin
    setUser(firebaseUser);
    setUserRole(role);
    setIsAdmin(role === 'admin');

    toast.success('Welcome back!', {
      description: firebaseUser.email,
      duration: 2000,
    });
    return { user: firebaseUser, role, isAdmin: role === 'admin' };
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    if (!hasFirebaseConfig || !auth) {
      throw new Error(
        'Registration requires Firebase. Please configure VITE_FIREBASE_* env vars.'
      );
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    if (displayName) {
      await updateProfile(firebaseUser, { displayName });
    }

    if (db) {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email,
        name: displayName || '',
        role: 'customer',
        createdAt: serverTimestamp(),
      });
    }

    setUser(firebaseUser);
    setUserRole('customer');
    setIsAdmin(false);

    toast.success('Account created successfully!');
    return { user: firebaseUser, role: 'customer', isAdmin: false };
  }, []);

  const logout = useCallback(async () => {
    if (!hasFirebaseConfig || !auth) {
      setUser(null);
      setUserRole(null);
      setIsAdmin(false);
      localStorage.removeItem('metro_demo_user');
      toast.success('Logged out');
      return;
    }
    await firebaseSignOut(auth);
    setUser(null);
    setUserRole(null);
    setIsAdmin(false);
    toast.success('Logged out');
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!hasFirebaseConfig || !auth) {
      throw new Error('Google Sign-In requires Firebase configuration.');
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    if (db) {
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: result.user.uid,
          name: result.user.displayName || '',
          email: result.user.email,
          createdAt: serverTimestamp(),
          role: 'customer',
        });
      }
    }

    setUser(result.user);
    setUserRole('customer');
    setIsAdmin(false);
    toast.success('Signed in with Google!');
    return result;
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!hasFirebaseConfig || !auth) {
      throw new Error('Password reset requires Firebase configuration.');
    }
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent!', {
      description: 'Check your inbox for instructions',
      duration: 3000,
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      userRole,
      isAdmin,
      loading,
      login,
      register,
      logout,
      signInWithGoogle,
      resetPassword,
      hasFirebaseConfig,
      isDemoMode: !hasFirebaseConfig || !auth,
    }),
    [user, userRole, isAdmin, loading, login, register, logout, signInWithGoogle, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
