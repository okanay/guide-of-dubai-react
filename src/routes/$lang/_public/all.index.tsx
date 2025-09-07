import { ExampleForm } from '@/features/public/components/form-ui/example-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/_public/all/')({
  component: ExampleForm,
})
