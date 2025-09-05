import { Link } from 'src/i18n/router/link'
import { AuthButton } from './auth/button'
import { BasketButton } from './basket/button'
import { CategoriesButton } from './categories/button'
import { CategoriesDropdown } from './categories/dropdown'
import { PublicHeaderLogo } from './components/logo'
import { GoAiButton } from './go-ai/button'
import { SearchButton } from './search/button'
import { useHeader } from './store'
import { PublicHeaderBackground } from './background'

export function PublicHeader() {
  const { isInverted } = useHeader()

  return (
    <header>
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
            <Link to="/$lang" aria-label="Beğenilen ürünler">
              <span className="btn-default rounded-full px-2 py-1">Beğendiklerim</span>
            </Link>

            {/* Reservations */}
            <Link to="/$lang" aria-label="Rezervasyonlar">
              <span className="btn-default rounded-full px-2 py-1">Rezervasyonlar</span>
            </Link>

            {/* Reservations */}
            <Link to="/$lang" aria-label="Rezervasyonlar">
              <span className="btn-default rounded-full px-2 py-1">Blog</span>
            </Link>

            {/* AI Assistant */}
            <GoAiButton />

            {/* Auth */}
            <AuthButton />
          </div>
        </nav>

        <CategoriesDropdown />
      </div>

      {/* Background Image Section */}
      <PublicHeaderBackground />
    </header>
  )
}
