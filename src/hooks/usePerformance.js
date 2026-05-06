import { useCallback, useMemo, useRef, useEffect } from 'react'

// Memoization helper
export const memoize = (fn) => {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// Expensive computation hook
export const useExpensiveComputation = (compute, dependencies) => {
  return useMemo(compute, dependencies)
}

// Stable callback hook
export const useStableCallback = (callback, dependencies) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  return useCallback((...args) => callbackRef.current(...args), dependencies)
}

// Deep comparison helper
export const useDeepCompareMemo = (value) => {
  const ref = useRef()
  const signalRef = useRef(0)

  if (!isEqual(value, ref.current)) {
    ref.current = value
    signalRef.current += 1
  }

  return useMemo(() => ref.current, [signalRef.current])
}

// Simple deep equality check
const isEqual = (a, b) => {
  if (a === b) return true
  
  if (a == null || typeof a !== 'object') return false
  if (b == null || typeof b !== 'object') return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key) || !isEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}

// Performance monitoring hook
export const usePerformanceMonitor = (name) => {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      console.log(`${name} took ${endTime - startTime} milliseconds`)
    }
  }, [name])
}

// Virtual scrolling helper
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount, items.length)
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }))
  }, [items, startIndex, endIndex])
  
  const totalHeight = items.length * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    onScroll: useCallback((e) => {
      setScrollTop(e.target.scrollTop)
    }, []),
    offsetY: startIndex * itemHeight
  }
}

// Image lazy loading hook
export const useLazyImage = (src) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (!src) return
    
    setLoading(true)
    setError(null)
    
    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setLoading(false)
    }
    img.onerror = () => {
      setError('Failed to load image')
      setLoading(false)
    }
    img.src = src
  }, [src])
  
  return { imageSrc, loading, error }
}

// Optimized search hook
export const useOptimizedSearch = (items, searchFn, delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  
  const debouncedSearch = useMemo(() => {
    return debounce((term) => {
      if (!term.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }
      
      setIsSearching(true)
      const results = searchFn(items, term)
      setSearchResults(results)
      setIsSearching(false)
    }, delay)
  }, [searchFn, delay])
  
  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])
  
  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching
  }
}

// Debounce function
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, wait) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, wait)
    }
  }
}

// Batch state updates
export const useBatchedUpdates = () => {
  const [updates, setUpdates] = useState([])
  const timeoutRef = useRef()
  
  const batchUpdate = useCallback((update) => {
    setUpdates(prev => [...prev, update])
    
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setUpdates([])
    }, 16) // ~60fps
  }, [])
  
  return { updates, batchUpdate }
}

// Render cache hook
export const useRenderCache = () => {
  const cache = useRef(new Map())
  
  const getCachedRender = useCallback((key, renderFn) => {
    if (cache.current.has(key)) {
      return cache.current.get(key)
    }
    
    const result = renderFn()
    cache.current.set(key, result)
    
    // Limit cache size
    if (cache.current.size > 100) {
      const firstKey = cache.current.keys().next().value
      cache.current.delete(firstKey)
    }
    
    return result
  }, [])
  
  const clearCache = useCallback(() => {
    cache.current.clear()
  }, [])
  
  return { getCachedRender, clearCache }
}

// Intersection observer for multiple elements
export const useMultipleIntersectionObserver = (refs, options = {}) => {
  const [visibleElements, setVisibleElements] = useState(new Set())
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = new Set()
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visible.add(entry.target)
        } else {
          visible.delete(entry.target)
        }
      })
      
      setVisibleElements(visible)
    }, options)
    
    refs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })
    
    return () => {
      refs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
      observer.disconnect()
    }
  }, [refs, options])
  
  return visibleElements
}

// Optimized resize observer
export const useResizeObserver = (ref, callback) => {
  useEffect(() => {
    if (!ref.current) return
    
    const resizeObserver = new ResizeObserver(callback)
    resizeObserver.observe(ref.current)
    
    return () => {
      resizeObserver.disconnect()
    }
  }, [ref, callback])
}

// Performance metrics hook
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    componentCount: 0,
    reRenderCount: 0
  })
  
  const measureRender = useCallback(() => {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      const renderTime = end - start
      
      setMetrics(prev => ({
        renderTime: prev.renderTime + renderTime,
        reRenderCount: prev.reRenderCount + 1
      }))
    }
  }, [])
  
  return { metrics, measureRender }
}