import { Outlet } from '@tanstack/react-router'
import { HotelFilterProvider } from './store'
import { Route } from '@/routes/$lang/_public/hotels/route'
import { SearchForm } from './form-search'

export const HotelLayout = () => {
  const search = Route.useSearch()

  return (
    <>
      <main className="flex flex-col">
        <HotelFilterProvider initialState={search}>
          <SearchForm />
          <Outlet />
        </HotelFilterProvider>
      </main>
    </>
  )
}
