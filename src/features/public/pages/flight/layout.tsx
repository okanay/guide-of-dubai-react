import { Route } from 'src/routes/$lang/_public/flights.route'
import { SearchForm } from './form-search'
import { Outlet } from '@tanstack/react-router'
import { PublicFooterShort } from '../../layout/footer'

export const FlightsLayout = () => {
  const search = Route.useSearch()

  return (
    <>
      <main className="flex flex-col">
        <SearchForm initialData={search} />
        <Outlet />
      </main>
      <PublicFooterShort />
    </>
  )
}
