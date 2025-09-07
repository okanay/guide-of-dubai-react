import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/tickets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/tickets/"!</div>
}
