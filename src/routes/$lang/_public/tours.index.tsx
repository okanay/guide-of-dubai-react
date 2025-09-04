import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/tours/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/tours/"!</div>
}
