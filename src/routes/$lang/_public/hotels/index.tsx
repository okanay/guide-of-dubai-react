import { HotelIndexPage } from '@/features/public/pages/hotel/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/hotels/')({
  component: HotelIndexPage,
})
