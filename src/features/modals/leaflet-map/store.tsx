// store.ts - Refactored and unified
import { create } from 'zustand'

// ============================================================================
// UNIFIED TYPES - Tek bir hotel interface'i
// ============================================================================
export interface Hotel {
  name: string
  coords: [number, number]
  price: number
  currency: string
  rating?: number
  address?: string
  description?: string
  image?: string
  amenities?: string[]
}

// ============================================================================
// MODAL PAYLOAD TYPES - Her mod için ayrı payload yapısı
// ============================================================================
export type PinPayload = {
  mode: 'pin'
  data: {
    coords: [number, number]
    name?: string
  }
}

export type PricePayload = {
  mode: 'price'
  data: Pick<Hotel, 'coords' | 'name' | 'price' | 'currency'>[]
}

export type CardPayload = {
  mode: 'card'
  data: Hotel[]
}

export type ModalPayload = PinPayload | PricePayload | CardPayload

// ============================================================================
// STORE INTERFACE
// ============================================================================
interface LeafletModalState {
  // State
  isOpen: boolean
  payload: ModalPayload | null
  selectedHotelIndex: number | null

  // Actions
  openModal: (payload: ModalPayload) => void
  closeModal: () => void
  selectHotel: (index: number) => void
  clearSelection: () => void
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================
export const useLeafletModalStore = create<LeafletModalState>((set) => ({
  // Initial State
  isOpen: false,
  payload: null,
  selectedHotelIndex: null,

  // Actions
  openModal: (payload) =>
    set({
      isOpen: true,
      payload,
      selectedHotelIndex: null,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      payload: null,
      selectedHotelIndex: null,
    }),

  selectHotel: (index) => set({ selectedHotelIndex: index }),
  clearSelection: () => set({ selectedHotelIndex: null }),
}))

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const openPinModal = (coords: [number, number], name?: string) => {
  useLeafletModalStore.getState().openModal({
    mode: 'pin',
    data: { coords, name },
  })
}

export const openPriceModal = (hotels: PricePayload['data']) => {
  useLeafletModalStore.getState().openModal({
    mode: 'price',
    data: hotels,
  })
}

export const openCardModal = (hotels: Hotel[]) => {
  useLeafletModalStore.getState().openModal({
    mode: 'card',
    data: hotels,
  })
}
