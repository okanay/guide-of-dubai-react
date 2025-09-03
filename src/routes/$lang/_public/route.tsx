import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PublicLayout } from 'src/features/public/layout'

export const Route = createFileRoute('/$lang/_public')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  )
}
