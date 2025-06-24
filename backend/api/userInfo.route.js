const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', (req, res) => {
  const data = req.body;
  const dirPath = path.join(__dirname, '../data');
  const filePath = path.join(dirPath, 'userInfo.json');
  console.log('POST /api/userInfo hit:', req.body)
  // Ensure the data directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Read existing data (if any)
  let existing = [];
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath);
      existing = JSON.parse(raw);
    } catch (e) {
      existing = [];
    }
  }

  // Add new data
  existing.push(data);

  // Write back to file with error handling
  try {
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    res.json({ status: 'saved', data });
  } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;