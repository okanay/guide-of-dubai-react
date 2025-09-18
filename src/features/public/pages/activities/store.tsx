import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { format } from 'date-fns'
import { ActivityFilterState } from './form-schema'

// Store'un tam tipi
type ActivityFilterStore = {
  filters: ActivityFilterState
  setFilterValue: <K extends keyof ActivityFilterState>(
    key: K,
    value: ActivityFilterState[K],
  ) => void
}

// Provider'a verilecek başlangıç verisi için tip
type Props = PropsWithChildren<{
  initialState: Partial<ActivityFilterState>
}>

// Store'u oluşturmak için Context
const ActivityFilterContext = createContext<StoreApi<ActivityFilterStore> | undefined>(undefined)

export function ActivityFilterProvider({ children, initialState }: Props) {
  const [store] = useState(() =>
    createStore<ActivityFilterStore>()(
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

  return <ActivityFilterContext.Provider value={store}>{children}</ActivityFilterContext.Provider>
}

export function useActivityStore(): ActivityFilterStore {
  const store = useContext(ActivityFilterContext)

  if (!store) {
    throw new Error('useActivityStore must be used within an ActivityFilterProvider')
  }

  return useStore(store)
}
