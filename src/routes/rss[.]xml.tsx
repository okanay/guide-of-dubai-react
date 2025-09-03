import { createServerFileRoute } from '@tanstack/react-start/server'

// Backend'deki Go struct'ları ile uyumlu hale getirilmiş arayüz
interface RSSFeedData {
  channel: {
    title: string
    description: string
    link: string
    language: string
    lastBuildDate: string
    copyright?: string
    managingEditor?: string
    webMaster?: string
    ttl?: number
    image?: {
      url: string
      title: string
      link: string
    }
  }
  items: {
    title: string
    description: string // HTML içerecek
    link: string
    guid: string
    creator?: string // dc:creator için
    pubDate: string
    media?: {
      // media:content için
      url: string
      medium: string
    }
  }[]
}

export const ServerRoute = createServerFileRoute('/rss.xml').methods({
  GET: async () => {
    const backendUrl = process.env.VITE_APP_BACKEND_URL || 'http://localhost:8080'
    const isDevelopment = process.env.NODE_ENV !== 'production'

    try {
      const response = await fetch(`${backendUrl}/v1/public/content/rss`)
      if (!response.ok) {
        throw new Error(`Backend'den RSS verisi alınamadı: ${response.statusText}`)
      }

      const data: RSSFeedData = await response.json()
      const rssXml = generateRSSXml(data)

      return new Response(rssXml, {
        status: 200,
        headers: {
          // EN ÖNEMLİ DÜZELTME: Doğru Content-Type'ı burada ayarlıyoruz.
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': getCacheControl(isDevelopment),
        },
      })
    } catch (error) {
      console.error('RSS oluşturma hatası:', error)
      const fallbackRss = generateFallbackRSS()
      return new Response(fallbackRss, {
        status: 500,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
        },
      })
    }
  },
})

function generateRSSXml(data: RSSFeedData): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">',
    '  <channel>',
  ]

  // Channel bilgileri
  lines.push(`    <title><![CDATA[${data.channel.title}]]></title>`)
  lines.push(`    <description><![CDATA[${data.channel.description}]]></description>`)
  lines.push(`    <link>${escapeXml(data.channel.link)}</link>`)

  if (data.channel.image) {
    lines.push('    <image>')
    lines.push(`      <url>${escapeXml(data.channel.image.url)}</url>`)
    lines.push(`      <title><![CDATA[${data.channel.title}]]></title>`)
    lines.push(`      <link>${escapeXml(data.channel.link)}</link>`)
    lines.push('    </image>')
  }

  lines.push(`    <generator>https://rss.app</generator>`)
  lines.push(`    <lastBuildDate>${escapeXml(data.channel.lastBuildDate)}</lastBuildDate>`)

  // DÜZELTME: type="application/rss+xml" olarak güncellendi.
  lines.push(
    `    <atom:link href="${escapeXml(data.channel.link)}/rss.xml" rel="self" type="application/rss+xml" />`,
  )

  lines.push(`    <language><![CDATA[${data.channel.language}]]></language>`)

  // Items
  data.items.forEach((item) => {
    lines.push('    <item>')
    lines.push(`      <title><![CDATA[${item.title}]]></title>`)
    lines.push(`      <description><![CDATA[${item.description}]]></description>`)
    lines.push(`      <link>${escapeXml(item.link)}</link>`)
    lines.push(`      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>`)

    if (item.creator) {
      lines.push(`      <dc:creator><![CDATA[${item.creator}]]></dc:creator>`)
    }

    lines.push(`      <pubDate>${escapeXml(item.pubDate)}</pubDate>`)

    if (item.media) {
      lines.push(
        `      <media:content medium="${item.media.medium}" url="${escapeXml(item.media.url)}"/>`,
      )
    }

    lines.push('    </item>')
  })

  lines.push('  </channel>')
  lines.push('</rss>')

  return lines.join('\n')
}

// XML Escape fonksiyonu
function escapeXml(unsafe: string): string {
  if (!unsafe) return ''

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function generateFallbackRSS(): string {
  const baseUrl = getBaseUrl()
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title><![CDATA[WTFI Live - Tourism News]]></title>',
    '    <description><![CDATA[Latest tourism industry news and analysis]]></description>',
    `    <link>${baseUrl}</link>`,
    '    <language>en-us</language>',
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    '    <generator>WTFI Live CMS</generator>',
    '  </channel>',
    '</rss>',
  ].join('\n')
}

function getBaseUrl(): string {
  return (
    process.env.VITE_APP_CANONICAL_URL ||
    process.env.VITE_APP_FRONTEND_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

function getCacheControl(isDev: boolean): string {
  return isDev
    ? 'no-cache, no-store, must-revalidate'
    : 'public, max-age=1800, stale-while-revalidate=900'
}
