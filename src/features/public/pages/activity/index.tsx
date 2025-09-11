import { Route } from 'src/routes/$lang/_public'
import { SearchForm } from './form-search'
import { MostPopular } from './section-most-popular'

export const ActivityIndexPage = () => {
  return (
    <main className="flex flex-col">
      <SearchForm />
      <MostPopular />
    </main>
  )
}
