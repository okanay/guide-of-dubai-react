import { YachtsSelectBySlugPage } from '@/features/public/pages/yachts/page-select-by-slug'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yachts/select/$slug')({
  component: YachtsSelectBySlugPage,
})
