import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function LocationMap({ position, title, address }) {
  const safePosition = Array.isArray(position) && position.length === 2
    ? [Number(position[0]), Number(position[1])]
    : [Number(position?.lat ?? 6.5244), Number(position?.lng ?? 3.3792)]

  return (
    <div className="h-52 w-full overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer center={safePosition} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={safePosition} icon={markerIcon}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{title || 'Reported location'}</div>
              {address ? <div className="mt-1 text-slate-600">{address}</div> : null}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default LocationMap
