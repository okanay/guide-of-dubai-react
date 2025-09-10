import React from 'react'
import { ClientOnly } from '@tanstack/react-router'

// Tamamen dinamik import'lar - hiç top-level import yok
const LazyLocationMap = React.lazy(() =>
  import('./dynamic-lazy').then((module) => ({ default: module.default })),
)

const LazyLeafletModal = React.lazy(() =>
  import('./dynamic-modal').then((module) => ({ default: module.LeafletModal })),
)

// Loading component
export const MapLoadingFallback: React.FC = () => {
  return (
    <div className="border-surface-container-highest bg-surface-container flex h-[400px] w-full items-center justify-center border">
      <div className="text-on-surface-variant flex flex-col items-center justify-center">
        <div className="border-primary mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <span className="text-body-medium font-medium">Loading map...</span>
      </div>
    </div>
  )
}

// SSR-safe LocationMap
export const LocationMap: React.FC<React.ComponentProps<typeof LazyLocationMap>> = (props) => {
  return (
    <ClientOnly fallback={<MapLoadingFallback />}>
      <React.Suspense fallback={<MapLoadingFallback />}>
        <LazyLocationMap {...props} />
      </React.Suspense>
    </ClientOnly>
  )
}

// SSR-safe LeafletModal
export const LeafletModal: React.FC = () => {
  return (
    <ClientOnly fallback={null}>
      <React.Suspense fallback={null}>
        <LazyLeafletModal />
      </React.Suspense>
    </ClientOnly>
  )
}
