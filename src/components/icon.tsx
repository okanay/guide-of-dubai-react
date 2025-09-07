import React from 'react'
import { twMerge } from 'tailwind-merge'

const modules = import.meta.glob('@/assets/icons/**/*.svg', {
  eager: true,
  query: '?react',
})

const icons: Record<string, React.ComponentType<any>> = {}
for (const path in modules) {
  const name = path.replace('/src/assets/icons/', '').replace('.svg', '')
  const mod = modules[path] as { default: React.ComponentType<any> }
  if (mod) {
    icons[name] = mod.default
  }
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  className?: string
  defaultClassName?: string
}

const Icon: React.FC<IconProps> = ({
  name,
  className = 'h-6 w-6 shrink-0 inline-block',
  ...props
}) => {
  const SvgIcon = icons[name]

  const mergedClassName = twMerge(className)

  if (!SvgIcon) {
    if (import.meta.env.DEV) {
      console.warn(`[Icon] İkon bulunamadı: ${name}`)
    }
    return <span className={mergedClassName} />
  }

  return <SvgIcon className={mergedClassName} {...props} />
}

export default Icon
