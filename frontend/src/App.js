import { useState, useEffect } from 'react';
import { getVenues, searchVenues, geocodeLocation, getNearbyVenues, getCategories } from './services/api';
import VenueMap from './components/VenueMap';

function App() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Distance search fields
  const [useDistanceSearch, setUseDistanceSearch] = useState(false);
  const [distance, setDistance] = useState('25');
  const [location, setLocation] = useState('');
  const [mapCenter, setMapCenter] = useState(null);

  // Category filter
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch venues and categories on component mount
  useEffect(() => {
    loadVenues();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadVenues = async () => {
    try {
      setLoading(true);
      const data = await getVenues(1, 20);
      setVenues(data.venues);
      setMapCenter(null);
      setError(null);
    } catch (err) {
      setError('Failed to load venues. Make sure the API is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // Distance search
    if (useDistanceSearch) {
      if (!location.trim()) {
        setError('Please enter a city, state, or ZIP code');
        return;
      }

      try {
        setLoading(true);

        // Parse location (supports "City, State", "ZIP", or "City")
        const parts = location.split(',').map(p => p.trim());
        let city = '', state = '', zip = '';

        if (parts.length === 2) {
          city = parts[0];
          state = parts[1];
        } else if (/^\d{5}/.test(parts[0])) {
          zip = parts[0];
        } else {
          city = parts[0];
        }

        // Geocode the location
        const coords = await geocodeLocation(city, state, zip);
        setMapCenter(coords);

        // Find nearby venues
        const data = await getNearbyVenues(coords.lat, coords.lon, distance, selectedCategory);
        setVenues(data.venues);
        setError(null);
      } catch (err) {
        setError('Failed to find location or venues. Try a different location.');
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Regular name search
    if (!searchQuery.trim()) {
      loadVenues();
      return;
    }

    try {
      setLoading(true);
      const data = await searchVenues(searchQuery);
      setVenues(data.venues);
      setMapCenter(null);
      setError(null);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Craft Beverage Finder</h1>
      </header>

      <main className="container mx-auto p-4">
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-4">
          {/* Name search field */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search for venues by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={useDistanceSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Distance search toggle */}
          <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useDistanceSearch}
                onChange={(e) => setUseDistanceSearch(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Search by distance from location</span>
            </label>
          </div>

          {/* Distance search fields */}
          {useDistanceSearch && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (miles)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  min="1"
                  max="500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City, State or ZIP
                </label>
                <input
                  type="text"
                  placeholder="e.g. Raleigh, NC or 27601"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Category filter buttons */}
          {useDistanceSearch && categories.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === ''
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.category_id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.category_id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.category_id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Loading venues...</p>
          </div>
        ) : (
          <>
            {/* Show map when distance search is active and has results */}
            {useDistanceSearch && mapCenter && venues.length > 0 && (
              <div className="mb-4">
                <VenueMap venues={venues} center={mapCenter} />
              </div>
            )}

            {/* Venue list */}
            <div className="grid gap-4">
              {venues.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-600">No venues found.</p>
                </div>
              ) : (
                venues.map((venue) => (
                  <div key={venue.venue_id} className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-blue-600 mb-2">{venue.name}</h2>
                    <p className="text-gray-600 mb-1">{venue.address}</p>
                    <p className="text-gray-600 mb-2">
                      {venue.city}, {venue.state} {venue.zip}
                    </p>
                    {venue.phone && (
                      <p className="text-gray-600 mb-1">
                        <span className="font-semibold">Phone:</span> {venue.phone}
                      </p>
                    )}
                    {venue.website && (
                      <a
                        href={`https://${venue.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Visit Website
                      </a>
                    )}
                    {venue.distance !== undefined && (
                      <p className="text-sm text-gray-500 mt-2">
                        {venue.distance.toFixed(1)} miles away
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
