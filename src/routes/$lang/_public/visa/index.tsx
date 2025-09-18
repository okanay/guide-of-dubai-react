import { VisaIndexPage } from '@/features/public/pages/visa/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/visa/')({
  component: VisaIndexPage,
})
