import { Route } from 'src/routes/$lang/_public/flights.route'
import { Outlet } from '@tanstack/react-router'

export const SearchForm = () => {
  const search = Route.useSearch()

  return (
    <section className="text-on-box min-h-14 bg-box-surface px-4">
      <div className="mx-auto max-w-main">Search Form</div>
    </section>
  )
}
