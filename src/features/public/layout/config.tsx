import ComposeProviders from 'src/components/compose-providers'
import { HeaderStore } from './header/store'
import { LeafletModal } from '@/components/leaflet-map/modal'
import { AuthModal } from './modals/auth/modal'
import { AuthModalStore } from './modals/auth/store'
import { BasketModal } from './modals/basket/modal'
import { BasketModalStore } from './modals/basket/store'
import { GoAiModal } from './modals/go-ai/modal'
import { GoAiModalStore } from './modals/go-ai/store'
import { SearchModal } from './modals/search/modal'
import { SearchModalStore } from './modals/search/store'
import { SystemSettingsModal } from './modals/system-settings/modal'

export const PublicLayoutConfig = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ComposeProviders
        components={[
          HeaderStore,
          SearchModalStore,
          BasketModalStore,
          AuthModalStore,
          GoAiModalStore,
        ]}
      >
        {children}
        <GoAiModal />
        <SystemSettingsModal />
        <AuthModal />
        <BasketModal />
        <SearchModal />
        <LeafletModal />
      </ComposeProviders>
    </>
  )
}
