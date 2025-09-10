interface RentACarFeatures {
  airConditioning?: boolean
  automaticTransmission?: boolean
  seats?: number
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  bluetooth?: boolean
  gps?: boolean
  unlimitedMileage?: boolean
  insurance?: boolean
}

interface RentACar {
  id: string
  brand: string
  model: string
  year: number
  category: 'Economy' | 'Compact' | 'SUV' | 'Luxury' | 'Van' | 'Convertible'
  images: string[]
  rating: number
  reviewCount: number
  pricePerDay: number
  originalPricePerDay?: number
  currency: string
  features: RentACarFeatures
  location: string
  distanceFromCenter: string
  availability: boolean
  fuelPolicy: 'Full to Full' | 'Same to Same' | 'Pre-purchase'
  pickupLocations: string[]
  supplier: string
  isPopular?: boolean
}
