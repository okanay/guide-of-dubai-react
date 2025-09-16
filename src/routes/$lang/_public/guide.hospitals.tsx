import { HospitalIndexPage } from '@/features/public/pages/guide/hospital/page-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/guide/hospitals')({
  component: HospitalIndexPage,
})

function RouteComponent() {
  return <div>Hello "/$lang/_public/hospitals"!</div>
}
