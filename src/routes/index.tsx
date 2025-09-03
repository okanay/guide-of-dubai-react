import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async () => {
    throw redirect({ to: '/$lang', params: { lang: 'en' } })
  },
  component: () => <></>,
})
