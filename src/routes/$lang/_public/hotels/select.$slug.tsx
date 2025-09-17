import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/hotels/select/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/hotels/select/$slug"!</div>
}
