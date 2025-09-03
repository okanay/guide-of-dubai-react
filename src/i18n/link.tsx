import { Link as RouterLink, type LinkProps } from '@tanstack/react-router'

interface Props
  extends Omit<React.ComponentPropsWithoutRef<'a'>, 'children' | 'target'>,
    Omit<LinkProps, 'children' | 'target'> {
  target?: React.ComponentPropsWithoutRef<'a'>['target']
  children?: React.ReactNode
}

export const Link: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <RouterLink {...rest} resetScroll={true} preload={'intent'} preloadDelay={500}>
      {children}
    </RouterLink>
  )
}

Link.displayName = 'i18n-Link'
