type TransferType = 'standard' | 'luxury' | 'vip'

interface Transfer {
  id: string
  type: TransferType
  title: string
  vehicle: string
  features: {
    hasFreeCancellation: boolean
    hasFoodAndBeverage: boolean
    passengerCapacity: string
    baggageCapacity: string
  }
  images: string[]
  price: {
    amount: number
    currency: 'USD' | 'EUR' | 'AED'
  }
}
