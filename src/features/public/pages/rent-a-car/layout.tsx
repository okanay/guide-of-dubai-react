import { createFileRoute, Outlet } from '@tanstack/react-router'
import { RentACarFilterProvider } from '@/features/public/pages/rent-a-car/store'
import { Route } from '@/routes/$lang/_public/rent-a-car.route'
import { SearchForm } from './form-search'

export function RentACarLayout() {
  const searchParams = Route.useSearch()

  return (
    <main className="flex flex-col">
      <RentACarFilterProvider initialState={searchParams}>
        <SearchForm />
        <Outlet />
      </RentACarFilterProvider>
    </main>
  )
}
