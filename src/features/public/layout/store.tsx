import { AuthModalStore } from './header/auth/store'
import { BasketModalStore } from './header/basket/store'
import { SearchModalStore } from './header/search/store'
import { SystemSettingsModal } from './header/system-settings/modal'
import { SystemSettingsModalStore } from './header/system-settings/store'

export const LayoutStore = ({ children }: { children: React.ReactNode }) => {
  return (
    <SystemSettingsModalStore>
      <SearchModalStore>
        <BasketModalStore>
          <AuthModalStore>
            {children}
            <SystemSettingsModal />
          </AuthModalStore>
        </BasketModalStore>
      </SearchModalStore>
    </SystemSettingsModalStore>
  )
}
