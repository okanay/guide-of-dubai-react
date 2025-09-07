import { ToursIndexPage } from '@/features/public/pages/tour'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/tours/')({
  component: ToursIndexPage,
})
