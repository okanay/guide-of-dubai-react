import { Route } from 'src/routes/$lang/_public'
import { Information } from './section-information'
import { DreamOffers } from './section-dream-offers'

export const HotelIndexPage = () => {
  return (
    <>
      <DreamOffers />
      <Information />
    </>
  )
}
