import { createServerFileRoute } from '@tanstack/react-start/server'

// Types
interface RobotRule {
  userAgent: string | string[]
  allow?: string | string[]
  disallow?: string | string[]
  crawlDelay?: number
}

interface RobotsResponse {
  rules: RobotRule[]
  sitemap?: string | string[]
  host?: string
}

// Main route
export const ServerRoute = createServerFileRoute('/robots.txt').methods({
  GET: async () => {
    const isDevelopment = process.env.NODE_ENV !== 'production'
    const baseUrl = getBaseUrl()

    const robotsConfig: RobotsResponse = {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/editor/', '/forgot-password-confirm', '/verify-email'],
        },
        {
          userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'],
          disallow: '/',
        },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
    }

    const robotsContent = formatRobotsContent(robotsConfig)

    return new Response(robotsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': getCacheControl(isDevelopment),
      },
    })
  },
})

// Helper functions
function normalizeToArray(value: string | string[] | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function formatRobotsContent(config: RobotsResponse): string {
  const lines: string[] = []

  if (config.host) {
    lines.push(`Host: ${config.host}`)
    lines.push('')
  }

  config.rules.forEach((rule) => {
    const userAgents = normalizeToArray(rule.userAgent)

    userAgents.forEach((agent) => {
      lines.push(`User-agent: ${agent}`)

      normalizeToArray(rule.allow).forEach((path) => {
        lines.push(`Allow: ${path}`)
      })

      normalizeToArray(rule.disallow).forEach((path) => {
        lines.push(`Disallow: ${path}`)
      })

      if (rule.crawlDelay) {
        lines.push(`Crawl-delay: ${rule.crawlDelay}`)
      }

      lines.push('')
    })
  })

  normalizeToArray(config.sitemap).forEach((sitemap) => {
    lines.push(`Sitemap: ${sitemap}`)
  })

  return lines.join('\n').trim()
}

function getBaseUrl(): string {
  return (
    process.env.VITE_APP_FRONTEND_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

function getCacheControl(isDev: boolean): string {
  return isDev
    ? 'no-cache, no-store, must-revalidate'
    : 'public, max-age=86400, stale-while-revalidate=43200' // 1 gün cache
}

export type { RobotRule, RobotsResponse }
