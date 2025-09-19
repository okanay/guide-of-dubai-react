interface SimCard {
  id: string
  title: string
  subtitle: string
  image: string
  features: {
    validity: string
    data: string
  }
  prices: {
    [key: string]: number
  }
}
