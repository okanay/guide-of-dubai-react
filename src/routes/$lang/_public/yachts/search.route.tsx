import {
  PendingIndicator,
  PendingShortComponent,
} from '@/features/public/layout/pending/pending-loading'
import { createFileRoute, Outlet, useMatch } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yachts/search')({
  component: Layout,
  pendingComponent: PendingShortComponent,
})

function Layout() {
  const match = useMatch({ from: Route.id })
  const isReloading = match.isFetching

  return (
    <>
      <Outlet />
      {isReloading && <PendingIndicator />}
    </>
  )
}
