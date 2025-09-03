import { createServerFn } from '@tanstack/react-start'
import { AppFetch } from 'src/api/app-fetch'

type Data = {
  slug: string
}

export const ExampleServerFetch = createServerFn()
  .validator((data: Data) => data)
  .handler(async (ctx) => {
    try {
      const response = await AppFetch(`/url/${ctx.data.slug}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      return {
        success: true,
      }
    } catch (error) {
      throw error
    }
  })
