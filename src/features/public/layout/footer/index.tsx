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
