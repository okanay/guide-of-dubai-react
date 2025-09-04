import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PublicLayout } from 'src/features/public/layout'

export const Route = createFileRoute('/$lang/_public')({
  loader: async (context) => {
    return { href: context.location.href }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  )
}
