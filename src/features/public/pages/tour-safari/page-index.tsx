import { Route } from 'src/routes/$lang/_public'
import { SafariSelection } from './section-selection'
import { PublicFooter } from '../../layout/footer'

export const SafariToursIndexPage = () => {
  return (
    <>
      <main className="flex flex-col">
        <SafariSelection />
      </main>
      <PublicFooter />
    </>
  )
}
