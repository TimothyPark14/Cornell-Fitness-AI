import { DateTime } from 'luxon';

export function cleanEvents(events: any[]) {
  return events.map(event => ({
    start: DateTime.fromISO(event.start.dateTime, { zone: event.start.timeZone }).setZone('America/New_York'),
    end: DateTime.fromISO(event.end.dateTime, { zone: event.end.timeZone }).setZone('America/New_York'),
    location: event.location,
    title: event.summary || 'No Title',
  }));
}
