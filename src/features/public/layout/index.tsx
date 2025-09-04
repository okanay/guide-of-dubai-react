import { PublicHeader } from './header'
import { PublicFooter } from './footer'
import { LayoutStores } from './stores'

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutStores>
      <PublicHeader />
      {children}
      <PublicFooter />
    </LayoutStores>
  )
}
