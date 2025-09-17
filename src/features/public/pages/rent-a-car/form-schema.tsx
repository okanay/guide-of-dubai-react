import z from 'zod'

export const rentACarSearchSchema = z.object({
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
})

export interface RentACarFilterState {
  dateStart: string
  dateEnd: string
  timeStart: string
  timeEnd: string
}
