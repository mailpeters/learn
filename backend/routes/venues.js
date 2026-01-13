const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/venues/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM category ORDER BY name');
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/venues - Get all venues with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [venues] = await db.query(
      'SELECT venue_id, name, address, city, state, zip, phone, website, lat, lon FROM venue WHERE active = 1 LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM venue WHERE active = 1'
    );

    res.json({
      venues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

// GET /api/venues/geocode - Get coordinates for city, state, or ZIP
router.get('/geocode', async (req, res) => {
  try {
    const { city, state, zip } = req.query;

    if (!city && !state && !zip) {
      return res.status(400).json({ error: 'City, state, or ZIP required' });
    }

    let query = 'SELECT AVG(lat) as lat, AVG(lon) as lon FROM venue WHERE active = 1 AND lat IS NOT NULL AND lon IS NOT NULL';
    const params = [];

    if (zip) {
      query += ' AND zip LIKE ?';
      params.push(`${zip}%`);
    } else {
      if (city) {
        query += ' AND city LIKE ?';
        params.push(`%${city}%`);
      }
      if (state) {
        query += ' AND state = ?';
        params.push(state);
      }
    }

    const [[result]] = await db.query(query, params);

    if (!result.lat || !result.lon) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ lat: parseFloat(result.lat), lon: parseFloat(result.lon) });
  } catch (error) {
    console.error('Error geocoding:', error);
    res.status(500).json({ error: 'Failed to geocode location' });
  }
});

// GET /api/venues/nearby - Find venues within radius of coordinates
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius, category } = req.query;

    if (!lat || !lon || !radius) {
      return res.status(400).json({ error: 'lat, lon, and radius required' });
    }

    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const radiusMiles = parseFloat(radius);

    // Haversine formula to calculate distance in miles
    let query = `
      SELECT DISTINCT
        v.venue_id, v.name, v.address, v.city, v.state, v.zip, v.phone, v.website, v.lat, v.lon,
        (3959 * acos(cos(radians(?)) * cos(radians(v.lat)) * cos(radians(v.lon) - radians(?)) + sin(radians(?)) * sin(radians(v.lat)))) AS distance
      FROM venue v
    `;

    const params = [userLat, userLon, userLat];

    // Add category filter if provided
    if (category) {
      query += ` INNER JOIN venue_category vc ON v.venue_id = vc.venue_id`;
    }

    query += `
      WHERE v.active = 1 AND v.lat IS NOT NULL AND v.lon IS NOT NULL
    `;

    if (category) {
      query += ` AND vc.category_id = ?`;
      params.push(category);
    }

    query += `
      HAVING distance <= ?
      ORDER BY distance
      LIMIT 500
    `;

    params.push(radiusMiles);

    const [venues] = await db.query(query, params);

    res.json({ venues, count: venues.length });
  } catch (error) {
    console.error('Error finding nearby venues:', error);
    res.status(500).json({ error: 'Failed to find nearby venues' });
  }
});

// GET /api/venues/search - Search venues by name, city, or state
router.get('/search', async (req, res) => {
  try {
    const { q, city, state } = req.query;

    if (!q && !city && !state) {
      return res.status(400).json({ error: 'Search query required' });
    }

    let query = 'SELECT venue_id, name, address, city, state, zip, phone, website, lat, lon FROM venue WHERE active = 1';
    const params = [];

    if (q) {
      query += ' AND name LIKE ?';
      params.push(`%${q}%`);
    }

    if (city) {
      query += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }

    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }

    query += ' LIMIT 50';

    const [venues] = await db.query(query, params);

    res.json({ venues, count: venues.length });
  } catch (error) {
    console.error('Error searching venues:', error);
    res.status(500).json({ error: 'Failed to search venues' });
  }
});

// GET /api/venues/:id - Get single venue by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [venues] = await db.query(
      'SELECT * FROM venue WHERE venue_id = ? AND active = 1',
      [id]
    );

    if (venues.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.json(venues[0]);
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
});

module.exports = router;
