import { Route } from 'src/routes/$lang/_public'
import { SearchForm } from './form-search'
import { FastOffers } from './section-fast-offers'

export const TicketIndexPage = () => {
  return (
    <main className="flex flex-col">
      <SearchForm />
      <FastOffers />
    </main>
  )
}
