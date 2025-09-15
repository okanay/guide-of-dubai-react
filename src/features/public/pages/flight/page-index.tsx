import { FAQFlights } from './section-faq'
import { RecommendedFlights } from './section-recommended'

export const FlightsIndexPage = () => {
  return (
    <article className="flex flex-col">
      <RecommendedFlights />
      <FAQFlights />
    </article>
  )
}
