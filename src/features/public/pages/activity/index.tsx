import { Route } from 'src/routes/$lang/_public'
import { MostPopular } from './section-most-popular'
import { LuxActivities } from './section-lux-activities'
import { WaterActivities } from './section-water-activities'
import { Information } from './section-information'

export const ActivityIndexPage = () => {
  return (
    <article className="flex flex-col">
      <MostPopular />
      <LuxActivities />
      <WaterActivities />
      <Information />
    </article>
  )
}
