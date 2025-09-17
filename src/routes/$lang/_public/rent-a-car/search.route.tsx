import {
  PendingIndicator,
  PendingShortComponent,
} from '@/features/public/layout/pending/pending-loading'
import { createFileRoute, Outlet, useMatch } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

type Data = {
  dateStart: string
  dateEnd: string
  timeEnd: string
  timeStart: string
}

type ServerFetchResult = {
  success: boolean
  text: string
}

export const ExampleServerFetch = createServerFn()
  .validator((data: Data) => data)
  .handler(async (ctx): Promise<ServerFetchResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const text = `Booking Details: ${ctx.data.dateStart} - ${ctx.data.dateEnd} from ${ctx.data.timeStart} to ${ctx.data.timeEnd}`

    return {
      success: true,
      text,
    }
  })

export const Route = createFileRoute('/$lang/_public/rent-a-car/search')({
  loader: async (ctx) => {
    const { dateStart, dateEnd, timeEnd, timeStart } = (await ctx.parentMatchPromise).search

    const result = await ExampleServerFetch({
      data: {
        dateStart: dateStart ? dateStart : '',
        dateEnd: dateEnd ? dateEnd : '',
        timeStart: timeStart ? timeStart : '',
        timeEnd: timeEnd ? timeEnd : '',
      },
    })

    return result
  },
  component: Layout,
  pendingComponent: PendingShortComponent,
})

function Layout() {
  const match = useMatch({ from: Route.id })
  const isReloading = match.isFetching

  return (
    <>
      <Outlet />
      {isReloading && <PendingIndicator />}
    </>
  )
}
