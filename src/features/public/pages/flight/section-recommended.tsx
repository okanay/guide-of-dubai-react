import React from 'react'
import { useTranslation } from 'react-i18next'
import { MOCK_FLIGHTS } from '@/mockdata/flights'
import { CardFlight } from '../../components/cards/card-flight'

export const RecommendedFlights = () => {
  const { t } = useTranslation('page-flights')

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-6 pb-10">
        <header className="mb-4 flex items-start justify-between sm:items-end">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-size-2xl font-bold">{t('recommended.title')}</h2>
            <p className="text-size-base text-gray-700">{t('recommended.description')}</p>
          </div>
        </header>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {MOCK_FLIGHTS.map((flight) => (
            <CardFlight key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </section>
  )
}
