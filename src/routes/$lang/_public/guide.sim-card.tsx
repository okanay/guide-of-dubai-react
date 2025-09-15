import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/sim-card')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/sim-card"!</div>
}
