import { create } from 'zustand'

// ============================================================================
// MODAL TİPLERİ - Her mod için ayrı payload türleri
// ============================================================================

// 1. PIN MODE - Sadece tek bir pin göstermek için
type PinPayload = {
  mode: 'pin'
  data: {
    coords: [number, number]
    name?: string
  }
}

// ============================================================================

// 2. PRICE MODE - Fiyat etiketli birden çok oteli göstermek için
type PricePayload = {
  mode: 'price'
  data: {
    coords: [number, number]
    name: string
    price: number
    currency: string
  }[]
}

// ============================================================================

// 3. CARD MODE - Kart modunda otelleri göstermek için (harita + kart listesi)
type CardPayload = {
  mode: 'card'
  data: {
    coords: [number, number]
    name: string
    price: number
    currency: string
    rating?: number
    image?: string
    address?: string
    amenities?: string[]
    description?: string
  }[]
}

// ============================================================================
// STORE TİPLERİ VE İNTERFACE
// ============================================================================

type ModalPayload = PinPayload | PricePayload | CardPayload

interface LeafletModalState {
  // State
  isOpen: boolean
  payload: ModalPayload | null
  selectedHotelIndex: number | null // Sadece card modunda kullanılır

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

  // Modal Actions
  openModal: (payload) =>
    set({
      isOpen: true,
      payload,
      selectedHotelIndex: null, // Her açılışta seçimi temizle
    }),

  closeModal: () =>
    set({
      isOpen: false,
      payload: null,
      selectedHotelIndex: null,
    }),

  // Hotel Selection Actions (Sadece card modunda kullanılır)
  selectHotel: (index) => set({ selectedHotelIndex: index }),

  clearSelection: () => set({ selectedHotelIndex: null }),
}))

// ============================================================================
// HELPER FUNCTIONS (İsteğe bağlı kullanım için)
// ============================================================================

// Pin modal açma helper'ı
export const openPinModal = (coords: [number, number], name?: string) => {
  useLeafletModalStore.getState().openModal({
    mode: 'pin',
    data: { coords, name },
  })
}

// Price modal açma helper'ı
export const openPriceModal = (hotels: PricePayload['data']) => {
  useLeafletModalStore.getState().openModal({
    mode: 'price',
    data: hotels,
  })
}

// Card modal açma helper'ı
export const openCardModal = (hotels: CardPayload['data']) => {
  useLeafletModalStore.getState().openModal({
    mode: 'card',
    data: hotels,
  })
}
