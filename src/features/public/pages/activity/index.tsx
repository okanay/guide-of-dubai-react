import { Route } from 'src/routes/$lang/_public'
import { SearchForm } from './form-search'
import { MostPopular } from './section-most-popular'
import { LuxActivities } from './section-lux-activities'
import { WaterActivities } from './section-water-activities'
import { Information } from './section-information'

export const ActivityIndexPage = () => {
  return (
    <main className="flex flex-col">
      <SearchForm />
      <MostPopular />
      <LuxActivities />
      <WaterActivities />
      <Information />
    </main>
  )
}
