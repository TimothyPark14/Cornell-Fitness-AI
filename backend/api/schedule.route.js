import express from 'express';
import authMiddleware from '../middleware/auth';
import User from '../models/UserSchema';
import { optimizeSchedule } from '../services/optimizeSchedule';

const router = express.Router();

router.post('/schedule', authMiddleware, async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) return res.status(401).json({ error: 'No token' });

  const userId = req.user.id;

  try {
    const userDoc = await User.findById(userId);
    if (!userDoc) return res.status(404).json({ error: 'User not found' });

    const response = await optimizeSchedule(userDoc, accessToken);
    res.json(response);
  } catch (err) {
    console.error('Error in /schedule route:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export default router;
