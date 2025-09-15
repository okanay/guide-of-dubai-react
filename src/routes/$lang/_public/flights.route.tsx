import { FlightsLayout } from '@/features/public/pages/flight/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights')({
  component: FlightsLayout,
})
