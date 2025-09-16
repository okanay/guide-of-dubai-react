import { MostPopular } from './section-most-popular'
import { LuxActivities } from './section-lux-activities'
import { WaterActivities } from './section-water-activities'
import { Information } from './section-information'

export const ActivityIndexPage = () => {
  return (
    <>
      <MostPopular />
      <LuxActivities />
      <WaterActivities />
      <Information />
    </>
  )
}
