import { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'
import { ColorThemeProvider } from './theme-color'

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ColorThemeProvider>
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
    </ColorThemeProvider>
  )
}
