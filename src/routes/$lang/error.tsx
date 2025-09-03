import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Link } from 'src/i18n/link'

export const CustomErrorPage = () => {
  return (
    <main className="bg-background text-on-background flex min-h-screen items-center justify-center">
      <div className="bg-surface mx-auto flex max-w-7xl flex-col items-center p-6 text-center">
        <h1 className="text-primary mb-4 text-7xl font-extrabold">500</h1>
        <p className="text-on-surface text-3xl font-semibold">An Error Occurred</p>
        <p className="text-on-surface-variant mb-6 mt-2 max-w-2xl text-balance text-xl font-semibold">
          An unexpected error occurred. Please try again later or contact us.
        </p>
        <Link
          to="/"
          className={`btn-state-layer bg-secondary-container text-on-secondary-container hover:before:opacity-hover focus:before:opacity-focus active:before:opacity-pressed inline-flex h-16 items-center justify-center overflow-hidden rounded-full px-8 text-lg font-medium tracking-wide transition-transform duration-500`}
        >
          Go To Homepage
        </Link>
      </div>
      <NavigateNotError />
    </main>
  )
}

const NavigateNotError = () => {
  const location = useLocation()
  const router = useRouter()

  useEffect(() => {
    if (location.pathname !== '/error') {
      router.navigate({ to: '/$lang', params: { lang: 'en' } })
    }
  }, [])

  return null
}

export const Route = createFileRoute('/$lang/error')({
  staleTime: 0,
  gcTime: 0,
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
