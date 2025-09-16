import { RentACarSearchPage } from '@/features/public/pages/rent-a-car/page-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/rent-a-car/search/')({
  component: RentACarSearchPage,
})
