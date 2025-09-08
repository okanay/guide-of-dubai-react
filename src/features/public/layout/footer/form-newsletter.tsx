import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const NewsletterForm = () => {
  const { t } = useTranslation('public-footer')

  return (
    <form className="flex w-full max-w-[472px] items-center gap-x-0">
      <div className="relative flex-grow">
        <input
          type="email"
          id="footer-email"
          className="peer block h-12 w-full appearance-none rounded-l-xs border border-gray-300 bg-white px-4 pt-4 pb-2.5 pl-3 text-size-sm text-gray-900 focus:border-primary-500 focus:ring-0 focus:outline-none dark:border-gray-600"
          placeholder=" "
        />

        <label
          htmlFor="footer-email"
          className="pointer-events-none absolute top-2 left-2 z-10 origin-[0] -translate-y-2 scale-75 transform px-2 text-size text-black duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary-500"
        >
          {t('subscription.newsletter_email_label')}
        </label>
      </div>

      <button
        type="submit"
        aria-label={t('subscription.newsletter_button')}
        className="flex h-12 shrink-0 items-center justify-center rounded-r-xs bg-btn-primary px-6 font-semibold text-on-btn-primary transition-colors hover:bg-btn-primary-hover"
      >
        <span className="hidden sm:inline">{t('subscription.newsletter_button')}</span>
        <Send className="h-5 w-5 sm:hidden" />
      </button>
    </form>
  )
}
