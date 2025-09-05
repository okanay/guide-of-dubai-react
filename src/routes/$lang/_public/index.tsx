import { createFileRoute } from '@tanstack/react-router'
import { ExampleForm } from 'src/features/public/components/form-ui/example-form'

export const Route = createFileRoute('/$lang/_public/')({
  component: ExampleForm,
})
