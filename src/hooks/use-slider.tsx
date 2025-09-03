import { useState, useEffect } from 'react'

const useSlider = (totalSlides: number) => {
  const [activeSlide, setActiveSlide] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides)
    }, 5000) // 5 saniyede bir değişim

    return () => clearInterval(interval)
  }, [activeSlide, isAutoPlaying, totalSlides])

  const goToSlide = (slideIndex: number) => {
    setActiveSlide(slideIndex)
    setIsAutoPlaying(false) // Manuel tıklamada auto-play'i durdur

    // 10 saniye sonra auto-play'i tekrar başlat
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return {
    activeSlide,
    goToSlide,
    isAutoPlaying,
  }
}

export default useSlider
