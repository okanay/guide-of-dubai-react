import { ActivityLayout } from '@/features/public/pages/activity/layout'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const activitySearchSchema = z.object({
  date: z.string().optional(),
  adult: z.number().optional(),
  child: z.number().optional(),
})

export const Route = createFileRoute('/$lang/_public/activities')({
  validateSearch: (search) => activitySearchSchema.parse(search),
  component: ActivityLayout,
})
