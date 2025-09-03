// app/hooks/use-vertical-scroll.ts
import { useRef, useEffect, RefObject } from 'react'

interface UseVerticalScrollOptions {
  /**
   * Kartlar arasındaki boşluk (pixel). Varsayılan değer: 12 (tailwind'in gap-3 değeri)
   */
  gap?: number
  /**
   * Scroll esnasında davranış türü. Varsayılan değer: 'smooth'
   */
  behavior?: ScrollBehavior
  /**
   * Yeniden boyutlandırma olayı için gecikme süresi (ms). Varsayılan değer: 100
   */
  resizeDebounce?: number
  /**
   * Kullanıcı bileşeni mount edildiğinde otomatik olarak butonların durumunu günceller
   */
  updateOnMount?: boolean
  /**
   * Özel bağımlılıklar. Bu değerlerden herhangi biri değiştiğinde scroll durumu güncellenir
   */
  dependencies?: any[]
}

interface UseVerticalScrollReturn {
  containerRef: RefObject<HTMLElement | null>
  cardRefs: {
    current: (HTMLElement | null)[]
  }
  btnUpRef: RefObject<HTMLButtonElement | null>
  btnDownRef: RefObject<HTMLButtonElement | null>
  handleScrollUp: () => void
  handleScrollDown: () => void
  updateButtonState: () => void
  isAtTop: boolean
  isAtBottom: boolean
}

/**
 * Dikey snap scroll özelliği için özelleştirilmiş hook.
 * Kart bazlı dikey kaydırma işlevselliği sağlar.
 */
export function useVerticalScroll({
  gap = 12,
  behavior = 'smooth',
  resizeDebounce = 100,
  updateOnMount = true,
  dependencies = [],
}: UseVerticalScrollOptions = {}): UseVerticalScrollReturn {
  const containerRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const btnUpRef = useRef<HTMLButtonElement | null>(null)
  const btnDownRef = useRef<HTMLButtonElement | null>(null)
  const isAtTopRef = useRef(true)
  const isAtBottomRef = useRef(false)

  const updateButtonState = () => {
    if (!containerRef.current || !btnUpRef.current || !btnDownRef.current) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtTop = scrollTop <= 0
    const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight

    // Butonların ariaDisabled özelliğini güncelle
    btnUpRef.current.ariaDisabled = isAtTop.toString()
    btnDownRef.current.ariaDisabled = isAtBottom.toString()

    // Referans değerlerini güncelle
    isAtTopRef.current = isAtTop
    isAtBottomRef.current = isAtBottom
  }

  const handleScroll = (direction: 'up' | 'down') => {
    if (!containerRef.current || cardRefs.current.length === 0) {
      return
    }

    // İlk kartın yüksekliğini ve margin değerini al
    const firstCard = cardRefs.current[0]
    if (!firstCard) {
      return
    }

    const cardHeight = firstCard.getBoundingClientRect().height
    const scrollAmount = cardHeight + gap
    const scrollOffset = direction === 'up' ? -scrollAmount : scrollAmount
    const currentScroll = containerRef.current.scrollTop

    // Scroll sınırlarını kontrol et
    const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight
    const targetScroll = currentScroll + scrollOffset

    // Scroll değerini sınırlar içinde tut
    const boundedScroll = Math.max(0, Math.min(targetScroll, maxScroll))

    containerRef.current.scrollTo({
      top: boundedScroll,
      behavior,
    })

    updateButtonState()
  }

  const handleScrollUp = () => handleScroll('up')
  const handleScrollDown = () => handleScroll('down')

  // Scroll olaylarını dinle
  useEffect(() => {
    const currentContainer = containerRef.current
    if (!currentContainer) return

    const handleScrollEvent = () => {
      updateButtonState()
    }

    // Scroll olay dinleyicisi
    currentContainer.addEventListener('scroll', handleScrollEvent)

    // Yeniden boyutlandırma olay dinleyicisi için debounce fonksiyonu
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        updateButtonState()
      }, resizeDebounce)
    }

    window.addEventListener('resize', handleResize)

    // İlk render'da buton durumunu güncelle
    if (updateOnMount) {
      updateButtonState()
    }

    return () => {
      currentContainer.removeEventListener('scroll', handleScrollEvent)
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [resizeDebounce, updateOnMount, ...dependencies])

  return {
    containerRef,
    cardRefs,
    btnUpRef,
    btnDownRef,
    handleScrollUp,
    handleScrollDown,
    updateButtonState,
    isAtTop: isAtTopRef.current,
    isAtBottom: isAtBottomRef.current,
  }
}
