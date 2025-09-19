import { SafariToursIndexPage } from '@/features/public/pages/safari-tour/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/safari-tour/')({
  component: SafariToursIndexPage,
})
