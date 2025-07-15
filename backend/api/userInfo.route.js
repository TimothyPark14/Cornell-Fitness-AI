// routes/user.js
const express = require('express');
const router = express.Router();
const UserPreferences = require('../model/UserSchema.ts');

// Send and save new user data to database
router.post('/userInfo', async (req, res) => {
  try {
    const { email, age, gender, height, weight, goal, experience, frequency, time } = req.body;
    const user = new UserPreferences({ email, age, gender, height, weight, goal, experience, frequency, time });
    await user.save(); // save to MongoDB

    res.status(201).json({ message: 'User saved', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

module.exports = router;