import React from 'react'

// Global LocationMap componentini lazy load et
export const LazyLocationMap = React.lazy(() =>
  import('./lazy').then((module) => ({ default: module.default })),
)

// Loading component - harita yüklenirken gösterilecek
export const MapLoadingFallback: React.FC = () => {
  return (
    <div className="flex h-[400px] w-full items-center justify-center border border-surface-container-highest bg-surface-container">
      <div className="flex flex-col items-center justify-center text-on-surface-variant">
        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <span className="text-body-medium font-medium">Loading map...</span>
      </div>
    </div>
  )
}
