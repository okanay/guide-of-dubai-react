interface HotelFeatures {
  breakfast?: boolean
  freeCancellation?: boolean
  forTwoPeople?: boolean
}

interface Hotel {
  id: string
  name: string
  images: string[]
  starRating: number
  reviewRating: number
  reviewCount: number
  roomType: string
  distanceToCenter: string
  features: HotelFeatures
  price: number
  originalPrice?: number
  currency: string
  url: string
  nightCount: number
  adultCount: number
}
