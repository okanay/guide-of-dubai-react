import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { format } from 'date-fns'

export interface FilterState {
  dateStart: string
  dateEnd: string
  timeStart: string
  timeEnd: string
}

// Store'un tam tipi
type FilterStore = {
  filters: FilterState
  setFilterValue: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
}

// Provider'a verilecek başlangıç verisi için tip
type Props = PropsWithChildren<{
  initialState: Partial<FilterState>
}>

// Store'u oluşturmak için Context
const FilterContext = createContext<StoreApi<FilterStore> | undefined>(undefined)

export function RentACarFilterProvider({ children, initialState }: Props) {
  const [store] = useState(() =>
    createStore<FilterStore>()(
      immer((set) => ({
        filters: {
          dateStart: initialState.dateStart || format(new Date(), 'yyyy-MM-dd'),
          dateEnd: initialState.dateEnd || format(new Date(), 'yyyy-MM-dd'),
          timeStart: initialState.timeStart || '10:00',
          timeEnd: initialState.timeEnd || '20:00',
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

  return <FilterContext.Provider value={store}>{children}</FilterContext.Provider>
}

export function useRentACarStore(): FilterStore {
  const store = useContext(FilterContext)

  if (!store) {
    throw new Error('useRentACarFilter must be used within a RentACarFilterProvider')
  }

  return useStore(store)
}
