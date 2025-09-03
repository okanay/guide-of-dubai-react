import { createFileRoute } from '@tanstack/react-router'
import { IndexPage } from 'src/features/public/pages/index'

export const Route = createFileRoute('/$lang/_public/')({
  component: IndexPage,
})
