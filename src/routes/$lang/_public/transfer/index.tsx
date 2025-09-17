import { TransferIndexPage } from '@/features/public/pages/transfer/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/transfer/')({
  component: TransferIndexPage,
})
