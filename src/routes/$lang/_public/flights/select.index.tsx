import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/flights/select/')({
  beforeLoad: async ({ params: { lang } }) => {
    redirect({ to: '/$lang/flights', params: { lang } })
  },
  component: () => null,
})
