import ComposeProviders from 'src/components/compose-providers'

import { BasketModal } from './header/basket/modal'
import { BasketModalStore } from './header/basket/store'
import { GoAiModalStore } from './header/go-ai/store'
import { SearchModal } from './header/search/modal'
import { SearchModalStore } from './header/search/store'
import { SystemSettingsModal } from './header/system-settings/modal'
import { SystemSettingsModalStore } from './header/system-settings/store'
import { GoAiModal } from './header/go-ai/modal'
import { HeaderStore } from './header/store'
import { AuthModalStore } from './header/auth/store'
import { AuthModal } from './header/auth/modal'

export const LayoutStores = ({ children }: { children: React.ReactNode }) => {
  return (
    <ComposeProviders
      components={[
        HeaderStore,
        SystemSettingsModalStore,
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
    </ComposeProviders>
  )
}
