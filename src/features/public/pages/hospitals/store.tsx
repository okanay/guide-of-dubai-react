import { create } from 'zustand'

interface HospitalState {
  hospitals: Hospital[]
  filteredHospitals: Hospital[]
  setHospitals: (hospitals: Hospital[]) => void
  filterHospitals: (searchTerm: string) => void
}

export const useHospitalStore = create<HospitalState>((set) => ({
  hospitals: [],
  filteredHospitals: [],
  setHospitals: (hospitals) => set({ hospitals, filteredHospitals: hospitals }),
  filterHospitals: (searchTerm) =>
    set((state) => ({
      filteredHospitals: state.hospitals.filter((hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    })),
}))
