import { Outlet } from '@tanstack/react-router'
import { SearchForm } from './form-search'
import { Route } from '@/routes/$lang/_public/hospitals/route'
import { HospitalFilterProvider } from './store'

export const HospitalLayout = () => {
  const search = Route.useSearch()

  return (
    <>
      <main className="flex flex-col">
        <HospitalFilterProvider initialState={search}>
          <SearchForm />
          <Outlet />
        </HospitalFilterProvider>
      </main>
    </>
  )
}
