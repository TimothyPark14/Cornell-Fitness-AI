import express from 'express';
import calendarService from '../services/getCalendarData';
import findBestTime from '../services/findBestTime';
import authMiddleware from '../middleware/auth';
import User from '../models/UserSchema'; // Import your User model

const router = express.Router();

router.get('/week', authMiddleware, async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) return res.status(401).json({ error: 'No token' });

  const userId = req.user.id; // or req.user._id, depending on your JWT payload

  try {
    // Fetch user preferences from MongoDB
    const userDoc = await User.findById(userId);
    if (!userDoc) return res.status(404).json({ error: 'User not found' });

    const frequency = userDoc.frequency || 3
    const preferredTime = userDoc.time || ''

    const events = await calendarService.getWeeksSchedule(accessToken);
    const cleaned_events = await extractEvents(events);
    const optimized_events = await findBestTime(cleaned_events, {
      user: userDoc,
      frequency,
      preferredTime
    });
    res.json(optimized_events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export default router;

/**
 * 
 */