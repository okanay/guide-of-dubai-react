import { hospitalSearchSchema } from '@/features/public/pages/hospitals/form-schema'
import { HospitalIndexPage } from '@/features/public/pages/hospitals/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/hospitals/')({
  validateSearch: (search) => hospitalSearchSchema.parse(search),
  component: HospitalIndexPage,
})
