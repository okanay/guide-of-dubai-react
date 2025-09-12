import { ActivitySearchPage } from '@/features/public/pages/activity/page-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/activities/search')({
  beforeLoad: async ({ search: { date, child, adult } }) => {},
  component: ActivitySearchPage,
})
