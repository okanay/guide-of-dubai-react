import { PublicHeader } from './header'
import { PublicLayoutConfig } from './config'

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PublicLayoutConfig>
      <PublicHeader />
      {children}
    </PublicLayoutConfig>
  )
}
