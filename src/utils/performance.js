import { memo, useMemo, useCallback } from 'react'

// HOC for component memoization
export const withMemo = (Component, areEqual = null) => {
  return memo(Component, areEqual)
}

// HOC for performance monitoring
export const withPerformanceMonitor = (WrappedComponent, componentName) => {
  const WithPerformanceMonitor = (props) => {
    const startTime = performance.now()
    
    // Measure render performance
    React.useEffect(() => {
      const endTime = performance.now()
      console.log(`${componentName} rendered in ${endTime - startTime}ms`)
    })
    
    return <WrappedComponent {...props} />
  }
  
  WithPerformanceMonitor.displayName = `withPerformanceMonitor(${componentName})`
  return WithPerformanceMonitor
}

// HOC for error boundary
export const withErrorBoundary = (WrappedComponent, fallback) => {
  const WithErrorBoundary = (props) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )
  
  WithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || 'Component'})`
  return WithErrorBoundary
}

// Optimized list component
export const OptimizedList = memo(({ 
  items, 
  renderItem, 
  getItemKey, 
  itemHeight, 
  containerHeight,
  className 
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleItems = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount, items.length)
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      key: getItemKey(item, startIndex + index)
    }))
  }, [items, scrollTop, itemHeight, containerHeight, getItemKey])
  
  const totalHeight = items.length * itemHeight
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])
  
  return (
    <div 
      className={className}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, key }) => (
          <div
            key={key}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
})

// Optimized image component
export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className, 
  placeholder = true,
  lazy = true,
  onLoad,
  onError 
}) => {
  const [imageSrc, setImageSrc] = useState(lazy ? null : src)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  const imgRef = useRef()
  
  useEffect(() => {
    if (!lazy || !src) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [lazy, src])
  
  const handleLoad = useCallback((e) => {
    setLoading(false)
    setError(false)
    onLoad?.(e)
  }, [onLoad])
  
  const handleError = useCallback((e) => {
    setLoading(false)
    setError(true)
    onError?.(e)
  }, [onError])
  
  return (
    <div className={cn('relative', className)}>
      {loading && placeholder && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
      )}
      
      {error && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Failed to load image</span>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity',
          loading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
})

// Optimized text input with debounced onChange
export const OptimizedInput = memo(({ 
  value, 
  onChange, 
  debounceMs = 300,
  className,
  ...props 
}) => {
  const [inputValue, setInputValue] = useState(value || '')
  const debouncedOnChange = useMemo(
    () => debounce(onChange, debounceMs),
    [onChange, debounceMs]
  )
  
  useEffect(() => {
    setInputValue(value || '')
  }, [value])
  
  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    debouncedOnChange(newValue)
  }, [debouncedOnChange])
  
  return (
    <input
      {...props}
      value={inputValue}
      onChange={handleChange}
      className={className}
    />
  )
})

// Optimized select component
export const OptimizedSelect = memo(({ 
  options, 
  value, 
  onChange, 
  className,
  ...props 
}) => {
  const handleChange = useCallback((e) => {
    onChange?.(e.target.value)
  }, [onChange])
  
  return (
    <select
      {...props}
      value={value}
      onChange={handleChange}
      className={className}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
})

// CSS-in-JS optimization
export const createOptimizedStyles = (styles) => {
  return useMemo(() => styles, [styles])
}

// Animation frame hook
export const useAnimationFrame = (callback) => {
  const frameRef = useRef()
  
  useEffect(() => {
    const animate = () => {
      callback()
      frameRef.current = requestAnimationFrame(animate)
    }
    
    frameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [callback])
}

// Web worker for heavy computations
export const useWebWorker = (workerScript, onMessage, onError) => {
  const [worker, setWorker] = useState(null)
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    const w = new Worker(workerScript)
    
    w.onmessage = (e) => {
      setIsReady(true)
      onMessage?.(e.data)
    }
    
    w.onerror = (e) => {
      onError?.(e)
    }
    
    setWorker(w)
    
    return () => {
      w.terminate()
    }
  }, [workerScript, onMessage, onError])
  
  const postMessage = useCallback((data) => {
    if (worker && isReady) {
      worker.postMessage(data)
    }
  }, [worker, isReady])
  
  return { worker, isReady, postMessage }
}