import { YachtsIndexPage } from '@/features/public/pages/yachts/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yachts/')({
  component: YachtsIndexPage,
})
