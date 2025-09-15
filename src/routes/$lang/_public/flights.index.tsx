import { FlightsIndexPage } from '@/features/public/pages/flight/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights/')({
  component: FlightsIndexPage,
})
