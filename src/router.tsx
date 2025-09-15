import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { CustomNotFoundPage } from './routes/$lang/not-found'
import { CustomErrorPage } from './routes/$lang/error'
import { CustomPendingPage } from './routes/$lang/pending'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    basepath: '/',
    scrollRestoration: true,
    scrollRestorationBehavior: 'instant',
    defaultNotFoundComponent: CustomNotFoundPage,
    defaultErrorComponent: CustomErrorPage,
    defaultPendingComponent: CustomPendingPage,
    defaultPendingMinMs: 250,
    defaultPendingMs: 250,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
