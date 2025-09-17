import z from 'zod'

export const hotelsSearchSchema = z.object({
  search: z.string().optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  adult: z.number().optional(),
  child: z.number().optional(),
})

export interface HotelFilterState {
  search: string
  dateStart: string
  dateEnd: string
  adult: number
  child: number
}
