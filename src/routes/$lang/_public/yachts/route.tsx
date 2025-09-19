import { yachtsSearchSchema } from '@/features/public/pages/yachts/form-schema'
import { YachtsLayout } from '@/features/public/pages/yachts/layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yachts')({
  validateSearch: (search) => yachtsSearchSchema.parse(search),
  component: YachtsLayout,
})
