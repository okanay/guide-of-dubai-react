import { flightsFormSchema } from '@/features/public/pages/flights/form-schema'
import { FlightsLayout } from '@/features/public/pages/flights/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights')({
  validateSearch: (search) => flightsFormSchema.parse(search),
  component: FlightsLayout,
})
