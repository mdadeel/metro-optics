import { auth } from '../config/firebase'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { userRepository } from '../repositories'
import { useAuthStore } from '../store'
import { toast } from 'sonner'

export class AuthService {
  constructor() {
    this.auth = auth
    this.repository = userRepository
  }
  
  // Initialize auth state listener
  initializeAuth() {
    const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
      useAuthStore.getState().setUser(user)
      
      if (user) {
        // Check admin status
        try {
          const isAdmin = await this.repository.checkAdminStatus(user.uid)
          useAuthStore.getState().setAdminStatus(isAdmin)
        } catch (error) {
          console.error('Error checking admin status:', error)
          useAuthStore.getState().setAdminStatus(false)
        }
      } else {
        useAuthStore.getState().setAdminStatus(false)
      }
      
      useAuthStore.getState().setLoading(false)
    })
    
    return unsubscribe
  }
  
  // Register new user
  async register(email, password, displayName) {
    try {
      useAuthStore.getState().setLoading(true)
      
      // Validate input
      this.validateAuthInput(email, password)
      
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      
      // Create user document in Firestore
      await this.repository.createUserProfile(userCredential.user.uid, {
        email,
        displayName: displayName || '',
        role: 'customer',
        addresses: [],
        prescriptions: []
      })
      
      toast.success('Account created successfully!')
      return userCredential
    } catch (error) {
      this.handleAuthError(error, 'registration')
      throw error
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  }
  
  // Login user
  async login(email, password) {
    try {
      useAuthStore.getState().setLoading(true)
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      const result = await signInWithEmailAndPassword(this.auth, email, password)
      
      toast.success('Welcome back!')
      return result
    } catch (error) {
      this.handleAuthError(error, 'login')
      throw error
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  }
  
  // Google Sign In
  async signInWithGoogle() {
    try {
      useAuthStore.getState().setLoading(true)
      
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(this.auth, provider)
      
      // Check if user document exists, if not create it
      const userDoc = await this.repository.getUserProfile(result.user.uid)
      
      if (!userDoc) {
        await this.repository.createUserProfile(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName || '',
          role: 'customer',
          addresses: [],
          prescriptions: [],
          photoURL: result.user.photoURL
        })
      }
      
      toast.success('Signed in with Google!')
      return result
    } catch (error) {
      this.handleAuthError(error, 'Google sign-in')
      throw error
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  }
  
  // Logout user
  async logout() {
    try {
      await signOut(this.auth)
      
      useAuthStore.getState().logout()
      toast.success('Logged out successfully')
      
      return true
    } catch (error) {
      toast.error('Failed to logout')
      throw error
    }
  }
  
  // Password Reset
  async resetPassword(email) {
    try {
      if (!email) {
        throw new Error('Email is required')
      }
      
      await sendPasswordResetEmail(this.auth, email)
      
      toast.success('Password reset email sent!')
      return true
    } catch (error) {
      this.handleAuthError(error, 'password reset')
      throw error
    }
  }
  
  // Update user profile
  async updateProfile(updates) {
    try {
      const { user } = useAuthStore.getState()
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      useAuthStore.getState().setLoading(true)
      
      // Update Firebase Auth profile if displayName or photoURL is provided
      const authUpdates = {}
      if (updates.displayName) authUpdates.displayName = updates.displayName
      if (updates.photoURL) authUpdates.photoURL = updates.photoURL
      
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(user, authUpdates)
      }
      
      // Update Firestore document
      await this.repository.updateUserProfile(user.uid, updates)
      
      toast.success('Profile updated successfully!')
      return true
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`)
      throw error
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  }
  
  // Auth validation
  validateAuthInput(email, password) {
    const errors = []
    
    if (!email) {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format')
    }
    
    if (!password) {
      errors.push('Password is required')
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters')
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
    
    return true
  }
  
  // Auth error handling
  handleAuthError(error, operation) {
    let message = `${operation} failed`
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email'
        break
      case 'auth/wrong-password':
        message = 'Incorrect password'
        break
      case 'auth/email-already-in-use':
        message = 'Email already registered'
        break
      case 'auth/weak-password':
        message = 'Password is too weak'
        break
      case 'auth/invalid-email':
        message = 'Invalid email address'
        break
      case 'auth/user-disabled':
        message = 'Account has been disabled'
        break
      case 'auth/too-many-requests':
        message = 'Too many requests. Try again later'
        break
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed'
        break
      case 'auth/popup-blocked':
        message = 'Sign-in popup was blocked'
        break
      default:
        message = error.message || message
    }
    
    toast.error(message)
  }
  
  // Check if user is admin
  async isAdmin(userId = null) {
    try {
      const { user } = useAuthStore.getState()
      const uid = userId || user?.uid
      
      if (!uid) return false
      
      return await this.repository.checkAdminStatus(uid)
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }
  
  // Get current user
  getCurrentUser() {
    return this.auth.currentUser
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!this.auth.currentUser
  }
}

// Create singleton instance
export const authService = new AuthService()