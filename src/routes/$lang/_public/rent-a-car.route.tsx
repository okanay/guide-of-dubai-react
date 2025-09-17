import { RentACarLayout } from '@/features/public/pages/rent-a-car/layout'
import { rentACarSearchSchema } from '@/features/public/pages/rent-a-car/form-schema'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/rent-a-car')({
  validateSearch: (search) => rentACarSearchSchema.parse(search),
  component: RentACarLayout,
})
