import { ActivityIndexPage } from '@/features/public/pages/activities/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/activities/')({
  component: ActivityIndexPage,
})
