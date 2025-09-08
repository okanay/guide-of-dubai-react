interface ActivityCard {
  id: string
  rank: number
  title: string
  description: string[]
  images: string[]
  rating: number
  reviewCount: number
  price: number
  originalPrice?: number
  duration: string
  groupInfo: string
  features: string[]
  isPopular?: boolean
  purchaseCount: number
}
