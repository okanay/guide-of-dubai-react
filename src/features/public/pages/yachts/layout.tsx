import { Outlet } from '@tanstack/react-router'
import { YachtsFilterProvider } from './store'
import { Route } from 'src/routes/$lang/_public/yachts/route'
import { SearchForm } from './form-search'

export const YachtsLayout = () => {
  const search = Route.useSearch()

  return (
    <>
      <main className="flex flex-col">
        <YachtsFilterProvider initialState={search}>
          <SearchForm />
          <Outlet />
        </YachtsFilterProvider>
      </main>
    </>
  )
}
