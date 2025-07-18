const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserSchema'); // path to your User model

router.get('/users/:email', async (req, res) => {
  const email = req.params.email;
  const user = await UserPreferences.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

module.exports = router;