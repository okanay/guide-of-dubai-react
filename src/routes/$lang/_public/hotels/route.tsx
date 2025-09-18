import { hotelsSearchSchema } from '@/features/public/pages/hotels/form-schema'
import { HotelLayout } from '@/features/public/pages/hotels/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/hotels')({
  validateSearch: (search) => hotelsSearchSchema.parse(search),
  component: HotelLayout,
})
