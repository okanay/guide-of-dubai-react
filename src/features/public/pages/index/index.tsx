import { Route } from 'src/routes/$lang/_public'
import { IconicPlaces } from './section-iconic-places'
import { Otels } from './section-otels'
import { Bundles } from './section-bundles'
import { RentACar } from './section-rent-a-car'
import { Tours } from './section-tours'
import { Yachts } from './section-yachts'
import { Activities } from './section-activities'
import { Interests } from './section-interests'

export const IndexPage = () => {
  return (
    <>
      <main className="flex flex-col">
        <IconicPlaces />
        <Interests />
        <Otels />
        <Bundles />
        <RentACar />
        <Activities />
        <Tours />
        <Yachts />
      </main>
    </>
  )
}
