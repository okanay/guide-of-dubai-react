import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights')({
  component: () => <Outlet />,
})
