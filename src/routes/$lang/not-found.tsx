import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Link } from 'src/i18n/link'

export const CustomNotFoundPage = () => {
  return (
    <main className="bg-background text-on-background flex min-h-screen items-center justify-center">
      <div className="bg-surface mx-auto flex max-w-7xl flex-col items-center p-6 text-center">
        <h1 className="text-primary mb-4 text-7xl font-extrabold">404</h1>
        <p className="text-on-surface text-3xl font-semibold">Page Not Found</p>
        <p className="text-on-surface-variant mb-6 mt-2 max-w-2xl text-balance text-xl font-semibold">
          The page you are looking for could not be found. Please check the address and try again.
        </p>
        <Link
          to="/"
          className={`btn-state-layer bg-secondary-container text-on-secondary-container hover:before:opacity-hover focus:before:opacity-focus active:before:opacity-pressed inline-flex h-16 items-center justify-center overflow-hidden rounded-full px-8 text-lg font-medium tracking-wide transition-transform duration-500`}
        >
          Go To Homepage
        </Link>
      </div>
      <NavigateNotFound />
    </main>
  )
}

const NavigateNotFound = () => {
  const location = useLocation()
  const router = useRouter()

  useEffect(() => {
    if (location.pathname !== '/not-found') {
      router.navigate({ to: '/$lang/not-found', params: { lang: 'en' } })
    }
  }, [])

  return null
}

export const Route = createFileRoute('/$lang/not-found')({
  staleTime: 0,
  gcTime: 0,
  component: CustomNotFoundPage,
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
})
