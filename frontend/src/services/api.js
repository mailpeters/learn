const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all venues with pagination
export const getVenues = async (page = 1, limit = 20) => {
  const response = await fetch(`${API_BASE_URL}/venues?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }
  return response.json();
};

// Search venues by query, city, or state
export const searchVenues = async (query, city = '', state = '') => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (city) params.append('city', city);
  if (state) params.append('state', state);

  const response = await fetch(`${API_BASE_URL}/venues/search?${params}`);
  if (!response.ok) {
    throw new Error('Failed to search venues');
  }
  return response.json();
};

// Get single venue by ID
export const getVenueById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/venues/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch venue');
  }
  return response.json();
};

// Geocode a location (city, state, or ZIP) to coordinates
export const geocodeLocation = async (city, state, zip) => {
  const params = new URLSearchParams();
  if (city) params.append('city', city);
  if (state) params.append('state', state);
  if (zip) params.append('zip', zip);

  const response = await fetch(`${API_BASE_URL}/venues/geocode?${params}`);
  if (!response.ok) {
    throw new Error('Failed to geocode location');
  }
  return response.json();
};

// Get venues within radius of coordinates
export const getNearbyVenues = async (lat, lon, radius, category = '') => {
  let url = `${API_BASE_URL}/venues/nearby?lat=${lat}&lon=${lon}&radius=${radius}`;
  if (category) {
    url += `&category=${category}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch nearby venues');
  }
  return response.json();
};

// Get all categories
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/venues/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};
