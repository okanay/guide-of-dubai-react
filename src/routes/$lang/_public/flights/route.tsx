import { FlightsLayout } from '@/features/public/pages/flight/layout'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const flightsFormSchema = z.object({
  tripType: z.enum(['one-way', 'round-trip']).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  departureDate: z.string().optional(),
  returnDate: z.string().optional(),
  adults: z.number().optional(),
  children: z.number().optional(),
  directFlightsOnly: z.boolean().optional(),
})

export const Route = createFileRoute('/$lang/_public/flights')({
  validateSearch: (search) => flightsFormSchema.parse(search),
  component: FlightsLayout,
})
