import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/hotels/select/')({
  beforeLoad: async ({ params: { lang } }) => {
    redirect({ to: '/$lang/hotels', params: { lang } })
  },
  component: () => null,
})
