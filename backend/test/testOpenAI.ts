import { DateTime } from 'luxon';
import { getOpenAIWorkout } from '../services/getOpenAIWorkout.ts';

const events = [
  { start: DateTime.fromISO('2025-07-15T07:00:00', { zone: 'America/New_York' }), location: 'Teagle' },
  { start: DateTime.fromISO('2025-07-16T18:30:00', { zone: 'America/New_York' }), location: 'Helen Newman' },
  { start: DateTime.fromISO('2025-07-17T10:15:00', { zone: 'America/New_York' }), location: 'Noyes' },
  { start: DateTime.fromISO('2025-07-18T14:00:00', { zone: 'America/New_York' }), location: 'Toni Morrison' },
  { start: DateTime.fromISO('2025-07-19T16:45:00', { zone: 'America/New_York' }), location: 'Helen Newman' },
];

const randomUser = {
  _id: '', // required by Mongoose's Document, but unused here
  email: 'john.doe@example.com',
  age: 24,
  gender: 'male',
  height: 178, // cm
  weight: 75,  // kg
  goal: 'build muscle',
  experience: 'intermediate',
  time: new Date(),
  frequency: 4,
}; // explicitly cast if needed to bypass Mongoose types

(async () => {
  try {
    const response = await getOpenAIWorkout(events);
    console.log('Workout Plan:', response);
  } catch (err) {
    console.error('Error:', err);
  }
})();
