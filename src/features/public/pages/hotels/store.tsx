import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { format } from 'date-fns'
import { HotelFilterState } from './form-schema'

// Store'un tam tipi
type HotelFilterStore = {
  filters: HotelFilterState
  setFilterValue: <K extends keyof HotelFilterState>(key: K, value: HotelFilterState[K]) => void
}

// Provider'a verilecek başlangıç verisi için tip
type Props = PropsWithChildren<{
  initialState: Partial<HotelFilterState>
}>

// Store'u oluşturmak için Context
const HotelFilterContext = createContext<StoreApi<HotelFilterStore> | undefined>(undefined)

export function HotelFilterProvider({ children, initialState }: Props) {
  const [store] = useState(() =>
    createStore<HotelFilterStore>()(
      immer((set) => ({
        filters: {
          search: initialState.search || '',
          dateStart: initialState.dateStart || format(new Date(), 'yyyy-MM-dd'),
          dateEnd: initialState.dateEnd || format(new Date(), 'yyyy-MM-dd'),
          adult: initialState.adult || 2,
          child: initialState.child || 1,
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

  return <HotelFilterContext.Provider value={store}>{children}</HotelFilterContext.Provider>
}

export function useHotelStore(): HotelFilterStore {
  const store = useContext(HotelFilterContext)

  if (!store) {
    throw new Error('useHotelStore must be used within a HotelFilterProvider')
  }

  return useStore(store)
}
