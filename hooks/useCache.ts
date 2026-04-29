'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface CacheConfig {
  ttl?: number // Time to live in ms
  revalidateOnFocus?: boolean
}

const MEMORY_CACHE = new Map<string, { data: any, timestamp: number }>()

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig = {}
) {
  const { ttl = 60_000, revalidateOnFocus = true } = config
  const [data, setData] = useState<T | null>(() => {
    // Initial load from memory cache
    const cached = MEMORY_CACHE.get(key)
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }
    return null
  })
  const [loading, setLoading] = useState(!data)
  const [error, setError] = useState<Error | null>(null)
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  const executeFetch = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    try {
      const result = await fetcherRef.current()
      MEMORY_CACHE.set(key, { data: result, timestamp: Date.now() })
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [key])

  useEffect(() => {
    const cached = MEMORY_CACHE.get(key)
    
    // If no cache or cache expired, fetch
    if (!cached || Date.now() - cached.timestamp > ttl) {
      executeFetch()
    } else if (!data) {
      // If we have valid cache but state is null (e.g. first mount), set it
      setData(cached.data)
      setLoading(false)
    }

    // Optional: Background revalidation if cache exists but is slightly old
    if (cached && Date.now() - cached.timestamp > ttl / 2) {
      executeFetch(true)
    }
  }, [key, ttl, executeFetch, data])

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return

    const handleFocus = () => {
      executeFetch(true)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [revalidateOnFocus, executeFetch])

  return { data, loading, error, mutate: executeFetch }
}
