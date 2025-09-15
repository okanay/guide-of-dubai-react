import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/visa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/visa"!</div>
}
