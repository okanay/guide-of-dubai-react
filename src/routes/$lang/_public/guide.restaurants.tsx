import { RestaurantIndexPage } from '@/features/public/pages/guide/restaurant/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/restaurants')({
  component: RestaurantIndexPage,
})
