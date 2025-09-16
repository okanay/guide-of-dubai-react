import { FlightsSearchPage } from '@/features/public/pages/flight/page-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights/search')({
  beforeLoad: async ({ search }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {}
  },
  component: FlightsSearchPage,
})
