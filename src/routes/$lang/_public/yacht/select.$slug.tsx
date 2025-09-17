import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yacht/select/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/yacht/select/$slug"!</div>
}
