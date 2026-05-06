import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const modernButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
        secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700',
        outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        luxury: 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        xl: 'px-10 py-5 text-lg',
        icon: 'p-2',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

const ModernButton = React.forwardRef(({ className, variant, size, fullWidth, children, ...props }, ref) => {
  return (
    <button
      className={cn(modernButtonVariants({ variant, size, fullWidth }), className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

ModernButton.displayName = 'ModernButton'

export { ModernButton, modernButtonVariants }