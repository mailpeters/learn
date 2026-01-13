import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function VenueMap({ venues, center, zoom = 10 }) {
  if (!center || !center.lat || !center.lon) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Enter a location to view the map</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {venues.map((venue) => {
          if (!venue.lat || !venue.lon) return null;

          return (
            <Marker key={venue.venue_id} position={[parseFloat(venue.lat), parseFloat(venue.lon)]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-blue-600 mb-1">{venue.name}</h3>
                  <p className="text-sm text-gray-600">{venue.address}</p>
                  <p className="text-sm text-gray-600">
                    {venue.city}, {venue.state} {venue.zip}
                  </p>
                  {venue.phone && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">Phone:</span> {venue.phone}
                    </p>
                  )}
                  {venue.website && (
                    <a
                      href={`https://${venue.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline block mt-1"
                    >
                      Visit Website
                    </a>
                  )}
                  {venue.distance !== undefined && (
                    <p className="text-sm text-gray-500 mt-1">
                      {venue.distance.toFixed(1)} miles away
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default VenueMap;
