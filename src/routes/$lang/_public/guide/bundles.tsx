import { BundlesIndexPage } from '@/features/public/pages/guide/bundles/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/bundles')({
  component: BundlesIndexPage,
})
