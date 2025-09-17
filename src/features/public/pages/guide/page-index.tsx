import { Route } from 'src/routes/$lang/_public'
import { AllCategories } from './section-categories'

export const GuideIndexPage = () => {
  return (
    <>
      <main className="flex flex-col">
        <AllCategories />
      </main>
    </>
  )
}
