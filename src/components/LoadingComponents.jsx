import React, { createContext, useContext } from 'react'
import { LoadingSpinner, LoadingCard } from '../components/ui'

const LoadingContext = createContext()

export const LoadingProvider = ({ children }) => {
  return (
    <LoadingContext.Provider value={{}}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

// Page Loading Component
export const PageLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  )
}

// Component Loading Component
export const ComponentLoading = ({ message = 'Loading...', size = 'md' }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <LoadingSpinner size={size} className="mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  )
}

// Product Grid Loading Skeleton
export const ProductGridLoading = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
      {Array.from({ length: count }, (_, i) => (
        <LoadingCard key={i}>
          <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        </LoadingCard>
      ))}
    </div>
  )
}

// Table Loading Skeleton
export const TableLoading = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div 
              key={colIndex} 
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded flex-1"
              style={{ 
                animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s` 
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Form Loading Skeleton
export const FormLoading = ({ fields = 4 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      ))}
      <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/4" />
    </div>
  )
}

// Stats Loading Skeleton
export const StatsLoading = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <LoadingCard key={i} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </LoadingCard>
      ))}
    </div>
  )
}

// Chart Loading Skeleton
export const ChartLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32" />
      </div>
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    </div>
  )
}

// MagnifyingGlass Loading Component
export const SearchLoading = () => {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <LoadingSpinner size="sm" />
      <span className="text-sm">Searching...</span>
    </div>
  )
}

// Image Loading Component
export const ImageLoading = ({ className = '', ...props }) => {
  return (
    <div 
      className={cn(
        'flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse',
        className
      )}
      {...props}
    >
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  )
}

// Button Loading Component
export const ButtonLoading = ({ loading, children, ...props }) => {
  return (
    <button 
      disabled={loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50',
        props.className
      )}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}