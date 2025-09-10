import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { ModalWrapper } from '@/components/modal-wrapper'
import Icon from '../icon'
import { useLeafletModalStore } from './store'

// Leaflet'in varsayılan ikon ayarlarını düzeltme (Bu global bir yerde yapılabilir)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

export const LeafletModal = () => {
  const { isOpen, coords, hotelName, closeModal } = useLeafletModalStore()

  // Koordinatlar henüz ayarlanmadıysa, haritanın render edilmesini engelle
  if (!coords) {
    return null
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={closeModal}>
      <div className="relative h-full w-full rounded-md bg-white md:h-[80vh] md:w-[80vw] md:max-w-4xl">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 z-[1000] flex h-8 w-8 items-center justify-center rounded-full bg-black/50 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75"
          aria-label="Haritayı kapat"
        >
          <Icon name="cancel" className="h-4 w-4 text-white" />
        </button>

        <MapContainer
          center={coords}
          zoom={15}
          style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
          key={coords.join(',')}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={coords}>
            <Popup>{hotelName || 'Seçilen Konum'}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </ModalWrapper>
  )
}
