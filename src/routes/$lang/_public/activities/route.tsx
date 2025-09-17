import { activitySearchSchema } from '@/features/public/pages/activity/form-schema'
import { ActivityLayout } from '@/features/public/pages/activity/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/activities')({
  validateSearch: (search) => activitySearchSchema.parse(search),
  component: ActivityLayout,
})
