import z from 'zod'

export const activitySearchSchema = z.object({
  date: z.string().optional(),
  adult: z.number().optional(),
  child: z.number().optional(),
})

export interface ActivityFilterState {
  date: string
  adult: number
  child: number
}
