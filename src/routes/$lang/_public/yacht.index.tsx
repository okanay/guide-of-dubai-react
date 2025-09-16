import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yacht/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/yatch/"!</div>
}
