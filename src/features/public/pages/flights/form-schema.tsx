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

export interface FlightFilterState {
  tripType: 'one-way' | 'round-trip'
  from: string
  to: string
  departureDate: string
  returnDate?: string
  adults: number
  children: number
  directFlightsOnly: boolean
}
