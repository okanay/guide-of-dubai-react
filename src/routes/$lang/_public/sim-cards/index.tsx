import { SimCardIndexPage } from '@/features/public/pages/sim-cards/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/sim-cards/')({
  component: SimCardIndexPage,
})
