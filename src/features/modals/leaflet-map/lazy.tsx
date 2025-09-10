import L, { Icon, LatLngExpression } from 'leaflet'
import React from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { twMerge } from 'tailwind-merge'

// Custom MapPin SVG string
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

const customMarkerIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(mapPinSvg),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

type LocationMapProps = {
  coordinate: LatLngExpression
  zoom?: number
  height?: string
  className?: string
}

// Map center controller component
const MapCenterController: React.FC<{ coordinate: LatLngExpression; zoom: number }> = ({
  coordinate,
  zoom,
}) => {
  const map = useMap()

  React.useEffect(() => {
    map.setView(coordinate, zoom)
  }, [coordinate, zoom, map])

  return null
}

const LocationMap: React.FC<LocationMapProps> = ({
  coordinate,
  zoom = 15,
  height = '400px',
  className = '',
}) => {
  return (
    <div
      className={twMerge(
        `relative w-full overflow-hidden border border-surface-container-highest elevated-1`,
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
        <MapCenterController coordinate={coordinate} zoom={zoom} />
        <Marker position={coordinate} icon={customMarkerIcon} />
      </MapContainer>
    </div>
  )
}

export default LocationMap
