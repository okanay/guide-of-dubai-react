import { Outlet } from '@tanstack/react-router'
import { FlightFilterProvider } from './store'
import { Route } from 'src/routes/$lang/_public/flights/route'
import { SearchForm } from './form-search'

export const FlightsLayout = () => {
  const search = Route.useSearch()

  return (
    <>
      <main className="flex flex-col">
        <FlightFilterProvider initialState={search}>
          <SearchForm />
          <Outlet />
        </FlightFilterProvider>
      </main>
    </>
  )
}
