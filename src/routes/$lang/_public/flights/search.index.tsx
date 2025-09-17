import { FlightsSearchPage } from '@/features/public/pages/flight/page-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights/search/')({
  component: FlightsSearchPage,
})
