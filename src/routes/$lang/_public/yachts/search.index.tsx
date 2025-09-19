import { YachtsSearchPage } from '@/features/public/pages/yachts/page-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yachts/search/')({
  component: YachtsSearchPage,
})
