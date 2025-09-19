import z from 'zod'

export const yachtsSearchSchema = z.object({
  date: z.string().optional(),
  adult: z.number().optional(),
  child: z.number().optional(),
})

export interface YachtsFilterState {
  date: string
  adult: number
  child: number
}
