import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/flight/search"!</div>
}
