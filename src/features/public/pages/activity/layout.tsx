import { Route } from 'src/routes/$lang/_public/activities.route'
import { SearchForm } from './form-search'
import { Outlet } from '@tanstack/react-router'
import { PublicFooter } from '../../layout/footer'

export const ActivityLayout = () => {
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
