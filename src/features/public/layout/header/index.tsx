import { Link } from 'src/i18n/router/link'
import { ProfileButton } from './profile/button'
import { CategoriesButton } from './categories/button'
import { CategoriesDropdown } from './categories/dropdown'
import { PublicHeaderLogo } from './components/logo'
import { useHeader } from './store'
import { PublicHeaderBackground } from './background'
import { useTranslation } from 'react-i18next'
import { BasketButton } from '@/features/modals/basket/button'
import { GoAiButton } from '@/features/modals/go-ai/button'
import { SearchButton } from '@/features/modals/search/button'
import { MobileMenuButton } from './mobile-menu/button'

export function PublicHeader() {
  const { isInverted } = useHeader()
  const { t } = useTranslation('layout-header')

  return (
    <header id="public-header">
      <div className="relative z-40 lg:px-4">
        <nav
          className="mx-auto flex max-w-8xl items-center justify-between"
          role="navigation"
          aria-label="Ana navigasyon"
        >
          {/* Logo */}
          <PublicHeaderLogo />

          {/* Desktop Navigation */}
          <div
            style={{ whiteSpace: 'nowrap', scrollbarWidth: 'none' }}
            data-color={isInverted ? 'invert' : 'normal'}
            className="group/h relative z-50 hidden items-center gap-x-1.5 overflow-x-auto text-size-sm font-semibold text-[#ffffff] data-[color=invert]:text-[#000] lg:flex data-[color=invert]:dark:text-[#fff]"
          >
            {/* Search */}
            <SearchButton />

            {/* Categories */}
            <CategoriesButton />

            {/* Basket */}
            <BasketButton />

            {/* Wishlist */}
            <Link to="/$lang" aria-label={t('nav.wishlist')}>
              <span className="btn-default rounded-full px-2 py-1">{t('nav.wishlist')}</span>
            </Link>

            {/* Reservations */}
            <Link to="/$lang" aria-label={t('nav.reservations')}>
              <span className="btn-default rounded-full px-2 py-1">{t('nav.reservations')}</span>
            </Link>

            {/* Blog */}
            <Link to="/$lang" aria-label={t('nav.blog')}>
              <span className="btn-default rounded-full px-2 py-1">{t('nav.blog')}</span>
            </Link>

            {/* AI Assistant */}
            <GoAiButton />

            {/* Auth */}
            <ProfileButton />
          </div>

          <MobileMenuButton />
        </nav>

        <CategoriesDropdown />
      </div>

      {/* Background Image Section */}
      <PublicHeaderBackground />
    </header>
  )
}
