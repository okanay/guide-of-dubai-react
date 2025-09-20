// components/compose-providers.tsx
interface ComponentWithProps {
  component: React.JSXElementConstructor<any>
  props?: Record<string, any>
}

interface Props {
  components: Array<
    React.JSXElementConstructor<React.PropsWithChildren<unknown>> | ComponentWithProps
  >
  children: React.ReactNode
}

export default function ComposeProviders(props: Props) {
  const { components = [], children } = props

  return (
    <>
      {components.reduceRight((acc, CompOrConfig) => {
        // Eğer obje ise component + props
        if (typeof CompOrConfig === 'object' && 'component' in CompOrConfig) {
          const { component: Comp, props: compProps = {} } = CompOrConfig
          return <Comp {...compProps}>{acc}</Comp>
        }

        // Eğer sadece component ise eski davranış
        const Comp = CompOrConfig as React.JSXElementConstructor<React.PropsWithChildren<unknown>>
        return <Comp>{acc}</Comp>
      }, children)}
    </>
  )
}
