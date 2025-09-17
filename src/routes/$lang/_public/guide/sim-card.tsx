import { SimCardIndexPage } from '@/features/public/pages/sim-card/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/sim-card')({
  component: SimCardIndexPage,
})
