interface SafariTour {
  id: string
  type: 'morning' | 'night'
  title: string
  cta: string
  images: string[]
  rating: number
  reviewCount: number
  href: string
  camps: {
    title: string
    options: { key: string; icon: string }[]
  } | null
  prices: {
    [key: string]: number
  }
}
