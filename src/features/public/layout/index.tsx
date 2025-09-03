// burada tüm modallar yerleştirilir storelar sarmalanır.
import { PublicHeader } from './header'
import { PublicFooter } from './footer'
import { LayoutStore } from './store'

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutStore>
      <PublicHeader />
      {children}
      <PublicFooter />
    </LayoutStore>
  )
}
