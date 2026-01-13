const express = require('express');
const cors = require('cors');
require('dotenv').config();

const venuesRouter = require('./routes/venues');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow React frontend to call this API
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/venues', venuesRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Craft Beverage API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
