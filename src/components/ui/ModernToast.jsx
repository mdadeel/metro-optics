import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const toastVariants = cva(
  'fixed top-4 right-4 max-w-sm w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-4 z-50 animate-in slide-in-from-right-full',
  {
    variants: {
      variant: {
        success: 'border-green-200 dark:border-green-800',
        error: 'border-red-200 dark:border-red-800',
        warning: 'border-amber-200 dark:border-amber-800',
        info: 'border-blue-200 dark:border-blue-800',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

const Toast = ({ title, description, variant, onClose, ...props }) => {
  const variantConfig = {
    success: {
      icon: '✓',
      iconClass: 'text-green-500',
      titleClass: 'text-green-900 dark:text-green-100',
    },
    error: {
      icon: '✕',
      iconClass: 'text-red-500',
      titleClass: 'text-red-900 dark:text-red-100',
    },
    warning: {
      icon: '⚠',
      iconClass: 'text-amber-500',
      titleClass: 'text-amber-900 dark:text-amber-100',
    },
    info: {
      icon: 'ℹ',
      iconClass: 'text-blue-500',
      titleClass: 'text-blue-900 dark:text-blue-100',
    },
  }

  const config = variantConfig[variant] || variantConfig.info

  return (
    <div className={cn(toastVariants({ variant }))} {...props}>
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold', config.iconClass)}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn('font-bold text-sm', config.titleClass)}>
            {title}
          </h4>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

Toast.displayName = 'Toast'

export { Toast, toastVariants }