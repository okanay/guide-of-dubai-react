import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/rent-a-car/select/')({
  beforeLoad: async ({ params: { lang } }) => {
    redirect({ to: '/$lang/rent-a-car', params: { lang } })
  },
  component: () => null,
})
