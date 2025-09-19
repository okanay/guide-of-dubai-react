interface Hospital {
  id: string
  name: string
  images: string[]
  rating: number
  reviewCount: number
  coords: [number, number] // [latitude, longitude]
  phone: string
  openStatus: string
  url: string
}
