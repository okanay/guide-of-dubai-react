import { Route } from 'src/routes/$lang/_public/hotels.route'
import { SearchForm } from './form-search'
import { Outlet } from '@tanstack/react-router'

export const HotelLayout = () => {
  const search = Route.useSearch()

  return (
    <>
      <main className="flex flex-col">
        <SearchForm initialData={search} />
        <Outlet />
      </main>
    </>
  )
}
