import { ModalWrapper } from '@/components/modal-wrapper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from '@/components/icon'
import { useLeafletModalStore } from './store'

// ============= TYPES =============
interface Hotel {
  name: string
  coords: [number, number]
  price: number
  currency: string
  rating?: number
  address?: string
  description?: string
  image?: string
  amenities?: string[]
}

interface MapBoundsFitterProps {
  bounds: any // L.LatLngBoundsExpression yerine any
  mapModules: any
}

interface HotelCardProps {
  hotel: Hotel
  index: number
  isSelected: boolean
  onClick: () => void
}

interface MapMarkerProps {
  hotel: Hotel
  index: number
  isSelected: boolean
  mode: 'pin' | 'price' | 'card'
  onSelect: (index: number) => void
  mapModules: any
}

interface HotelListProps {
  hotels: Hotel[]
  selectedIndex: number | null
  onSelectHotel: (index: number) => void
}

// ============= UTILS & HELPERS =============
const createPriceIcon = (L: any, price: number, currency: string, isSelected: boolean = false) => {
  const baseClasses = isSelected
    ? 'bg-primary-500 text-white border-2 border-primary-600 animate-pulse'
    : 'bg-box-surface text-on-box-black border border-gray-300'

  return L.divIcon({
    className: isSelected ? 'custom-selected-icon' : 'custom-price-icon',
    html: `
      <div class="${baseClasses} font-bold text-body-xs px-2 py-1 rounded-xs shadow-lg whitespace-nowrap text-center">
        ${currency}${price}
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 30],
  })
}

const createDefaultIcon = (L: any) => {
  return new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

const calculateMapBounds = (
  data: any,
  mode: string,
  L: any,
): { center?: [number, number]; bounds?: any } => {
  if (mode === 'pin') {
    return { center: data.coords }
  }

  if ((mode === 'price' || mode === 'card') && data.length > 0) {
    const coords = data.map((d: Hotel) => d.coords)
    const bounds = L.latLngBounds(coords)
    const centerLatLng = bounds.getCenter()
    return {
      bounds,
      center: [centerLatLng.lat, centerLatLng.lng],
    }
  }

  return {}
}

// ============= SUB COMPONENTS =============
const MapBoundsFitter: React.FC<MapBoundsFitterProps> = ({ bounds, mapModules }) => {
  const map = mapModules.useMap()

  useEffect(() => {
    if (bounds && map) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [bounds, map])

  return null
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, isSelected, onClick }) => {
  return (
    <div
      className={`cursor-pointer rounded-xs border-2 bg-white shadow-md transition-all duration-200 hover:shadow-lg ${isSelected ? 'border-primary-500' : 'border-gray-200'} flex h-24 w-72 flex-shrink-0 md:block md:h-auto md:w-full`}
      onClick={onClick}
    >
      {/* Image kısmı */}
      {hotel.image && (
        <div className="relative h-full w-24 overflow-hidden rounded-l-xs md:h-48 md:w-full md:rounded-t-xs md:rounded-l-none">
          <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
          {hotel.rating && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-xs font-medium md:top-2 md:right-2 md:gap-1 md:px-2 md:py-1 md:text-sm">
              <Icon name="star" className="h-2.5 w-2.5 text-badge-yellow md:h-3 md:w-3" />
              {hotel.rating}
            </div>
          )}
        </div>
      )}

      {/* İçerik kısmı */}
      <div className="flex flex-1 flex-col justify-between p-2 md:px-3 md:py-4">
        {/* Mobile layout */}
        <div className="md:hidden">
          <div>
            <h4 className="line-clamp-1 text-sm font-semibold text-gray-900">{hotel.name}</h4>
            {hotel.address && (
              <p className="mt-0.5 line-clamp-1 text-xs text-gray-600">{hotel.address}</p>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-lg font-bold text-primary-600">
                {hotel.currency}
                {hotel.price}
              </span>
              <span className="ml-1 text-xs text-gray-500">/ gece</span>
            </div>
            {hotel.amenities && hotel.amenities.length > 0 && (
              <span className="text-xs text-gray-500">{hotel.amenities.length} özellik</span>
            )}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          <div className="flex items-start justify-between gap-3">
            <h3 className="leading-tight font-semibold text-gray-900">{hotel.name}</h3>
            <div className="flex flex-col items-end">
              <span className="text-size-xl font-bold text-primary-600">
                {hotel.currency}
                {hotel.price}
              </span>
              <span className="text-xs text-gray-500">gecelik</span>
            </div>
          </div>

          {hotel.address && (
            <div className="mt-2 flex items-start gap-2 text-sm text-gray-700">
              <Icon name="location-pin" className="mt-0.5 h-4 w-4 shrink-0 text-btn-primary" />
              <span className="leading-relaxed">{hotel.address}</span>
            </div>
          )}

          {hotel.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-700">
              {hotel.description}
            </p>
          )}

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 4).map((amenity: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                  +{hotel.amenities.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MapMarker: React.FC<MapMarkerProps> = ({
  hotel,
  index,
  isSelected,
  mode,
  onSelect,
  mapModules,
}) => {
  const icon = useMemo(() => {
    if (!mapModules.L) return null

    if (mode === 'pin') return createDefaultIcon(mapModules.L)
    return createPriceIcon(mapModules.L, hotel.price, hotel.currency, isSelected)
  }, [mode, hotel.price, hotel.currency, isSelected, mapModules.L])

  if (!mapModules.Marker || !icon) return null

  return (
    <mapModules.Marker
      position={hotel.coords}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(index),
      }}
    >
      <mapModules.Popup>
        <div className="min-w-48 p-2">
          <h3 className="mb-2 font-semibold text-gray-900">{hotel.name}</h3>
          <div className="mb-2 flex items-start justify-between">
            <span className="text-size-2xl font-bold text-primary-600">
              {hotel.currency}
              {hotel.price}
            </span>
            {hotel.rating && (
              <div className="flex items-center gap-1">
                <Icon name="star" className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">{hotel.rating}</span>
              </div>
            )}
          </div>
          {hotel.address && <p className="mb-2 text-sm text-gray-700">{hotel.address}</p>}
          {hotel.description && <p className="text-sm text-gray-700">{hotel.description}</p>}
        </div>
      </mapModules.Popup>
    </mapModules.Marker>
  )
}

const HotelList: React.FC<HotelListProps> = ({ hotels, selectedIndex, onSelectHotel }) => {
  return (
    <div className="absolute right-0 bottom-0 left-0 z-[500] bg-gradient-to-t from-black/20 to-transparent p-4 md:static md:z-auto md:flex md:w-1/3 md:min-w-80 md:flex-col md:overflow-hidden md:border-r md:border-gray-200 md:bg-gray-50 md:from-transparent md:to-transparent md:p-0">
      {/* Başlık - Sadece desktop'ta görünür */}
      <div className="hidden md:block md:border-b md:border-gray-200 md:bg-white md:p-4">
        <h2 className="text-lg font-semibold text-gray-900">Oteller ({hotels.length})</h2>
        <p className="mt-1 text-sm text-gray-700">
          Haritadan bir oteli seçin veya listeden tıklayın
        </p>
      </div>

      {/* Otel listesi container */}
      <div
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
        }}
        className="relative md:flex-1 md:overflow-y-auto md:p-4"
      >
        {/* Mobile: Kaydırma göstergesi */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white md:hidden">
          ← Kaydır →
        </div>

        {/* Otel kartları wrapper */}
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:snap-none md:flex-col md:gap-0 md:space-y-4 md:overflow-x-visible md:overflow-y-auto md:pb-0"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
          }}
        >
          {hotels.map((hotel, index) => (
            <div key={`${hotel.name}-${index}`} className="snap-center md:snap-none">
              <HotelCard
                hotel={hotel}
                index={index}
                isSelected={selectedIndex === index}
                onClick={() => onSelectHotel(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const LeafletModal: React.FC = () => {
  const { isOpen, payload, closeModal, selectedHotelIndex, selectHotel, clearSelection } =
    useLeafletModalStore()
  const [mapKey, setMapKey] = useState(0)
  const [mapModules, setMapModules] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Leaflet modüllerini dinamik olarak yükle
  useEffect(() => {
    if (isOpen && !mapModules) {
      const loadMapModules = async () => {
        try {
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
        } catch (error) {
          console.error('Failed to load map modules:', error)
        } finally {
          setIsLoading(false)
        }
      }

      loadMapModules()
    }
  }, [isOpen, mapModules])

  // Harita merkezi ve sınırları hesaplama
  const { center, bounds } = useMemo(() => {
    if (!payload || !mapModules?.L) return {}
    return calculateMapBounds(payload.data, payload.mode, mapModules.L)
  }, [payload, mapModules?.L])

  // Otel seçim handler
  const handleHotelSelect = useCallback(
    (index: number) => {
      if (selectedHotelIndex === index) {
        clearSelection()
      } else {
        selectHotel(index)
        setMapKey((prev) => prev + 1)
      }
    },
    [selectedHotelIndex, selectHotel, clearSelection],
  )

  if (!isOpen || !payload) {
    return null
  }

  if (isLoading || !mapModules || !center) {
    return (
      <ModalWrapper isOpen={isOpen} onClose={closeModal}>
        <div className="relative flex h-full w-full max-w-main items-center justify-center rounded-xs bg-white">
          <div className="flex flex-col items-center justify-center text-gray-600">
            <div className="border-primary mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span>Loading map...</span>
          </div>
        </div>
      </ModalWrapper>
    )
  }

  const { mode, data } = payload

  return (
    <ModalWrapper isOpen={isOpen} onClose={closeModal}>
      <div className={`relative h-full w-full max-w-main rounded-xs bg-white`}>
        {/* Kapatma butonu */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-black/50 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75"
          aria-label="Haritayı kapat"
        >
          <Icon name="cancel" className="h-5 w-5 text-white" />
        </button>

        {/* PIN MODE */}
        {mode === 'pin' && (
          <div className="h-full w-full">
            <mapModules.MapContainer
              center={center}
              zoom={15}
              style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
            >
              <mapModules.TileLayer
                attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <mapModules.Marker position={data.coords} icon={createDefaultIcon(mapModules.L)}>
                <mapModules.Popup>{data.name || 'Seçilen Konum'}</mapModules.Popup>
              </mapModules.Marker>
            </mapModules.MapContainer>
          </div>
        )}

        {/* PRICE MODE */}
        {mode === 'price' && (
          <div className="h-full w-full">
            <mapModules.MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
            >
              <mapModules.TileLayer
                attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {data.map((hotel: Hotel, index: number) => (
                <MapMarker
                  key={`price-${hotel.name}-${index}`}
                  hotel={hotel}
                  index={index}
                  isSelected={false}
                  mode={mode}
                  onSelect={() => {}}
                  mapModules={mapModules}
                />
              ))}
              {bounds && <MapBoundsFitter bounds={bounds} mapModules={mapModules} />}
            </mapModules.MapContainer>
          </div>
        )}

        {/* CARD MODE */}
        {mode === 'card' && (
          <div className="flex h-full flex-col overflow-hidden rounded-md md:flex-row">
            <HotelList
              hotels={data}
              selectedIndex={selectedHotelIndex}
              onSelectHotel={handleHotelSelect}
            />

            <div className="relative flex-1">
              <mapModules.MapContainer
                key={mapKey}
                center={selectedHotelIndex !== null ? data[selectedHotelIndex].coords : center}
                zoom={selectedHotelIndex !== null ? 16 : 13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-xs md:rounded-l-none md:rounded-r-xs"
              >
                <mapModules.TileLayer
                  attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {data.map((hotel: Hotel, index: number) => (
                  <MapMarker
                    key={`marker-${hotel.name}-${index}`}
                    hotel={hotel}
                    index={index}
                    isSelected={selectedHotelIndex === index}
                    mode={mode}
                    onSelect={handleHotelSelect}
                    mapModules={mapModules}
                  />
                ))}

                {!selectedHotelIndex && bounds && (
                  <MapBoundsFitter bounds={bounds} mapModules={mapModules} />
                )}
              </mapModules.MapContainer>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  )
}
