import { Route } from 'src/routes/$lang/_public'
import { FastOffers } from './section-fast-offers'
import { Information } from './section-information'

export const RentACarIndexPage = () => {
  return (
    <article className="flex flex-col">
      <FastOffers />
      <Information />
    </article>
  )
}
