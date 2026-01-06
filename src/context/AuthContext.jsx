import { createContext, useState, useContext, useEffect } from 'react';
// Context files commonly export both hook and provider component
// eslint-disable-next-line react-refresh/only-export-components
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            // Check admin status from Firestore user document (secure role-based check)
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    const userData = userDoc.data();
                    setIsAdmin(userData?.role === 'admin');
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Register new user
    const register = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with display name
            if (displayName) {
                await updateProfile(userCredential.user, { displayName });
            }

            // Create user document in Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                name: displayName || '',
                email: email,
                createdAt: new Date().toISOString(),
                role: 'customer'
            });

            toast.success('Account created!', {
                description: `Welcome, ${displayName}!`,
                duration: 3000,
            });
            return userCredential;
        } catch (error) {
            toast.error('Registration failed', {
                description: error.message,
                duration: 4000,
            });
            throw error;
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success('Welcome back!', {
                description: result.user.email,
                duration: 2000,
            });
            return result;
        } catch (error) {
            toast.error('Login failed', {
                description: error.message,
                duration: 4000,
            });
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out', {
                description: 'See you soon!',
                duration: 2000,
            });
        } catch (error) {
            toast.error('Logout failed', {
                description: error.message,
                duration: 3000,
            });
            throw error;
        }
    };

    // Google Sign In
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Check if user document exists, if not create it
            const userDocRef = doc(db, "users", result.user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    uid: result.user.uid,
                    name: result.user.displayName || '',
                    email: result.user.email,
                    createdAt: new Date().toISOString(),
                    role: 'customer',
                    addresses: [],     // Initialize arrays
                    prescriptions: []
                });
            }

            toast.success('Signed in with Google!', {
                description: `Welcome, ${result.user.displayName || result.user.email}!`,
                duration: 2000,
            });
            return result;
        } catch (error) {
            toast.error('Google sign-in failed', {
                description: error.message,
                duration: 4000,
            });
            throw error;
        }
    };

    // Password Reset
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent!', {
                description: 'Check your inbox for instructions',
                duration: 3000,
            });
        } catch (error) {
            toast.error('Failed to send reset email', {
                description: error.message,
                duration: 4000,
            });
            throw error;
        }
    };

    const value = {
        user,
        isAdmin,
        register,
        login,
        logout,
        signInWithGoogle,
        resetPassword,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
