import { Route } from 'src/routes/$lang/_public'
import { SearchForm } from './form-search'
import { DreamOffers } from './section-dream-offers'
import { Information } from './section-information'

export const HotelIndexPage = () => {
  return (
    <main className="flex flex-col">
      <SearchForm />
      <DreamOffers />
      <Information />
    </main>
  )
}
