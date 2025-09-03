import { useLocation } from '@tanstack/react-router'

export const ColorThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const dictionary = [{ startWith: '/editor', theme: 'editor' }]

  const { pathname } = useLocation()
  const theme = dictionary.find((item) => pathname.startsWith(item.startWith))?.theme || 'public'

  return (
    <div id="app" data-theme={theme}>
      {children}
    </div>
  )
}
