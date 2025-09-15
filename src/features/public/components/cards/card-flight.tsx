import React from 'react'
import { useTranslation } from 'react-i18next'

interface CardFlightProps {
  flight: Flight
}

export const CardFlight: React.FC<CardFlightProps> = ({ flight }) => {
  const { t } = useTranslation('global-card')

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xs border border-gray-100 bg-white shadow">
      {/* Images Section */}
      <div className="relative h-48 w-full">
        <div
          className="absolute left-0 z-11 h-full w-[58.5%] bg-cover bg-center"
          style={{
            backgroundImage: `url(${flight.images.from})`,
            clipPath: 'polygon(0 0, 75% 0, 100% 100%, 0% 100%)',
          }}
        />
        <div
          className="absolute right-0 z-10 h-full w-[55%] bg-cover bg-center"
          style={{
            backgroundImage: `url(${flight.images.to})`,
            clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 25% 100%)',
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col sm:flex-row">
          {/* Flight Info */}
          <div className="flex flex-grow flex-col gap-y-1">
            <h3 className="text-on-box-blac text-size-lg font-bold">
              {flight.from} - {flight.to}
            </h3>
            <p className="text-size-sm text-on-box-black">{flight.departureDate}</p>
            <p className="text-size-sm text-on-box-black">{flight.tripType}</p>
          </div>

          {/* Divider */}
          <hr className="mt-4 mb-2 border-gray-100 sm:hidden" aria-hidden="true" />

          {/* Price Info */}
          <div className="mt-2 flex flex-col gap-y-1 text-left sm:mt-0 sm:text-right">
            <p className="text-size-xl font-bold text-on-box-black">{flight.price}</p>
            <p className="mb-1 text-size-xs text-gray-700">{t('flight.starting_from')}</p>

            {/* Action Button */}
            <button className="w-full rounded-xs bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 sm:ml-auto sm:w-auto">
              {t('flight.view_flights')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
