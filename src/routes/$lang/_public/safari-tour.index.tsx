import { SafariToursIndexPage } from '@/features/public/pages/tour-safari'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/safari-tour/')({
  component: SafariToursIndexPage,
})
