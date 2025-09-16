import { Route } from 'src/routes/$lang/_public/rent-a-car.route'
import { SearchForm } from './form-search'
import { Outlet } from '@tanstack/react-router'
import { PublicFooter } from '../../layout/footer'

export const RentACarLayout = () => {
  const search = Route.useSearch()

  return (
    <>
      <main className="flex flex-col">
        <SearchForm initialData={search} />
        <Outlet />
      </main>
      <PublicFooter />
    </>
  )
}
