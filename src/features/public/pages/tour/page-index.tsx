import { MostPopular } from './section-most-popular'
import { PublicFooter } from '../../layout/footer'

export const ToursIndexPage = () => {
  return (
    <>
      <main className="flex flex-col">
        <MostPopular />
      </main>
      <PublicFooter />
    </>
  )
}
