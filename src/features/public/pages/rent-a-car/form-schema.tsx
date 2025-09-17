import z from 'zod'

export const rentACarSearchSchema = z.object({
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
})

export type SearchFormValues = z.infer<typeof rentACarSearchSchema>
