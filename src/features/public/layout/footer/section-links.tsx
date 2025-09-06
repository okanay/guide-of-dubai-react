import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Link } from 'src/i18n/router/link'

// Linkleri ve başlıkları içeren veri yapıları
const footerLinks = [
  {
    title: 'Guide of Dubai',
    links: [
      { label: 'Hakkımızda', href: '/about' },
      { label: 'İletişim', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'S.S.S', href: '/faq' },
    ],
  },
  {
    title: 'Sözleşmeler & Politikalar',
    links: [
      { label: 'Kullanım Sözleşmesi', href: '/terms' },
      { label: 'KVKK Sözleşmesi', href: '/kvkk' },
      { label: 'Gizlilik Politikası', href: '/privacy' },
      { label: 'Satış Sözleşmesi', href: '/sales' },
    ],
  },
  {
    title: 'Diğer Hizmetler',
    links: [
      { label: 'Otel Konaklama', href: '/hotels' },
      { label: 'Araç Kiralama', href: '/rent-a-car' },
      { label: 'Dubai Vizesi', href: '/visa' },
      { label: 'Yat Kiralama', href: '/yacht-rental' },
    ],
  },
  {
    title: 'Popüler Aktiviteler',
    links: [
      { label: 'Dubai Safari Turu', href: '/safari-tour' },
      { label: 'Dubai Şehir Turu', href: '/city-tour' },
      { label: 'Abu Dhabi Şehir Turu', href: '/abu-dhabi-tour' },
      { label: 'Dubai Helikopter Turu', href: '/helicopter-tour' },
    ],
  },
  {
    title: 'Popüler Mekanlar',
    links: [
      { label: 'Museum of the Future', href: '/museum-of-future' },
      { label: 'Burj Khalifa', href: '/burj-khalifa' },
      { label: 'Miracle Garden', href: '/miracle-garden' },
      { label: 'Dubai Jet Ski', href: '/jet-ski' },
    ],
  },
]

// Alt bölümdeki sosyal medya ikonları
const socialLinks = [
  {
    Icon: Instagram,
    href: 'https://instagram.com',
    label: 'Instagram',
  },
  { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  {
    Icon: Linkedin,
    href: 'https://linkedin.com',
    label: 'LinkedIn',
  },
  {
    Icon: Facebook,
    href: 'https://facebook.com',
    label: 'Facebook',
  },
]

// Linkler bölümü
export const LinksSection = () => (
  <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
    {footerLinks.map((column) => (
      <FooterLinkColumn key={column.title} title={column.title} links={column.links} />
    ))}
    <div className="flex items-end justify-start sm:col-span-2 sm:items-end sm:justify-start md:col-span-1 md:justify-end dark:invert">
      <img
        src="/images/brand/brand-full-white.svg"
        alt="Guide of Dubai Logo"
        className="w-30 sm:w-40"
      />
    </div>
  </div>
)

// Tek bir link sütunu için bileşen
const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) => (
  <div>
    <h5 className="mb-4 font-bold text-white">{title}</h5>
    <ul className="flex flex-col gap-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to="/$lang/not-found"
            className="text-size-sm text-gray-400 transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

// Telif hakkı ve sosyal medya bölümü
export const CopyrightSection = () => (
  <div className="bg-card-surface px-4 text-size-xs text-gray-400">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-y-4 py-6 md:flex-row md:justify-between">
      <div className="flex items-center gap-x-4">
        {socialLinks.map(({ Icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
      <a href="mailto:email.info@guidedfdubai.com" className="">
        email.info@guidedfdubai.com
      </a>
      <p className="text-center md:text-right">
        HOI Holding, H O I Tourism LLC DED License No:1502598. All rights reserved © 2025 - We are
        here for a reliable travel experience
      </p>
    </div>
  </div>
)
