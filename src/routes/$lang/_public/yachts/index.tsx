import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yachts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/yatch/"!</div>
}
