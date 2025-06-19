const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Cornell Fitness AI Backend is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Cornell Fitness AI API' });
});

app.listen(PORT, () => {
  console.log(`🚀 Cornell Fitness AI Backend running on port ${PORT}`);
  console.log(`📱 Visit http://localhost:${PORT} to test the API`);
});