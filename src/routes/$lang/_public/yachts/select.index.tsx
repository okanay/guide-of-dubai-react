import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/yachts/select/')({
  beforeLoad: async ({ params: { lang } }) => {
    redirect({ to: '/$lang/yachts', params: { lang } })
  },
  component: () => null,
})
