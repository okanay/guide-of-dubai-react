import { Route } from 'src/routes/$lang/_public/rent-a-car.search.route'

export const RentACarSearchPage = () => {
  const { text } = Route.useLoaderData()

  return (
    <section className="text-on-box relative min-h-40 bg-box-surface px-4">
      <div className="mx-auto max-w-main">{text}</div>
    </section>
  )
}
