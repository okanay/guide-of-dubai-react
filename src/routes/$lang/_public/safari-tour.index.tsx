import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/safari-tour/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/safari-tour/"!</div>
}
