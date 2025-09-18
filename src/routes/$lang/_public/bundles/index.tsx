import { BundlesIndexPage } from '@/features/public/pages/bundles/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/bundles/')({
  component: BundlesIndexPage,
})
