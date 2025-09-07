import { TransferIndexPage } from '@/features/public/pages/transfer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/transfer/')({
  component: TransferIndexPage,
})
