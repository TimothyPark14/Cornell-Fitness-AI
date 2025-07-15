import { DateTime } from 'luxon'
// ====== Type Definitions ======

interface Event {
  title: string;
  start: DateTime;
  end: DateTime;
  location: string;
}

interface GymEvent {
  title: string;
  start: DateTime;
  end: DateTime;
  location: string;
  nextLocation: string | null;
}

interface CandidateSlot {
  start: DateTime;
  end: DateTime;
  score: number;
}

// ====== Constants ======

const LUNCH_START = 11.5; // 11:30 AM
const LUNCH_END = 13.0;   // 1:00 PM

// ====== Helpers ======

function getDayStart(date: DateTime): DateTime {
  const startOfDay = date.startOf('day');
  return startOfDay;
}


function groupByDay(events: Event[]): Record<string, Event[]> {
  const grouped: Record<string, Event[]> = {};
  for (const e of events) {
    const key = getDayStart(e.start).toString();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  }
  return grouped;
}

function getCandidateBlocks(dayEvents: Event[], date: Date): { start: DateTime; end: DateTime }[] {
  const blocks: { start: DateTime; end: DateTime }[] = [];

  const startHour = 6;
  const endHour = 21;

  // Convert JS Date to Luxon DateTime in ET (America/New_York)
  const baseDate = DateTime.fromJSDate(date, { zone: 'America/New_York' });
  console.log('date', date)
  console.log('baseDate', baseDate)

  // Set exact times in ET
  const startTimeET = baseDate.plus({hours: startHour})
  const endTimeET = baseDate.plus({ hour: endHour - 1}); // 7:45 PM latest start

  console.log('---------------------------------')

  for (let t = startTimeET; t <= endTimeET; t = t.plus({minutes: 15})) {
    const slotStart = t;
    const slotEnd = slotStart.plus({minutes: 75})
    const overlaps = dayEvents.some(event =>
      event.start <= slotEnd && event.end >= slotStart
    );

    if (!overlaps) {
      blocks.push({ start: slotStart, end: slotEnd });
    }

  }

  return blocks;
}

function scoreCandidate(
  slot: { start: DateTime; end: DateTime },
  preference: DateTime,
  skipLunchPenalty: boolean
): number {
  let score = 1.0;

  const slotHour = slot.start.toJSDate().getHours() + slot.start.toJSDate().getMinutes() / 60;
  const prefHour = preference.toJSDate().getHours() + preference.toJSDate().getMinutes() / 60;
  const hourDiff = Math.abs(slotHour - prefHour);

  // Time preference penalty
  score -= hourDiff / 12;

  // Lunch penalty
  if (!skipLunchPenalty) {
    const slotEndHour = slotHour + 1.25;
    const overlapsLunch = slotHour < LUNCH_END && slotEndHour > LUNCH_START;
    if (overlapsLunch) {
      score *= 0.75;
    }
  }

  return score;
}

// ====== Main Function ======

export async function insertPreferredSlots(
  weekEvents: Event[],
  preference: DateTime,
  frequency: number
): Promise<GymEvent[]> {
  const eventsByDay = groupByDay(weekEvents);
  const bestPerDay: CandidateSlot[] = [];

  for (const [dayKey, dayEvents] of Object.entries(eventsByDay)) {
    const date = new Date(dayKey);
    const prefHour = preference.hour + preference.minute / 60;
    console.log('Hour of preference', prefHour)
    const skipLunchPenalty = prefHour >= LUNCH_START && prefHour <= LUNCH_END;

    const candidates = getCandidateBlocks(dayEvents, date);
    const scored: CandidateSlot[] = candidates.map(slot => ({
      ...slot,
      score: scoreCandidate(slot, preference, skipLunchPenalty),
    }));

    if (scored.length > 0) {
      scored.sort((a, b) => b.score - a.score);
      console.log('Highest score: ', scored[0])
      bestPerDay.push(scored[0]);
    }
  }

  console.log('Best candidates', bestPerDay)
  console.log(bestPerDay.length)

  // Pick top `frequency` scored slots across the week
  bestPerDay.sort((a, b) => b.score - a.score);
  const finalists = bestPerDay.slice(0, frequency);

  const res: GymEvent[] = []

  for (const { start, end } of finalists) {
  // Get the day key from the slot's start time
  const dayKey = getDayStart(start).toString();

  // Find the next event that starts after this slot
  const followingEvents = eventsByDay[dayKey]?.filter(e => e.start > end);

  let nextLocation: string | null = null;
  if (followingEvents && followingEvents.length > 0) {
    // Sort just in case (to get the closest upcoming event)
    followingEvents.sort((a, b) => a.start.toMillis() - b.start.toMillis());
    nextLocation = followingEvents[0].location;
  }

  res.push({
    title: '',
    start,
    end,
    location: 'Teagle',
    nextLocation: nextLocation,
  });
}

  return res;
}
