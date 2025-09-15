import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/hospitals')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/hospitals"!</div>
}
