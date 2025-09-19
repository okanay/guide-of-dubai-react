import { HospitalLayout } from '@/features/public/pages/hospitals/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/hospitals')({
  component: HospitalLayout,
})
