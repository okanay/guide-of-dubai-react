import { create } from 'zustand'

interface LeafletModalState {
  isOpen: boolean
  coords: [number, number] | null // Başlangıçta null olması daha güvenli
  hotelName?: string
  openModal: (coords: [number, number], hotelName?: string) => void
  closeModal: () => void
}

export const useLeafletModalStore = create<LeafletModalState>((set) => ({
  isOpen: false,
  coords: null,
  hotelName: undefined,
  openModal: (coords, hotelName) => set({ isOpen: true, coords, hotelName }),
  closeModal: () => set({ isOpen: false, coords: null, hotelName: undefined }),
}))
