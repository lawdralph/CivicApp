import { useState } from 'react'

function LocationPicker({ onLocationSelect, error }) {
  const [status, setStatus] = useState('idle')
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState('')
  const [address, setAddress] = useState('')

  const resetLocation = () => {
    setLocation(null)
    if (onLocationSelect) onLocationSelect(null)
  }

  const setCapturedLocation = (nextLocation, nextMessage) => {
    setLocation(nextLocation)
    setStatus('captured')
    setMessage(nextMessage)
    if (onLocationSelect) onLocationSelect(nextLocation)
  }

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setStatus('unavailable')
      setMessage('Geolocation is not supported in this browser.')
      resetLocation()
      return
    }

    setStatus('requesting')
    setMessage('Requesting your location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const nextLocation = { lat, lng }
        setCapturedLocation(nextLocation, 'Current location captured successfully.')
      },
      (geoError) => {
        const code = geoError?.code
        setStatus(code === 1 ? 'denied' : code === 2 ? 'unavailable' : 'timeout')

        if (code === 1) {
          setMessage('Location permission denied. Please use the address field or allow access in your browser and try again.')
        } else if (code === 2) {
          setMessage('Location is currently unavailable. Check your signal or enter a nearby address.')
        } else if (code === 3) {
          setMessage('Location request timed out. Please try again or use a nearby address.')
        } else {
          setMessage('Unable to detect your location. Please enter a nearby address instead.')
        }

        resetLocation()
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    )
  }

  const geocodeAddress = async () => {
    const trimmedAddress = address.trim()
    if (!trimmedAddress) {
      setStatus('idle')
      setMessage('Please enter a street address or landmark to continue.')
      resetLocation()
      return
    }

    setStatus('requesting')
    setMessage('Finding the coordinates for that location...')

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(trimmedAddress)}`)
      const results = await response.json()
      const match = Array.isArray(results) ? results[0] : null

      if (!match || !match.lat || !match.lon) {
        setStatus('not_found')
        setMessage('We could not find coordinates for that address. Please try a nearby landmark or use your current location.')
        resetLocation()
        return
      }

      const nextLocation = {
        lat: Number(match.lat),
        lng: Number(match.lon),
      }

      setCapturedLocation(nextLocation, `Location captured for: ${trimmedAddress}`)
    } catch (fetchError) {
      setStatus('unavailable')
      setMessage('We could not validate that address right now. Please try again or use your current location.')
      resetLocation()
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-lg font-semibold text-slate-800">Location</p>
          <p className="mt-1 text-sm text-slate-500">Add a landmark or nearby address, or use your current location.</p>
        </div>
        <button type="button" className="btn-secondary shrink-0 px-3 py-2 text-sm" onClick={captureLocation} disabled={status === 'requesting'}>
          {status === 'requesting' ? 'Detecting...' : 'Use my location'}
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex-1">
          <label htmlFor="location-address" className="label">Street address or landmark</label>
          <input
            id="location-address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="e.g. Opposite City Hall, Main Road"
            className="input"
          />
        </div>
        <button type="button" className="btn-secondary self-end px-3 py-2 text-sm" onClick={geocodeAddress} disabled={status === 'requesting'}>
          Use address
        </button>
      </div>

      <div className="mt-4 min-h-12">
        {status === 'captured' && location ? (
          <div className="space-y-1 text-sm text-slate-700">
            <p className="font-semibold text-emerald-700">✓ Location captured</p>
            <p>Latitude: {location.lat.toFixed(4)}</p>
            <p>Longitude: {location.lng.toFixed(4)}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">{message || 'No current location captured yet.'}</p>
        )}
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export default LocationPicker
