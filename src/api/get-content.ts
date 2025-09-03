import { createServerFn } from '@tanstack/react-start'
import { AppFetch } from 'src/api/app-fetch'

type Data = {
  type: ContentType
  slug: string
}

export const GetContent = createServerFn()
  .validator((data: Data) => data)
  .handler(async (ctx) => {
    try {
      const response = await AppFetch(
        `/v1/public/content/get-by-slug/${ctx.data.type}/${ctx.data.slug}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const result = await response.json()

      if (result.error) {
        throw new Error(JSON.stringify(result))
      }

      const content = result.data as ContentPageView
      const isAuthenticated = result.isAuthenticated as boolean
      return {
        success: true,
        content: content,
        isAuthenticated: isAuthenticated,
      }
    } catch (error) {
      throw error
    }
  })
