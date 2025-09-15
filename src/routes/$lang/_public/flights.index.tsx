import { FlightIndexPage } from '@/features/public/pages/flight'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights/')({
  component: FlightIndexPage,
})
