import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import { authService } from './services'
import { useAuthStore } from './store'
import { useEffect } from 'react'

// Import existing components that work
import App from './App' // Reuse existing App for now

// Initialize auth service
const AppInitializer = ({ children }) => {
  const { setLoading } = useAuthStore()
  
  useEffect(() => {
    const unsubscribe = authService.initializeAuth()
    return unsubscribe
  }, [setLoading])
  
  return children
}

// Wrapper to add new architecture features to existing App
function ModernApp() {
  return (
    <ErrorBoundary>
      <AppInitializer>
        <div className="min-h-screen">
          <App />
        </div>
        
        {/* Enhanced Toast Notifications */}
        <Toaster 
          position="top-right" 
          richColors 
          className="z-50"
          toastOptions={{
            duration: 4000,
          }}
        />
      </AppInitializer>
    </ErrorBoundary>
  )
}

export default ModernApp