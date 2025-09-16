import {
  LinkProps,
  Route,
  RouteById,
  RouteIds,
  RouteMatch,
  useLocation,
  useMatches,
} from '@tanstack/react-router'
import { PublicFooterFAQSection } from './section-faq'
import { CopyrightSection, LinksSection } from './section-links'
import { PublicFooterMobileAppSection } from './section-mobile-app'
import { SubscriptionSection } from './section-subscription'

export const PublicFooter = () => {
  return (
    <footer data-theme="force-main" className="pt-8 sm:pt-20 dark:bg-gray-950">
      <PublicFooterMobileAppSection />
      <PublicFooterFAQSection />

      <div className="w-full bg-gray-950 text-white">
        <div className="px-4">
          <div className="mx-auto max-w-main py-10">
            <SubscriptionSection />
            <div className="my-12 h-px w-full bg-gray-700" />
            <LinksSection />
          </div>
        </div>

        <CopyrightSection />
      </div>
    </footer>
  )
}

export const PublicFooterShort = () => {
  return (
    <footer data-theme="force-main" className="pt-8 sm:pt-20 dark:bg-gray-950">
      <div className="w-full bg-gray-950 text-white">
        <div className="px-4">
          <div className="mx-auto max-w-main py-10">
            <SubscriptionSection />
            <div className="my-12 h-px w-full bg-gray-700" />
            <LinksSection />
          </div>
        </div>

        <CopyrightSection />
      </div>
    </footer>
  )
}

const HideWrapper = ({ children }: { children: React.ReactNode }) => {
  const matches = useMatches()
  // const HideAddreses = [
  //   '/$lang/_public/flights',
  //   '/$lang/_public/yatch',
  //   '/$lang/_public/guide/',
  //   '/$lang/_public/guide/visa',
  //   '/$lang/_public/guide/bundles',
  //   '/$lang/_public/guide/hospitals',
  //   '/$lang/_public/guide/sim-card',
  //   '/$lang/_public/guide/restaurants',
  // ]

  const HideAddreses = ['']

  if (HideAddreses.some((address) => matches.find((match) => match.routeId === address))) {
    return null
  }

  return children
}
