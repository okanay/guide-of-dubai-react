import { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={10_000}
        theme="system"
        toastOptions={{
          className: 'items-start',
          classNames: {
            toast: '!items-start',
          },
        }}
      />
      {children}
    </>
  )
}
