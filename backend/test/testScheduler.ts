import { insertPreferredSlots } from '../services/findBestTime.ts';
import { DateTime } from 'luxon';

const tz = 'America/New_York';

const staticEvents = [
  // Monday
  {
    title: 'INFO 1300 Lecture',
    start: DateTime.fromISO('2025-07-14T10:10:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-14T11:00:00', { zone: tz }),
    location: 'Gates Hall G01',
  },
  {
    title: 'CS 2110 Lecture',
    start: DateTime.fromISO('2025-07-14T11:15:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-14T12:05:00', { zone: tz }),
    location: 'Phillips Hall 101',
  },
  {
    title: 'Lunch break',
    start: DateTime.fromISO('2025-07-14T12:15:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-14T13:15:00', { zone: tz }),
    location: 'Okenshields',
  },
  {
    title: 'Study + chill',
    start: DateTime.fromISO('2025-07-14T14:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-14T15:30:00', { zone: tz }),
    location: 'Mann Library',
  },

  // Tuesday
  {
    title: 'Gym workout',
    start: DateTime.fromISO('2025-07-15T08:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-15T09:15:00', { zone: tz }),
    location: 'Helen Newman Hall',
  },
  {
    title: 'CS 2110 Discussion',
    start: DateTime.fromISO('2025-07-15T13:25:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-15T14:15:00', { zone: tz }),
    location: 'Hollister Hall 110',
  },
  {
    title: 'Project time (solo)',
    start: DateTime.fromISO('2025-07-15T15:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-15T17:00:00', { zone: tz }),
    location: 'Duffield Hall',
  },

  // Wednesday
  {
    title: 'INFO 1300 Lecture',
    start: DateTime.fromISO('2025-07-16T10:10:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-16T11:00:00', { zone: tz }),
    location: 'Gates Hall G01',
  },
  {
    title: 'CS 2110 Lecture',
    start: DateTime.fromISO('2025-07-16T11:15:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-16T12:05:00', { zone: tz }),
    location: 'Phillips Hall 101',
  },
  {
    title: 'Afternoon nap + walk',
    start: DateTime.fromISO('2025-07-16T14:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-16T15:00:00', { zone: tz }),
    location: 'Arts Quad / Dorm',
  },

  // Thursday
  {
    title: 'INFO 1300 Lab',
    start: DateTime.fromISO('2025-07-17T10:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-17T11:15:00', { zone: tz }),
    location: 'Gates Hall 310',
  },
  {
    title: 'Free time / hobby',
    start: DateTime.fromISO('2025-07-17T14:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-17T15:30:00', { zone: tz }),
    location: 'Willard Straight Music Room',
  },
  {
    title: 'Club meeting: Web Dev @ Cornell',
    start: DateTime.fromISO('2025-07-17T17:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-17T18:00:00', { zone: tz }),
    location: 'Upson 216',
  },

  // Friday
  {
    title: 'CS 2110 Lecture',
    start: DateTime.fromISO('2025-07-18T11:15:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-18T12:05:00', { zone: tz }),
    location: 'Phillips Hall 101',
  },
  {
    title: 'Lunch w/ friend',
    start: DateTime.fromISO('2025-07-18T12:30:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-18T13:30:00', { zone: tz }),
    location: 'Collegetown Bagels',
  },
  {
    title: 'Afternoon free / errands',
    start: DateTime.fromISO('2025-07-18T15:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-18T16:30:00', { zone: tz }),
    location: 'Target / Dorm',
  },
  {
    title: 'Movie night',
    start: DateTime.fromISO('2025-07-18T20:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-18T22:00:00', { zone: tz }),
    location: 'Cornell Cinema',
  },

  // Saturday
  {
    title: 'Sleep in + gym',
    start: DateTime.fromISO('2025-07-19T10:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-19T11:30:00', { zone: tz }),
    location: 'Teagle Fitness Center',
  },
  {
    title: 'Chill / Netflix',
    start: DateTime.fromISO('2025-07-19T14:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-19T15:30:00', { zone: tz }),
    location: 'Dorm',
  },
  {
    title: 'Dinner out',
    start: DateTime.fromISO('2025-07-19T18:30:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-19T20:00:00', { zone: tz }),
    location: 'Collegetown Korean BBQ',
  },

  // Sunday
  {
    title: 'Laundry + tidy up',
    start: DateTime.fromISO('2025-07-20T11:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-20T12:30:00', { zone: tz }),
    location: 'Dorm',
  },
  {
    title: 'Weekly planning + emails',
    start: DateTime.fromISO('2025-07-20T14:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-20T15:30:00', { zone: tz }),
    location: 'Mann Library',
  },
  {
    title: 'Evening walk / call home',
    start: DateTime.fromISO('2025-07-20T18:00:00', { zone: tz }),
    end: DateTime.fromISO('2025-07-20T19:00:00', { zone: tz }),
    location: 'Beebe Lake Trail',
  },
];

const preference = DateTime.fromISO('2025-07-14T10:00:00', { zone: tz });
const frequency = 5;

const result = insertPreferredSlots(staticEvents, preference, frequency);

console.log('=== Final Events ===');
console.log(result);
