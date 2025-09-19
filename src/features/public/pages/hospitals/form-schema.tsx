import { z } from 'zod'

export const hospitalSearchSchema = z.object({
  searchTerm: z.string().optional(),
})

export interface HospitalSearchFilter {
  search: string
}
