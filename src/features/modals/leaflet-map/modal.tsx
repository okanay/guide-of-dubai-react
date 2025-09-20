import { ModalWrapper } from './wrapper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from '@/components/icon'
import { useLeafletModalStore, type ModalPayload, type Hotel } from './store'
import { useTheme } from '@/providers/theme-mode'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface MapModules {
  L: any
  MapContainer: any
  Marker: any
  TileLayer: any
  useMap: any
  Popup: any
}

interface MapConfig {
  center: [number, number]
  zoom: number
  bounds?: any
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const LeafletModal: React.FC = () => {
  const { isOpen, payload, closeModal } = useLeafletModalStore()
  const [mapModules, setMapModules] = useState<MapModules | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { resolvedTheme } = useTheme()

  // Leaflet modüllerini yükle
  const loadMapModules = useCallback(async () => {
    if (!isOpen || mapModules) return

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
      console.error('Map modules load failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isOpen, mapModules])

  useEffect(() => {
    loadMapModules()
  }, [loadMapModules])

  // Harita konfigürasyonu
  const mapConfig = useMemo((): MapConfig | null => {
    if (!payload || !mapModules?.L) return null
    return calculateMapConfig(payload, mapModules.L)
  }, [payload, mapModules?.L])

  // Tile layer URL'i
  const tileLayerUrl = useMemo(() => {
    const baseUrl = 'https://{s}.basemaps.cartocdn.com'
    return resolvedTheme === 'dark'
      ? `${baseUrl}/dark_all/{z}/{x}/{y}{r}.png`
      : `${baseUrl}/light_all/{z}/{x}/{y}{r}.png`
  }, [resolvedTheme])

  // Early returns
  if (!isOpen || !payload) return null

  if (isLoading || !mapModules || !mapConfig) {
    return (
      <ModalWrapper isOpen={isOpen} onClose={closeModal}>
        <LoadingScreen />
      </ModalWrapper>
    )
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={closeModal}
      containerClassName="fixed inset-0 z-50 flex h-[100dvh] w-screen items-start justify-start p-0 md:items-center md:justify-center"
    >
      <div className="relative h-full w-full max-w-screen bg-white">
        <CloseButton onClose={closeModal} />
        <MapRenderer
          payload={payload}
          mapModules={mapModules}
          mapConfig={mapConfig}
          tileLayerUrl={tileLayerUrl}
          resolvedTheme={resolvedTheme}
        />
      </div>
    </ModalWrapper>
  )
}

// ============================================================================
// SUB COMPONENTS
// ============================================================================

// Loading ekranı
const LoadingScreen: React.FC = () => (
  <div className="relative flex h-full w-full max-w-main items-center justify-center bg-white">
    <div className="flex flex-col items-center justify-center text-gray-600">
      <div className="border-primary mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
      <span>Loading map...</span>
    </div>
  </div>
)

// Kapama butonu
const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <button
    onClick={onClose}
    className="absolute top-3 right-6 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-black/50 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75"
    aria-label="Haritayı kapat"
  >
    <Icon name="cancel" className="h-5 w-5 text-white" />
  </button>
)

// Ana harita renderer
interface MapRendererProps {
  payload: ModalPayload
  mapModules: MapModules
  mapConfig: MapConfig
  tileLayerUrl: string
  resolvedTheme: 'light' | 'dark'
}

const MapRenderer: React.FC<MapRendererProps> = ({
  payload,
  mapModules,
  mapConfig,
  tileLayerUrl,
  resolvedTheme,
}) => {
  const { mode } = payload

  const baseMapProps = {
    center: mapConfig.center,
    zoom: mapConfig.zoom,
    style: { height: '100%', width: '100%', borderRadius: '0.375rem' },
  }

  switch (mode) {
    case 'pin':
      return (
        <PinMode
          payload={payload}
          mapModules={mapModules}
          baseMapProps={baseMapProps}
          tileLayerUrl={tileLayerUrl}
        />
      )

    case 'price':
      return (
        <PriceMode
          payload={payload}
          mapModules={mapModules}
          baseMapProps={baseMapProps}
          mapConfig={mapConfig}
          tileLayerUrl={tileLayerUrl}
          resolvedTheme={resolvedTheme}
        />
      )

    case 'card':
      return (
        <CardMode
          payload={payload}
          mapModules={mapModules}
          baseMapProps={baseMapProps}
          mapConfig={mapConfig}
          tileLayerUrl={tileLayerUrl}
          resolvedTheme={resolvedTheme}
        />
      )

    default:
      return null
  }
}

// ============================================================================
// MODE COMPONENTS
// ============================================================================

// PIN MODE
interface PinModeProps {
  payload: Extract<ModalPayload, { mode: 'pin' }>
  mapModules: MapModules
  baseMapProps: any
  tileLayerUrl: string
}

const PinMode: React.FC<PinModeProps> = ({ payload, mapModules, baseMapProps, tileLayerUrl }) => (
  <div className="h-full w-full">
    <mapModules.MapContainer {...baseMapProps}>
      <mapModules.TileLayer
        attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
        url={tileLayerUrl}
      />
      <mapModules.Marker position={payload.data.coords} icon={createDefaultIcon(mapModules.L)}>
        <mapModules.Popup>{payload.data.name || 'Seçilen Konum'}</mapModules.Popup>
      </mapModules.Marker>
    </mapModules.MapContainer>
  </div>
)

// PRICE MODE
interface PriceModeProps {
  payload: Extract<ModalPayload, { mode: 'price' }>
  mapModules: MapModules
  baseMapProps: any
  mapConfig: MapConfig
  tileLayerUrl: string
  resolvedTheme: 'light' | 'dark'
}

const PriceMode: React.FC<PriceModeProps> = ({
  payload,
  mapModules,
  baseMapProps,
  mapConfig,
  tileLayerUrl,
  resolvedTheme,
}) => (
  <div className="h-full w-full">
    <mapModules.MapContainer {...baseMapProps}>
      <mapModules.TileLayer
        attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
        url={tileLayerUrl}
      />
      {payload.data.map((hotel, index) => (
        <MapMarker
          key={`price-${hotel.name}-${index}`}
          hotel={hotel}
          index={index}
          isSelected={false}
          mode="price"
          onSelect={() => {}}
          mapModules={mapModules}
          resolvedTheme={resolvedTheme}
        />
      ))}
      {mapConfig.bounds && <MapBoundsFitter bounds={mapConfig.bounds} mapModules={mapModules} />}
    </mapModules.MapContainer>
  </div>
)

// CARD MODE
interface CardModeProps {
  payload: Extract<ModalPayload, { mode: 'card' }>
  mapModules: MapModules
  baseMapProps: any
  mapConfig: MapConfig
  tileLayerUrl: string
  resolvedTheme: 'light' | 'dark'
}

const CardMode: React.FC<CardModeProps> = ({
  payload,
  mapModules,
  baseMapProps,
  mapConfig,
  tileLayerUrl,
  resolvedTheme,
}) => {
  const { selectedHotelIndex, selectHotel, clearSelection } = useLeafletModalStore()
  const [mapKey, setMapKey] = useState(0)

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

  const dynamicMapProps = {
    ...baseMapProps,
    key: mapKey,
    center:
      selectedHotelIndex !== null ? payload.data[selectedHotelIndex].coords : mapConfig.center,
    zoom: selectedHotelIndex !== null ? 16 : mapConfig.zoom,
    className: '',
  }

  return (
    <div className="flex h-full flex-col overflow-hidden md:flex-row">
      <HotelList
        hotels={payload.data}
        selectedIndex={selectedHotelIndex}
        onSelectHotel={handleHotelSelect}
      />

      <div className="relative flex-1">
        <mapModules.MapContainer {...dynamicMapProps}>
          <mapModules.TileLayer
            attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
            url={tileLayerUrl}
          />

          {payload.data.map((hotel, index) => (
            <MapMarker
              key={`marker-${hotel.name}-${index}`}
              hotel={hotel}
              index={index}
              isSelected={selectedHotelIndex === index}
              mode="card"
              onSelect={handleHotelSelect}
              mapModules={mapModules}
              resolvedTheme={resolvedTheme}
            />
          ))}

          {!selectedHotelIndex && mapConfig.bounds && (
            <MapBoundsFitter bounds={mapConfig.bounds} mapModules={mapModules} />
          )}
        </mapModules.MapContainer>
      </div>
    </div>
  )
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

// Hotel listesi
interface HotelListProps {
  hotels: Hotel[]
  selectedIndex: number | null
  onSelectHotel: (index: number) => void
}

const HotelList: React.FC<HotelListProps> = ({ hotels, selectedIndex, onSelectHotel }) => (
  <div className="absolute right-0 bottom-0 left-0 z-[500] bg-gradient-to-t from-black/20 to-transparent p-4 md:static md:z-auto md:flex md:w-1/3 md:min-w-80 md:flex-col md:overflow-hidden md:border-r md:border-gray-200 md:bg-gray-50 md:from-transparent md:to-transparent md:p-0">
    {/* Header */}
    <div className="hidden md:block md:border-b md:border-gray-200 md:bg-white md:p-4">
      <h2 className="text-lg font-semibold text-gray-900">Oteller ({hotels.length})</h2>
      <p className="mt-1 text-sm text-gray-700">Haritadan bir oteli seçin veya listeden tıklayın</p>
    </div>

    {/* Hotel cards container */}
    <div className="relative md:flex-1 md:overflow-y-auto md:p-4">
      {/* Mobile scroll indicator */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white md:hidden">
        ← Kaydır →
      </div>

      {/* Hotel cards */}
      <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:snap-none md:flex-col md:gap-0 md:space-y-4 md:overflow-x-visible md:overflow-y-auto md:pb-0">
        {hotels.map((hotel, index) => (
          <div key={`${hotel.name}-${index}`} className="snap-center md:snap-none">
            <HotelCard
              hotel={hotel}
              isSelected={selectedIndex === index}
              onClick={() => onSelectHotel(index)}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Hotel kartı
interface HotelCardProps {
  hotel: Hotel
  isSelected: boolean
  onClick: () => void
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, isSelected, onClick }) => {
  const borderClass = isSelected ? 'border-primary-500' : 'border-gray-200'

  return (
    <div
      className={`cursor-pointer border-2 bg-white shadow-md transition-all duration-200 hover:shadow-lg ${borderClass} flex h-24 w-72 flex-shrink-0 md:block md:h-auto md:w-full`}
      onClick={onClick}
    >
      {/* Hotel image */}
      {hotel.image && (
        <div className="relative h-full w-24 overflow-hidden md:h-48 md:w-full">
          <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
          {hotel.rating && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-xs font-medium md:top-2 md:right-2 md:gap-1 md:px-2 md:py-1 md:text-sm">
              <Icon name="star" className="h-2.5 w-2.5 text-badge-yellow md:h-3 md:w-3" />
              {hotel.rating}
            </div>
          )}
        </div>
      )}

      {/* Hotel content */}
      <div className="flex flex-1 flex-col justify-between p-2 md:px-3 md:py-4">
        <HotelCardContent hotel={hotel} />
      </div>
    </div>
  )
}

// Hotel kart içeriği
const HotelCardContent: React.FC<{ hotel: Hotel }> = ({ hotel }) => (
  <>
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
          {hotel.amenities.slice(0, 4).map((amenity, idx) => (
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
  </>
)

// Harita marker'ı
interface MapMarkerProps {
  hotel: any
  index: number
  isSelected: boolean
  mode: 'pin' | 'price' | 'card'
  onSelect: (index: number) => void
  mapModules: MapModules
  resolvedTheme: 'light' | 'dark'
}

const MapMarker: React.FC<MapMarkerProps> = ({
  hotel,
  index,
  isSelected,
  mode,
  onSelect,
  mapModules,
  resolvedTheme,
}) => {
  const icon = useMemo(() => {
    if (!mapModules.L) return null
    if (mode === 'pin') return createDefaultIcon(mapModules.L)
    return createPriceIcon(mapModules.L, hotel.price, hotel.currency, isSelected, resolvedTheme)
  }, [mode, hotel.price, hotel.currency, isSelected, mapModules.L, resolvedTheme])

  if (!mapModules.Marker || !icon) return null

  return (
    <mapModules.Marker
      position={hotel.coords}
      icon={icon}
      eventHandlers={{ click: () => onSelect(index) }}
    ></mapModules.Marker>
  )
}

// Harita sınırları ayarlayıcı
const MapBoundsFitter: React.FC<{ bounds: any; mapModules: MapModules }> = ({
  bounds,
  mapModules,
}) => {
  const map = mapModules.useMap()

  useEffect(() => {
    if (bounds && map) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [bounds, map])

  return null
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const createPriceIcon = (
  L: any,
  price: number,
  currency: string,
  isSelected: boolean = false,
  theme: 'light' | 'dark' = 'light',
) => {
  const baseClasses = isSelected
    ? 'bg-primary-500 text-white border-2 border-primary-600 animate-pulse'
    : theme === 'dark'
      ? 'bg-gray-800 text-white border border-gray-600'
      : 'bg-box-surface text-on-box-black border border-gray-300'

  return L.divIcon({
    className: isSelected ? 'custom-selected-icon' : 'custom-price-icon',
    html: `
      <div class="${baseClasses} font-bold text-body-xs px-2 py-1 shadow-lg whitespace-nowrap text-center">
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

const calculateMapConfig = (payload: ModalPayload, L: any): MapConfig => {
  if (payload.mode === 'pin') {
    return {
      center: payload.data.coords,
      zoom: 15,
    }
  }

  if ((payload.mode === 'price' || payload.mode === 'card') && payload.data.length > 0) {
    const coords = payload.data.map((item) => item.coords)
    const bounds = L.latLngBounds(coords)
    const centerLatLng = bounds.getCenter()

    return {
      center: [centerLatLng.lat, centerLatLng.lng],
      zoom: 13,
      bounds,
    }
  }

  return {
    center: [0, 0],
    zoom: 2,
  }
}
