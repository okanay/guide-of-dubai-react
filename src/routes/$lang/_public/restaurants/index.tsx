import { RestaurantIndexPage } from '@/features/public/pages/restaurants/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/restaurants/')({
  component: RestaurantIndexPage,
})
