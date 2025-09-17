import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yacht/select/')({
  beforeLoad: async ({ params: { lang } }) => {
    redirect({ to: '/$lang/yacht', params: { lang } })
  },
  component: () => null,
})
