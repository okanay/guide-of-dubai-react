import { Outlet } from '@tanstack/react-router'
import { ActivityFilterProvider } from './store'
import { Route } from 'src/routes/$lang/_public/activities/route'
import { SearchForm } from './form-search'

export const ActivityLayout = () => {
  const search = Route.useSearch()

  return (
    <>
      <main className="flex flex-col">
        <ActivityFilterProvider initialState={search}>
          <SearchForm />
          <Outlet />
        </ActivityFilterProvider>
      </main>
    </>
  )
}
