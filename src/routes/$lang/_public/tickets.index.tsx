import { TicketIndexPage } from '@/features/public/pages/ticket'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/tickets/')({
  component: TicketIndexPage,
})
