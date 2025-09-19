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
    [key: string]: number
  }
}
