import ComposeProviders from 'src/components/compose-providers'
import { HeaderStore } from './header/store'
import { AuthModal } from '@/features/modals/auth/modal'
import { AuthModalStore } from '@/features/modals/auth/store'
import { BasketModal } from '@/features/modals/basket/modal'
import { BasketModalStore } from '@/features/modals/basket/store'
import { GoAiModal } from '@/features/modals/go-ai/modal'
import { GoAiModalStore } from '@/features/modals/go-ai/store'
import { SearchModalStore } from '@/features/modals/search/store'
import { SystemSettingsModal } from '@/features/modals/system-settings/modal'
import { LeafletModal } from '@/features/modals/leaflet-map/index'
import { Route } from '@/routes/__root'
import { SystemSettingsModalStore } from '@/features/modals/system-settings/store'
import { MobileMenuStore } from './header/mobile-menu/store'
import { GlobalModalStoreProvider } from '@/features/modals/global/store'
import { GlobalModalRenderer } from '@/features/modals/global/wrapper'

export const PublicLayoutConfig = ({ children }: { children: React.ReactNode }) => {
  const data = Route.useLoaderData()

  return (
    <GlobalModalStoreProvider>
      <SystemSettingsModalStore initialCurrency={data.settings.currency}>
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
          <GoAiModal />
          <SystemSettingsModal />
          <AuthModal />
          <BasketModal />
          <LeafletModal />
          <GlobalModalRenderer />
        </ComposeProviders>
      </SystemSettingsModalStore>
    </GlobalModalStoreProvider>
  )
}
