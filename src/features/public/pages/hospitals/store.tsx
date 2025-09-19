import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { format } from 'date-fns'
import { HospitalSearchFilter } from './form-schema'

// Store'un tam tipi
type HospitalFilterStore = {
  filters: HospitalSearchFilter
  setFilterValue: <K extends keyof HospitalSearchFilter>(
    key: K,
    value: HospitalSearchFilter[K],
  ) => void
}

// Provider'a verilecek başlangıç verisi için tip
type Props = PropsWithChildren<{
  initialState: Partial<HospitalSearchFilter>
}>

// Store'u oluşturmak için Context
const HospitalFilterContext = createContext<StoreApi<HospitalFilterStore> | undefined>(undefined)

export function HospitalFilterProvider({ children, initialState }: Props) {
  const [store] = useState(() =>
    createStore<HospitalFilterStore>()(
      immer((set) => ({
        filters: {
          search: initialState.search || '',
        },

        // Tek bir input'un değerini güncelleyen eylem
        setFilterValue: (key, value) => {
          set((state) => {
            state.filters[key] = value
          })
        },
      })),
    ),
  )

  return <HospitalFilterContext.Provider value={store}>{children}</HospitalFilterContext.Provider>
}

export function useHospitalStore(): HospitalFilterStore {
  const store = useContext(HospitalFilterContext)

  if (!store) {
    throw new Error('useHotelStore must be used within a HotelFilterProvider')
  }

  return useStore(store)
}
