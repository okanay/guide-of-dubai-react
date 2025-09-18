interface Hospital {
  id: string
  name: string
  images: string[]
  rating: number
  reviewCount: number
  location: [string, string] // [latitude, longitude]
  phone: string
  openStatus: string
  url: string
}
