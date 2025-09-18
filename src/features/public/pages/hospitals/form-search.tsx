import { useTranslation } from 'react-i18next'
import { useHospitalStore } from './store'

export const HospitalSearchForm = () => {
  const { t } = useTranslation('page-hospitals')
  const filterHospitals = useHospitalStore((state) => state.filterHospitals)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    filterHospitals(e.target.value)
  }

  return null
}
