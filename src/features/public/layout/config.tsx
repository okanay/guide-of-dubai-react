import ComposeProviders from 'src/components/compose-providers'
import { HeaderStore } from './header/store'
import { AuthModalStore } from '@/features/modals/auth/store'
import { BasketModalStore } from '@/features/modals/basket/store'
import { GoAiModalStore } from '@/features/modals/go-ai/store'
import { SearchModalStore } from '@/features/modals/search/store'
import { LeafletModal } from '@/features/modals/leaflet-map/index'
import { Route } from '@/routes/__root'
import { MobileMenuStore } from './header/mobile-menu/store'
import { GlobalModalStoreProvider } from '@/features/modals/global/store'
import { MobileMenu } from './header/mobile-menu'
import { GlobalModalProvider } from '@/features/modals/global/wrapper'
import { SystemSettingsStore } from '@/features/modals/system-settings/store'

export const PublicLayoutConfig = ({ children }: { children: React.ReactNode }) => {
  const data = Route.useLoaderData()

  return (
    <GlobalModalStoreProvider>
      <SystemSettingsStore initialCurrency={data.settings.currency}>
        <ComposeProviders
          components={[
            HeaderStore,
            SearchModalStore,
            BasketModalStore,
            AuthModalStore,
            GoAiModalStore,
            MobileMenuStore,
          ]}
        >
          {children}
          <LeafletModal />
          <MobileMenu />
          <GlobalModalProvider />
        </ComposeProviders>
      </SystemSettingsStore>
    </GlobalModalStoreProvider>
  )
}
