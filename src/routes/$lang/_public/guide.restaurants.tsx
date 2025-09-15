import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/restaurants')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/sections/restaurants"!</div>
}
