import { PublicFooterFAQSection } from './section-faq'
import { CopyrightSection, LinksSection } from './section-links'
import { PublicFooterMobileAppSection } from './section-mobile-app'
import { SubscriptionSection } from './section-subscription'

export const PublicFooter = () => {
  return (
    <footer className="pt-20">
      <PublicFooterMobileAppSection />
      <PublicFooterFAQSection />
      <div className="w-full bg-gray-800 text-white dark:bg-black">
        <div className="px-4">
          <div className="mx-auto max-w-7xl py-10">
            <SubscriptionSection />
            <div className="my-12 h-px w-full bg-gray-700 dark:bg-white-20" />
            <LinksSection />
          </div>
        </div>

        <CopyrightSection />
      </div>
    </footer>
  )
}
