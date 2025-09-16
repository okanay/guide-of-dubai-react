import { Route } from 'src/routes/$lang/_public'
import { Information } from './section-information'
import { TransferSelection } from './section-selection'
import { PublicFooter } from '../../layout/footer'

export const TransferIndexPage = () => {
  return (
    <>
      <main className="flex flex-col">
        <TransferSelection />
        <Information />
      </main>
      <PublicFooter />
    </>
  )
}
