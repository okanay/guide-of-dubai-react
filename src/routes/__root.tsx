import { createRootRoute, HeadContent, Outlet, redirect, Scripts } from '@tanstack/react-router'
import { type ReactNode } from 'react'
import { SystemSettingsModalStore } from 'src/features/public/layout/header/system-settings/store'
import { getPreferedSettings } from 'src/i18n/get-prefered-settings'
import LanguageProvider from 'src/i18n/prodiver'
import { AppProviders } from 'src/providers'
import { AuthProvider, getMeInitial } from 'src/providers/auth'
import { ThemeStore } from 'src/providers/theme-mode'
import globals from '../assets/styles/globals.css?url'

const CANONICAL_URL = import.meta.env.VITE_APP_CANONICAL_URL

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const lang = location.pathname.split('/')[1]

    return {
      lang,
    }
  },
  loader: async ({ context: { lang } }) => {
    const [settings, me] = await Promise.all([
      getPreferedSettings({ data: { lang: lang } }),
      getMeInitial(),
    ])

    if (lang !== settings.language.value) {
      throw redirect({
        to: `/$lang`,
        params: {
          lang: settings.language.value,
        },
      })
    }

    return {
      settings,
      me,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Guide of Dubai',
      },
      {
        name: 'description',
        content: '',
      },
      {
        name: 'keywords',
        content: '',
      },
      {
        name: 'author',
        content: '',
      },
      {
        name: 'creator',
        content: 'Okan Ay - (okanay@hotmail.com) - Heraklet',
      },
      {
        name: 'publisher',
        content: '',
      },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'googlebot',
        content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      },
      {
        name: 'bingbot',
        content: 'index, follow',
      },
      {
        name: 'language',
        content: 'en',
      },
      {
        name: 'content-language',
        content: 'en-US',
      },
      {
        name: 'revisit-after',
        content: '1 day',
      },
      {
        name: 'article:publisher',
        content: '',
      },
      {
        name: 'article:section',
        content: '',
      },
      {
        name: 'category',
        content: '',
      },

      // Open Graph - Medya sitesi optimize
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: 'Guide of Dubai',
      },
      {
        property: 'og:description',
        content: '',
      },

      {
        property: 'og:site_name',
        content: 'Guide of Dubai',
      },
      {
        property: 'og:image',
        content: '',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: '',
      },
      {
        property: 'og:locale',
        content: 'en_US',
      },

      // Twitter Card - News site optimize
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: '',
      },
      {
        name: 'twitter:description',
        content: '',
      },
      {
        name: 'twitter:image',
        content: '',
      },
      {
        name: 'twitter:image:alt',
        content: '',
      },
      {
        name: 'twitter:domain',
        content: CANONICAL_URL.replace('http://', '').replace('https://', ''),
      },

      // News siteler için teknik SEO
      {
        name: 'theme-color',
        content: '#ffffff',
      },
      {
        name: 'msapplication-TileColor',
        content: '#ffffff',
      },
      {
        name: 'application-name',
        content: 'Guide of Dubai',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Guide of Dubai',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        name: 'geo.region',
        content: 'AE-DU',
      },
      {
        name: 'geo.placename',
        content: 'Dubai',
      },
      {
        name: 'geo.position',
        content: '25.276987;55.296249',
      },
      {
        name: 'ICBM',
        content: '25.276987, 55.296249',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        as: 'style',
        type: 'text/css',
        crossOrigin: 'anonymous',
        href: globals,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/icons/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/icons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/icons/favicon-16x16.png',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      {
        rel: 'sitemap',
        type: 'application/xml',
        title: 'sitemap',
        href: '/sitemap.xml',
      },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Guide of Dubai RSS Feed',
        href: `${CANONICAL_URL}/rss.xml`,
      },
      {
        rel: 'license',
        href: `${CANONICAL_URL}/terms-service`,
      },
      {
        rel: 'privacy-policy',
        href: `${CANONICAL_URL}/terms-privacy`,
      },
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
        href: `/fonts/custom-sans/bold.woff2`,
      },

      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
        href: `/fonts/custom-sans/regular.woff2`,
      },
    ],
  }),
  staleTime: 4 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
  component: RootComponent,
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const data = Route.useLoaderData()

  return (
    <html
      lang={data.settings.language.locale}
      dir={data.settings.language.direction}
      data-currency={data.settings.currency.code}
      data-theme={data.settings.theme}
      className={data.settings.theme}
    >
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const data = Route.useLoaderData()

  return (
    <RootDocument>
      <AuthProvider initialUser={data.me.user}>
        <ThemeStore initialTheme={data.settings.theme}>
          <LanguageProvider serverLanguage={data.settings.language}>
            <SystemSettingsModalStore initialCurrency={data.settings.currency}>
              <AppProviders>
                <Outlet />
              </AppProviders>
            </SystemSettingsModalStore>
          </LanguageProvider>
        </ThemeStore>
      </AuthProvider>
    </RootDocument>
  )
}
