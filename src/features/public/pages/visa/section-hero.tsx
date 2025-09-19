import { useTranslation } from 'react-i18next'
import { useSystemSettings } from '@/features/modals/system-settings/store'
import { VisaCard } from '../../components/cards/card-visa'

export const HeroSection = () => {
  const { t } = useTranslation(['page-visa', 'global-card'])
  const { currency } = useSystemSettings()
  const visas = t('visas', { returnObjects: true }) as VisaProduct[]

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-10">
        <header className="mb-4 flex items-start justify-between sm:items-end">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-size-2xl font-bold">{t('hero.title')}</h2>
            <p className="text-size-base text-gray-700">{t('hero.description')}</p>
          </div>
        </header>

        {/* Cards Container */}
        <div className="grid snap-none grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-x-4 gap-y-8 overflow-x-auto pb-4">
          {visas.map((visa, index) => (
            <div key={visa.id} className="w-full min-w-[360px] shrink-0">
              <VisaCard visa={visa} currency={currency} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
