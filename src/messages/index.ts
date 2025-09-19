import enCommon from './en/global-common.json'
import enComponents from './en/global-components.json'
import enModal from './en/global-modal.json'
import enCard from './en/global-card.json'
import enForm from './en/global-form.json'
import enHeader from './en/layout-header.json'
import enFooter from './en/layout-footer.json'
import enIndex from './en/page-index.json'
import enTours from './en/page-tours.json'
import enActivities from './en/page-activities.json'
import enHotels from './en/page-hotels.json'
import enSafari from './en/page-safari.json'
import enRentACar from './en/page-rent-a-car.json'
import enTransfer from './en/page-transfer.json'
import enFlights from './en/page-flights.json'
import enGuides from './en/page-guides.json'
import enHospitals from './en/page-hospitals.json'
import enVisa from './en/page-visa.json'
import enSimCards from './en/page-sim-cards.json'
import enErrors from './en/page-errors.json'
import enZod from './en/errors-zod.json'
import enApi from './en/errors-api.json'
import enSeo from './en/seo.json'

import trCommon from './tr/global-common.json'
import trComponents from './tr/global-components.json'
import trModal from './tr/global-modal.json'
import trCard from './tr/global-card.json'
import trForm from './tr/global-form.json'
import trHeader from './tr/layout-header.json'
import trFooter from './tr/layout-footer.json'
import trIndex from './tr/page-index.json'
import trTours from './tr/page-tours.json'
import trActivities from './tr/page-activities.json'
import trSafari from './tr/page-safari.json'
import trRentACar from './tr/page-rent-a-car.json'
import trHotels from './tr/page-hotels.json'
import trTransfer from './tr/page-transfer.json'
import trFlights from './tr/page-flights.json'
import trGuides from './tr/page-guides.json'
import trHospitals from './tr/page-hospitals.json'
import trVisa from './tr/page-visa.json'
import trSimCards from './tr/page-sim-cards.json'
import trErrors from './tr/page-errors.json'
import trZod from './tr/errors-zod.json'
import trApi from './tr/errors-api.json'
import trSeo from './tr/seo.json'

export type TranslationNS = (typeof namespaces)[number]

export const defaultNS = 'global-common'

export const namespaces = [
  'global-common',
  'global-components',
  'global-modal',
  'global-card',
  'global-form',
  'layout-header',
  'layout-footer',
  'page-index',
  'page-tours',
  'page-activities',
  'page-hotels',
  'page-safari',
  'page-rent-a-car',
  'page-transfer',
  'page-flights',
  'page-guides',
  'page-hospitals',
  'page-visa',
  'page-sim-cards',
  'page-errors',
  'errors-zod',
  'errors-api',
] as const

const resource = {
  en: {
    'global-common': enCommon,
    'global-components': enComponents,
    'global-modal': enModal,
    'global-card': enCard,
    'global-form': enForm,
    'layout-header': enHeader,
    'layout-footer': enFooter,
    'page-index': enIndex,
    'page-tours': enTours,
    'page-activities': enActivities,
    'page-hotels': enHotels,
    'page-safari': enSafari,
    'page-rent-a-car': enRentACar,
    'page-transfer': enTransfer,
    'page-flights': enFlights,
    'page-guides': enGuides,
    'page-hospitals': enHospitals,
    'page-visa': enVisa,
    'page-sim-cards': enSimCards,
    'page-errors': enErrors,
    'errors-zod': enZod,
    'errors-api': enApi,
    seo: enSeo,
  },
  tr: {
    'global-common': trCommon,
    'global-components': trComponents,
    'global-modal': trModal,
    'global-card': trCard,
    'global-form': trForm,
    'layout-header': trHeader,
    'layout-footer': trFooter,
    'page-index': trIndex,
    'page-tours': trTours,
    'page-activities': trActivities,
    'page-hotels': trHotels,
    'page-safari': trSafari,
    'page-rent-a-car': trRentACar,
    'page-transfer': trTransfer,
    'page-flights': trFlights,
    'page-guides': trGuides,
    'page-hospitals': trHospitals,
    'page-visa': trVisa,
    'page-sim-cards': trSimCards,
    'page-errors': trErrors,
    'errors-zod': trZod,
    'errors-api': trApi,
    seo: trSeo,
  },
}

export default resource
