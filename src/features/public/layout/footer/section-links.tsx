import Icon from '@/components/icon'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'src/i18n/router/link'

// Linkler ve başlıkları için dinamik veri yapıları
const getFooterLinksStructure = (t: (key: string) => string) => [
  {
    title: t('links.guide_of_dubai'),
    links: [
      { label: t('links.about'), href: '/about' },
      { label: t('links.contact'), href: '/contact' },
      { label: t('links.blog'), href: '/blog' },
      { label: t('links.faq'), href: '/faq' },
    ],
  },
  {
    title: t('links.contracts_policies'),
    links: [
      { label: t('links.terms'), href: '/terms' },
      { label: t('links.kvkk'), href: '/kvkk' },
      { label: t('links.privacy'), href: '/privacy' },
      { label: t('links.sales'), href: '/sales' },
    ],
  },
  {
    title: t('links.other_services'),
    links: [
      { label: t('links.hotels'), href: '/hotels' },
      { label: t('links.rent_a_car'), href: '/rent-a-car' },
      { label: t('links.visa'), href: '/visa' },
      { label: t('links.yacht_rental'), href: '/yacht-rental' },
    ],
  },
  {
    title: t('links.popular_activities'),
    links: [
      { label: t('links.safari_tour'), href: '/safari-tour' },
      { label: t('links.city_tour'), href: '/city-tour' },
      { label: t('links.abu_dhabi_tour'), href: '/abu-dhabi-tour' },
      { label: t('links.helicopter_tour'), href: '/helicopter-tour' },
    ],
  },
  {
    title: t('links.popular_places'),
    links: [
      { label: t('links.museum_of_future'), href: '/museum-of-future' },
      { label: t('links.burj_khalifa'), href: '/burj-khalifa' },
      { label: t('links.miracle_garden'), href: '/miracle-garden' },
      { label: t('links.jet_ski'), href: '/jet-ski' },
    ],
  },
]

// Sosyal medya ikonları
const getSocialLinks = (t: (key: string) => string) => [
  {
    Icon: Instagram,
    href: 'https://instagram.com',
    label: t('copyright.social_labels.instagram'),
  },
  {
    Icon: Twitter,
    href: 'https://twitter.com',
    label: t('copyright.social_labels.twitter'),
  },
  {
    Icon: Linkedin,
    href: 'https://linkedin.com',
    label: t('copyright.social_labels.linkedin'),
  },
  {
    Icon: Facebook,
    href: 'https://facebook.com',
    label: t('copyright.social_labels.facebook'),
  },
]

// Linkler bölümü
export const LinksSection = () => {
  const { t } = useTranslation('layout-footer')
  const footerLinks = getFooterLinksStructure(t)

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-6">
      {footerLinks.map((column) => (
        <FooterLinkColumn key={column.title} title={column.title} links={column.links} />
      ))}
      <div className="flex items-end justify-start sm:col-span-2 sm:items-end sm:justify-start md:col-span-1 md:justify-end">
        <Icon name="brand/full-white" width={144} className="w-30 pt-8 sm:w-40" />
      </div>
    </div>
  )
}

// Tek bir link sütunu için bileşen
const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) => (
  <div>
    <h5 className="mb-4 text-size font-bold text-white">{title}</h5>
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
export const CopyrightSection = () => {
  const { t } = useTranslation('layout-footer')
  const socialLinks = getSocialLinks(t)

  return (
    <div className="bg-card-surface px-4 text-size-xs text-gray-400">
      <div className="mx-auto flex max-w-main flex-col items-center gap-y-4 py-6 md:flex-row md:justify-between">
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
        <a href={`mailto:${t('copyright.email')}`} className="">
          {t('copyright.email')}
        </a>
        <p className="text-center md:text-right">{t('copyright.rights')}</p>
      </div>
    </div>
  )
}
