// InlineMap.tsx - Simple props-based map component
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/providers/theme-mode'
import Icon from '@/components/icon'
import { useSystemSettings } from '../system-settings/store'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export type PinMapProps = {
  mode: 'pin'
  data: {
    coords: [number, number]
    name?: string
  }
  zoom?: number
  height?: string
  className?: string
  scrollWheelZoom?: boolean
}

export type PriceMapProps = {
  mode: 'price'
  data: {
    coords: [number, number]
    price: number
  }[]
  zoom?: number
  height?: string
  className?: string
  scrollWheelZoom?: boolean
  interactive?: boolean
}

export type InlineMapProps = PinMapProps | PriceMapProps

interface MapModules {
  L: any
  MapContainer: any
  Marker: any
  TileLayer: any
  useMap: any
  Popup: any
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const InlineMap: React.FC<InlineMapProps> = (props) => {
  const {
    mode,
    data,
    zoom: defaultZoom = 15,
    height = '400px',
    className = '',
    scrollWheelZoom = true,
  } = props
  const { currency } = useSystemSettings()
  const [mapModules, setMapModules] = useState<MapModules | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()

  // Leaflet modüllerini yükle
  const loadMapModules = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [leafletModule, reactLeafletModule] = await Promise.all([
        import('leaflet'),
        import('react-leaflet'),
      ])

      setMapModules({
        L: leafletModule.default,
        MapContainer: reactLeafletModule.MapContainer,
        Marker: reactLeafletModule.Marker,
        TileLayer: reactLeafletModule.TileLayer,
        useMap: reactLeafletModule.useMap,
        Popup: reactLeafletModule.Popup,
      })
    } catch (err) {
      console.error('Map modules load failed:', err)
      setError('Failed to load map')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMapModules()
  }, [loadMapModules])

  // Tema için tile layer URL'i
  const tileLayerUrl = useMemo(() => {
    const baseUrl = 'https://{s}.basemaps.cartocdn.com'
    return resolvedTheme === 'dark'
      ? `${baseUrl}/dark_all/{z}/{x}/{y}{r}.png`
      : `${baseUrl}/light_all/{z}/{x}/{y}{r}.png`
  }, [resolvedTheme])

  // Harita merkezi ve zoom hesaplama
  const mapConfig = useMemo(() => {
    if (mode === 'pin') {
      return {
        center: data.coords,
        zoom: defaultZoom,
      }
    }

    if (mode === 'price' && data.length > 0) {
      if (data.length === 1) {
        return {
          center: data[0].coords,
          zoom: defaultZoom,
        }
      }

      // Multiple markers - calculate bounds
      if (mapModules?.L) {
        const coords = data.map((item) => item.coords)
        const bounds = mapModules.L.latLngBounds(coords)
        const center = bounds.getCenter()
        return {
          center: [center.lat, center.lng] as [number, number],
          zoom: 13,
          bounds,
        }
      }
    }

    return {
      center: [0, 0] as [number, number],
      zoom: 2,
    }
  }, [mode, data, defaultZoom, mapModules?.L])

  // Loading state
  if (isLoading) {
    return (
      <div
        className={twMerge(
          'relative flex w-full items-center justify-center overflow-hidden border border-gray-200 bg-gray-50',
          className,
        )}
        style={{ height }}
      >
        <div className="flex flex-col items-center justify-center text-gray-600">
          <div className="border-primary mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <span className="text-sm font-medium">Loading map...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !mapModules) {
    return (
      <div
        className={twMerge(
          'relative flex w-full items-center justify-center overflow-hidden border border-gray-200 bg-gray-50',
          className,
        )}
        style={{ height }}
      >
        <div className="flex flex-col items-center justify-center text-red-500">
          <Icon name="alert-triangle" className="mb-2 h-8 w-8" />
          <span className="text-sm font-medium">Failed to load map</span>
        </div>
      </div>
    )
  }

  const { MapContainer, Marker, TileLayer } = mapModules

  return (
    <div
      className={twMerge('relative w-full overflow-hidden border border-gray-200', className)}
      style={{ height }}
    >
      <MapContainer
        center={mapConfig.center}
        zoom={mapConfig.zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
          url={tileLayerUrl}
        />

        {/* PIN MODE */}
        {mode === 'pin' && (
          <Marker position={data.coords} icon={createDefaultIcon(mapModules.L)}>
            {data.name && <mapModules.Popup>{data.name}</mapModules.Popup>}
          </Marker>
        )}

        {/* PRICE MODE */}
        {mode === 'price' &&
          data.map((item, index) => (
            <Marker
              key={`marker-${index}`}
              position={item.coords}
              icon={createPriceIcon(mapModules.L, item.price, currency.symbol, resolvedTheme)}
            ></Marker>
          ))}

        {/* Auto fit bounds for multiple price markers */}
        {mode === 'price' && data.length > 1 && mapConfig.bounds && (
          <MapBoundsFitter bounds={mapConfig.bounds} mapModules={mapModules} />
        )}
      </MapContainer>
    </div>
  )
}

// ============================================================================
// UTILITY COMPONENTS & FUNCTIONS
// ============================================================================

// Auto bounds fitter
const MapBoundsFitter: React.FC<{ bounds: any; mapModules: MapModules }> = ({
  bounds,
  mapModules,
}) => {
  const map = mapModules.useMap()

  useEffect(() => {
    if (bounds && map) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [bounds, map])

  return null
}

// Default pin icon
const createDefaultIcon = (L: any) => {
  const mapPinSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        fill="rgb(215, 25, 35)"
        stroke="rgb(215, 25, 35)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="4"
        fill="#fff"
        stroke="rgb(215, 25, 35)"
        stroke-width="2"
      />
    </svg>
  `

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(mapPinSvg),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

// Price marker icon
const createPriceIcon = (
  L: any,
  price: number,
  currency: string,
  theme: 'light' | 'dark' = 'light',
) => {
  const baseClasses =
    theme === 'dark'
      ? 'bg-gray-800 text-white border border-gray-600'
      : 'bg-white text-gray-900 border border-gray-300'

  return L.divIcon({
    className: 'custom-price-icon',
    html: `
      <div class="${baseClasses} font-bold text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap text-center">
        ${currency}${price}
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 30],
  })
}

export default InlineMap
