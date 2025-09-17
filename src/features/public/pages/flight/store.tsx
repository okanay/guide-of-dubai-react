import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { format } from 'date-fns'
import { FlightFilterState } from './form-schema'

// Store'un tam tipi
type FlightFilterStore = {
  filters: FlightFilterState
  setFilterValue: <K extends keyof FlightFilterState>(key: K, value: FlightFilterState[K]) => void
}

// Provider'a verilecek başlangıç verisi için tip
type Props = PropsWithChildren<{
  initialState: Partial<FlightFilterState>
}>

// Store'u oluşturmak için Context
const FlightFilterContext = createContext<StoreApi<FlightFilterStore> | undefined>(undefined)

export function FlightFilterProvider({ children, initialState }: Props) {
  const [store] = useState(() =>
    createStore<FlightFilterStore>()(
      immer((set) => ({
        filters: {
          tripType: initialState.tripType || 'round-trip',
          from: initialState.from || '',
          to: initialState.to || '',
          departureDate: initialState.departureDate || format(new Date(), 'yyyy-MM-dd'),
          returnDate: initialState.returnDate || format(new Date(), 'yyyy-MM-dd'),
          adults: initialState.adults || 1,
          children: initialState.children || 0,
          directFlightsOnly: initialState.directFlightsOnly || false,
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

  return <FlightFilterContext.Provider value={store}>{children}</FlightFilterContext.Provider>
}

export function useFlightStore(): FlightFilterStore {
  const store = useContext(FlightFilterContext)

  if (!store) {
    throw new Error('useFlightStore must be used within a FlightFilterProvider')
  }

  return useStore(store)
}
