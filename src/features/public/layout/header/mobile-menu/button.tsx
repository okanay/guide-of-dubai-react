import { useTranslation } from 'react-i18next'
import { useMobileMenu } from './store'
import Icon from '@/components/icon'

export function MobileMenuButton() {
  const { toggleMenu } = useMobileMenu()
  const { t } = useTranslation('layout-header')

  return (
    <button
      onClick={toggleMenu}
      data-theme="force-main"
      className="mr-4 flex items-center justify-center gap-x-2 rounded-xs p-2 text-size font-bold text-white transition-colors hover:bg-white/10 focus:bg-white/10 lg:hidden"
      aria-label={t('buttons.menu')}
    >
      MENU
      <Icon name="hamburger-menu" className="size-4.5" />
    </button>
  )
}
