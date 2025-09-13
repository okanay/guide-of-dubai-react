import { HotelLayout } from '@/features/public/pages/hotel/layout'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const hotelsSearchSchema = z.object({
  search: z.string().optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  adult: z.number().optional(),
  child: z.number().optional(),
})

export const Route = createFileRoute('/$lang/_public/hotels')({
  validateSearch: (search) => hotelsSearchSchema.parse(search),
  component: HotelLayout,
})
