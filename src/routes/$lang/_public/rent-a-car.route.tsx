import { RentACarLayout } from '@/features/public/pages/rent-a-car/layout'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const rentACarSearchSchema = z.object({
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
})

export const Route = createFileRoute('/$lang/_public/rent-a-car')({
  validateSearch: (search) => rentACarSearchSchema.parse(search),
  component: RentACarLayout,
})
