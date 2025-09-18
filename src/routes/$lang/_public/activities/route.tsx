import { activitySearchSchema } from '@/features/public/pages/activities/form-schema'
import { ActivityLayout } from '@/features/public/pages/activities/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/activities')({
  validateSearch: (search) => activitySearchSchema.parse(search),
  component: ActivityLayout,
})
