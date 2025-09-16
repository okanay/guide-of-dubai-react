import { GuideIndexPage } from '@/features/public/pages/guide/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/')({
  component: GuideIndexPage,
})
