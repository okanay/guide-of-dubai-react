import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/activities/select/')({
  beforeLoad: async ({ params: { lang } }) => {
    redirect({ to: '/$lang/activities', params: { lang } })
  },
  component: () => null,
})
