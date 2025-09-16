import { PublicHeader } from './header'
import { PublicLayoutConfig } from './config'
import { PublicFooter } from './footer'

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PublicLayoutConfig>
      <PublicHeader />
      {children}
      <PublicFooter />
    </PublicLayoutConfig>
  )
}
