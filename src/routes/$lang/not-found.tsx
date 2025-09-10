import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from 'src/i18n/prodiver'
import { Link } from 'src/i18n/router/link'

export const CustomNotFoundPage = () => {
  const { t } = useTranslation('page-errors')

  return (
    <main className="flex min-h-screen items-center justify-center bg-box-surface text-on-box-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center bg-gray-surface p-6 text-center">
        <h1 className="mb-4 text-7xl font-extrabold text-primary-500">404</h1>
        <p className="text-3xl font-semibold text-on-box-black">{t('not-found.title')}</p>
        <p className="mt-2 mb-6 max-w-2xl text-xl font-semibold text-balance text-gray-600">
          {t('not-found.description')}
        </p>
        <Link
          to="/$lang"
          className="inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-btn-primary px-8 text-lg font-medium tracking-wide text-on-btn-primary shadow-md transition-all duration-300 hover:bg-btn-primary-hover hover:shadow-lg focus:bg-btn-primary-focus active:scale-95"
        >
          {t('not-found.return-link')}
        </Link>
      </div>
      <NavigateNotFoundPath />
    </main>
  )
}

const NavigateNotFoundPath = () => {
  const { language } = useLanguage()
  const location = useLocation()
  const router = useRouter()

  useEffect(() => {
    if (location.pathname !== '/not-found') {
      router.navigate({ to: '/$lang/not-found', params: { lang: language.value } })
    }
  }, [])

  return null
}

export const Route = createFileRoute('/$lang/not-found')({
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
      ],
      meta: [
        { title: `Page Not Found | Guide of Dubai` },
        {
          name: 'description',
          content:
            'The page you are looking for was not found. You can return to the homepage or perform a search.',
        },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: CustomNotFoundPage,
})
