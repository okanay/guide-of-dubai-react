import { RentACarIndexPage } from '@/features/public/pages/rent-a-car/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/rent-a-car/')({
  component: RentACarIndexPage,
})
