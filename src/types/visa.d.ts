interface VisaProduct {
  id: string
  type: 'tourist' | 'transit'
  title: string
  subtitle: string
  hasValidityPeriod: boolean
  processingDays: string
  stayDays?: string
  validityDays?: string
  prices: {
    aed: number
    usd: number
    eur: number
    gbp: number
  }
}
