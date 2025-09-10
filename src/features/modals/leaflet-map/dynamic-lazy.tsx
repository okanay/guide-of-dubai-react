import React from 'react'
import { twMerge } from 'tailwind-merge'

type LocationMapProps = {
  coordinate: [number, number]
  zoom?: number
  height?: string
  className?: string
}

const LocationMap: React.FC<LocationMapProps> = ({
  coordinate,
  zoom = 15,
  height = '400px',
  className = '',
}) => {
  const [mapModules, setMapModules] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Sadece client-side'da dynamic import yap
    const loadMapModules = async () => {
      try {
        setIsLoading(true)

        // Leaflet ve React-Leaflet'i aynı anda yükle
        const [leafletModule, reactLeafletModule] = await Promise.all([
          import('leaflet'),
          import('react-leaflet'),
        ])

        // Custom marker icon oluştur
        const mapPinSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
              fill="rgb(0,92,184)"
              stroke="rgb(0,92,184)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="12"
              cy="10"
              r="4"
              fill="#fff"
              stroke="rgb(0,92,184)"
              stroke-width="2"
            />
          </svg>
        `

        const customMarkerIcon = new leafletModule.Icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(mapPinSvg),
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        })

        setMapModules({
          L: leafletModule.default,
          MapContainer: reactLeafletModule.MapContainer,
          Marker: reactLeafletModule.Marker,
          TileLayer: reactLeafletModule.TileLayer,
          useMap: reactLeafletModule.useMap,
          customMarkerIcon,
        })
      } catch (err) {
        console.error('Failed to load map modules:', err)
        setError('Failed to load map')
      } finally {
        setIsLoading(false)
      }
    }

    loadMapModules()
  }, [])

  // Map center controller - dinamik olarak oluşturulacak
  const MapCenterController = React.useMemo(() => {
    if (!mapModules) return null

    return ({ coordinate: coords, zoom: z }: { coordinate: [number, number]; zoom: number }) => {
      const map = mapModules.useMap()

      React.useEffect(() => {
        if (map && mapModules.L) {
          map.setView(coords, z)
        }
      }, [coords, z, map])

      return null
    }
  }, [mapModules])

  if (isLoading) {
    return (
      <div
        className={twMerge(
          `border-surface-container-highest elevated-1 relative flex w-full items-center justify-center overflow-hidden border`,
          className,
        )}
        style={{ height }}
      >
        <div className="text-on-surface-variant flex flex-col items-center justify-center">
          <div className="border-primary mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <span className="text-body-medium font-medium">Loading map...</span>
        </div>
      </div>
    )
  }

  if (error || !mapModules) {
    return (
      <div
        className={twMerge(
          `border-surface-container-highest elevated-1 relative flex w-full items-center justify-center overflow-hidden border`,
          className,
        )}
        style={{ height }}
      >
        <div className="flex flex-col items-center justify-center text-red-500">
          <span className="text-body-medium font-medium">Failed to load map</span>
        </div>
      </div>
    )
  }

  const { MapContainer, Marker, TileLayer } = mapModules

  return (
    <div
      className={twMerge(
        `border-surface-container-highest elevated-1 relative w-full overflow-hidden border`,
        className,
      )}
      style={{ height }}
      data-layer="Light"
    >
      <MapContainer
        center={coordinate}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {MapCenterController && <MapCenterController coordinate={coordinate} zoom={zoom} />}
        <Marker position={coordinate} icon={mapModules.customMarkerIcon} />
      </MapContainer>
    </div>
  )
}

export default LocationMap
