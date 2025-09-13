// src/hooks/use-search.ts
import { useState, useRef, useEffect, useCallback } from 'react'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UseSearchState<T = any> {
  suggestions: T[]
  isLoading: boolean
  error: string | null
  isOpen: boolean
  selectedIndex: number
}

export interface UseSearchOptions<T = any> {
  // API Configuration
  fetchSuggestions?: (query: string) => Promise<T[]>
  debounceMs?: number
  minSearchLength?: number
  maxSuggestions?: number

  // Static suggestions (recent, popular etc.)
  staticSuggestions?: T[]

  // Callbacks
  onSelect?: (suggestion: T) => void
  onOpen?: () => void
  onClose?: () => void
}

export interface UseSearchReturn<T = any> {
  // State
  state: UseSearchState<T>

  // Refs
  inputRef: any

  // Input handlers
  inputProps: React.ComponentProps<'input'>

  // Methods
  selectSuggestion: (suggestion: T) => void
  closeSuggestions: () => void
  openSuggestions: () => void
  clearSuggestions: () => void
}

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// ============================================================================
// USE SEARCH HOOK
// ============================================================================

export const useSearch = <T = any>(
  value: string,
  onChange: (value: string) => void,
  options: UseSearchOptions<T> = {},
): UseSearchReturn<T> => {
  const {
    fetchSuggestions,
    debounceMs = 300,
    minSearchLength = 2,
    maxSuggestions = 8,
    staticSuggestions = [],
    onSelect,
    onOpen,
    onClose,
  } = options

  // State
  const [suggestions, setSuggestions] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)

  // ============================================================================
  // DEBOUNCED SEARCH LOGIC
  // ============================================================================

  const debouncedFetch = useCallback(
    debounce(async (query: string) => {
      if (!fetchSuggestions || query.length < minSearchLength) {
        setSuggestions([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const results = await fetchSuggestions(query)
        setSuggestions(results.slice(0, maxSuggestions))
      } catch (err) {
        console.error('Search suggestions fetch error:', err)
        setError('Arama önerileri yüklenirken bir hata oluştu')
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs),
    [fetchSuggestions, debounceMs, minSearchLength, maxSuggestions],
  )

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (value.trim()) {
      debouncedFetch(value.trim())
    } else {
      setSuggestions([])
      setIsLoading(false)
      setError(null)
    }
  }, [value, debouncedFetch])

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  // API'den gelen suggestions varsa onları kullan, yoksa static suggestions'ı kullan
  const displaySuggestions =
    value.trim() && value.length >= minSearchLength ? suggestions : staticSuggestions

  // ============================================================================
  // METHODS
  // ============================================================================

  const openSuggestions = useCallback(() => {
    setIsOpen(true)
    onOpen?.()
  }, [onOpen])

  const closeSuggestions = useCallback(() => {
    setIsOpen(false)
    setSelectedIndex(-1)
    onClose?.()
  }, [onClose])

  const selectSuggestion = useCallback(
    (suggestion: T) => {
      onSelect?.(suggestion)
      closeSuggestions()
    },
    [onSelect, closeSuggestions],
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
    setIsLoading(false)
  }, [])

  // ============================================================================
  // INPUT HANDLERS
  // ============================================================================

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      onChange(newValue)
      setSelectedIndex(-1)

      if (!isOpen) {
        openSuggestions()
      }
    },
    [onChange, isOpen, openSuggestions],
  )

  const handleInputFocus = useCallback(() => {
    openSuggestions()
  }, [openSuggestions])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || displaySuggestions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < displaySuggestions.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displaySuggestions.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && displaySuggestions[selectedIndex]) {
            selectSuggestion(displaySuggestions[selectedIndex])
          }
          break
        case 'Escape':
          closeSuggestions()
          inputRef.current?.blur()
          break
      }
    },
    [isOpen, displaySuggestions, selectedIndex, selectSuggestion, closeSuggestions],
  )

  // ============================================================================
  // RETURN OBJECT
  // ============================================================================

  const state: UseSearchState<T> = {
    suggestions: displaySuggestions,
    isLoading,
    error,
    isOpen,
    selectedIndex,
  }

  const inputProps = {
    ref: inputRef,
    type: 'text' as const,
    onChange: handleInputChange,
    onFocus: handleInputFocus,
    onKeyDown: handleKeyDown,
  }

  return {
    state,
    inputRef,
    inputProps,
    selectSuggestion,
    closeSuggestions,
    openSuggestions,
    clearSuggestions,
  }
}

// ============================================================================
// DISPLAY NAME
// ============================================================================

useSearch.displayName = 'useSearch'
