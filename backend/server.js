const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')

const userInfoRoute = require('./api/userInfo.route');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', userInfoRoute);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Cornell Fitness AI Backend is running!',
    status: 'Success',
    timestamp: new Date().toISOString()
  });
});


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Cornell Fitness AI Backend running on port ${PORT}`);
      console.log(`📱 Visit http://localhost:${PORT} to test the API`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });