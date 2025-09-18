import { ActivitySearchPage } from '@/features/public/pages/activities/page-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/activities/search/')({
  component: ActivitySearchPage,
})
