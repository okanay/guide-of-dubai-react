import { HotelSearchPage } from '@/features/public/pages/hotel/page-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/hotels/search')({
  component: HotelSearchPage,
})
