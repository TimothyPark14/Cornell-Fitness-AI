import express from 'express';
import { getOpenAIWorkout } from '../services/getOpenAIWorkout.ts';
import { DateTime } from 'luxon'
const router = express.Router();

router.post('/aiWorkout', async (req, res) => {
  console.log('In aiWorkout generation route')
  try {
    const { events, timezone } = req.body;
    const reconstructedEvents = events.map(event=>({
        ...event,
        start: DateTime.fromISO(event.start, { zone: timezone }),
        end: DateTime.fromISO(event.end, { zone: timezone })
    }));

    const response = await getOpenAIWorkout(reconstructedEvents);
    console.log('Received a response!', response[0].exercises)

    res.json(response)
  } catch (err) {
    console.error('Error in /aiWorkout route:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export default router;
