import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { format } from 'date-fns'
import { YachtsFilterState } from './form-schema'

// Store'un tam tipi
type YachtsFilterStore = {
  filters: YachtsFilterState
  setFilterValue: <K extends keyof YachtsFilterState>(key: K, value: YachtsFilterState[K]) => void
}

// Provider'a verilecek başlangıç verisi için tip
type Props = PropsWithChildren<{
  initialState: Partial<YachtsFilterState>
}>

// Store'u oluşturmak için Context
const YachtsFilterContext = createContext<StoreApi<YachtsFilterStore> | undefined>(undefined)

export function YachtsFilterProvider({ children, initialState }: Props) {
  const [store] = useState(() =>
    createStore<YachtsFilterStore>()(
      immer((set) => ({
        filters: {
          date: initialState.date || format(new Date(), 'yyyy-MM-dd'),
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

  return <YachtsFilterContext.Provider value={store}>{children}</YachtsFilterContext.Provider>
}

export function useYachtsStore(): YachtsFilterStore {
  const store = useContext(YachtsFilterContext)

  if (!store) {
    throw new Error('useYachtsStore must be used within an YachtsFilterProvider')
  }

  return useStore(store)
}
