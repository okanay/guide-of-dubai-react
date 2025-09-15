// src/mockdata/transfers.ts

export const MOCK_TRANSFERS: Transfer[] = [
  {
    id: '1',
    type: 'standard',
    title: 'Standard Transfer',
    vehicle: 'Skoda Octavia or similar',
    features: {
      passengerCapacity: '1-4',
      baggageCapacity: '4',
      hasFoodAndBeverage: true,
      hasFreeCancellation: true,
    },
    images: [
      'https://picsum.photos/400/600?random=101',
      'https://picsum.photos/400/600?random=102',
    ],
    price: { amount: 75, currency: 'USD' },
  },
  {
    id: '2',
    type: 'luxury',
    title: 'Luxury Transfer',
    vehicle: 'Mercedes-Benz E-Class',
    features: {
      passengerCapacity: '1-3',
      baggageCapacity: '3',
      hasFoodAndBeverage: true,
      hasFreeCancellation: true,
    },
    images: [
      'https://picsum.photos/400/600?random=103',
      'https://picsum.photos/400/600?random=104',
    ],
    price: { amount: 150, currency: 'USD' },
  },
]
