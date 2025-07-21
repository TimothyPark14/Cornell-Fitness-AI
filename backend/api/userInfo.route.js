// routes/user.js
import express from 'express';
import User from '../model/UserSchema.ts'; // make sure the path/extension is correct if it's a TS/JS file

const router = express.Router();

// Send and save new user data to database
router.post('/userInfo', async (req, res) => {
  try {
    const { email, age, gender, height, weight, goal, experience, frequency, time } = req.body;
    const user = new User({ email, age, gender, height, weight, goal, experience, frequency, time });
    await user.save(); // save to MongoDB

    res.status(201).json({ message: 'User saved', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

export default router