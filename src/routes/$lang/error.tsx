import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from 'src/i18n/prodiver'
import { Link } from 'src/i18n/router/link'

export const CustomErrorPage = () => {
  const { t } = useTranslation('page-errors')

  return (
    <main className="flex min-h-screen items-center justify-center bg-box-surface text-on-box-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center bg-gray-surface p-6 text-center">
        <h1 className="mb-4 text-7xl font-extrabold text-error-500">500</h1>
        <p className="text-3xl font-semibold text-on-box-black">{t('error.title')}</p>
        <p className="mt-2 mb-6 max-w-2xl text-xl font-semibold text-balance text-gray-600">
          {t('error.description')}
        </p>
        <Link
          to="/$lang"
          className="inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-btn-primary px-8 text-lg font-medium tracking-wide text-on-btn-primary shadow-md transition-all duration-300 hover:bg-btn-primary-hover hover:shadow-lg focus:bg-btn-primary-focus active:scale-95"
        >
          {t('error.return-link')}
        </Link>
      </div>
      <NavigateErrorPath />
    </main>
  )
}

const NavigateErrorPath = () => {
  const { language } = useLanguage()
  const location = useLocation()
  const router = useRouter()

  useEffect(() => {
    if (location.pathname !== '/error') {
      router.navigate({ to: '/$lang', params: { lang: language.value } })
    }
  }, [])

  return null
}

export const Route = createFileRoute('/$lang/error')({
  component: CustomErrorPage,
  head: () => {
    return {
      links: [
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
          href: `/fonts/custom-sans/semibold.woff2`,
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
          href: `/fonts/custom-sans/extra-bold.woff2`,
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
          href: `/fonts/custom-sans/extra-bold.woff2`,
        },
      ],
      meta: [
        { title: `Error | Guide of Dubai` },
        {
          name: 'description',
          content:
            'An unexpected error occurred. Please try again later or contact support for assistance.',
        },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
})
