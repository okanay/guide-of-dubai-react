import { Route } from 'src/routes/$lang/_public'
import { IconicPlaces } from './section-iconic-places'
import { Otels } from './section-otels'
import { Bundles } from './section-bundles'
import { RentACar } from './section-rent-a-car'
import { Restaurants } from './section-restaurants'
import { Tours } from './section-tours'
import { Yachts } from './section-yachts'
import { Activities } from './section-activities'

export const IndexPage = () => {
  return (
    <main className="flex flex-col gap-y-4">
      <IconicPlaces />
      <Otels />
      <Bundles />
      <RentACar />
      <Activities />
      <Restaurants />
      <Tours />
      <Yachts />
    </main>
  )
}
