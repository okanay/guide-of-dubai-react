import { useTranslation } from 'react-i18next'
import { HospitalCard } from '../../components/cards/card-hospital'
import { useHospitalStore } from './store'
import { MOCK_HOSPITALS } from '@/mockdata/hospitals'
import { useEffect } from 'react'
import { useSnapScroll } from '@/hooks/use-snap-scroll'

export const HospitalSuggestionSection = () => {
  const { t } = useTranslation('page-hospitals')
  const { filteredHospitals, setHospitals } = useHospitalStore()

  useEffect(() => {
    setHospitals(MOCK_HOSPITALS)
  }, [setHospitals])

  const { containerRef, cardRefs } = useSnapScroll({ updateOnMount: true })

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    if (cardRefs.current) {
      cardRefs.current[index] = el
    }
  }

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-6 pb-10">
        <header className="mb-4 flex items-start justify-between sm:items-center">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-2xl font-bold">{t('suggestions.title')}</h2>
          </div>
        </header>
        <div className="relative">
          <div
            ref={containerRef as any}
            className="scrollbar-hide flex snap-x snap-mandatory gap-x-4 gap-y-8 overflow-x-auto pb-4 md:grid md:snap-none md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] md:gap-x-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {filteredHospitals.map((hospital, index) => (
              <div
                key={hospital.id}
                ref={setCardRef(index)}
                className="w-[calc(25%_-_1rem)] min-w-[260px] shrink-0 snap-start md:w-full"
              >
                <HospitalCard hospital={hospital} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
