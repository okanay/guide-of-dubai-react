import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yacht')({
  component: () => <Outlet />,
})
