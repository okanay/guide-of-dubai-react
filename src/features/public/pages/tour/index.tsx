import { Route } from 'src/routes/$lang/_public'
import { SearchForm } from './form-search'
import { FastPlanner } from './section-fast-planner'
import { Information } from './section-information'
import { WaterActivities } from './section-water-activities'
import { MostPopular } from './section-most-popular'
import { LuxuryOffers } from './section-luxury'

export const ToursIndexPage = () => {
  return (
    <main className="flex flex-col">
      <SearchForm />
      <MostPopular />
      <LuxuryOffers />
      <WaterActivities />
      <FastPlanner />
      <Information />
    </main>
  )
}
