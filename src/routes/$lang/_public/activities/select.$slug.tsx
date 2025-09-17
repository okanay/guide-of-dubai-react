import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/activities/select/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/activities/select/$slug"!</div>
}
