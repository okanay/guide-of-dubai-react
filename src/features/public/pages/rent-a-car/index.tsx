import { Route } from 'src/routes/$lang/_public'
import { SearchForm } from './form-search'
import { FastOffers } from './section-fast-offers'
import { Information } from './section-information'

export const RentACarIndexPage = () => {
  return (
    <main className="flex flex-col">
      <SearchForm />
      <FastOffers />
      <Information />
    </main>
  )
}
