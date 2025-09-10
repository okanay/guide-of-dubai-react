import React, { useMemo } from 'react'
import { useLanguage } from 'src/i18n/prodiver'
import { getCountries } from 'src/utils/countries'
import { SearchableSelect, type SearchableSelectProps } from './searchable-select'

export type CountrySelectProps = Omit<SearchableSelectProps, 'options'>

export const CountrySelect = React.forwardRef<HTMLInputElement, CountrySelectProps>(
  (props, ref) => {
    const { language } = useLanguage()

    const countryOptions = useMemo(() => {
      return getCountries(language.locale).map((country) => ({
        value: country.iso2,
        label: country.name,
      }))
    }, [language.locale])
    // =====================================

    return <SearchableSelect {...props} options={countryOptions} placeholder="Bir ülke seçin..." />
  },
)
