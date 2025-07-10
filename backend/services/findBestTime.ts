// ====== Type Definitions ======

interface Event {
  title: string;
  start: Date;
  end: Date;
  location: string;
}

interface CandidateSlot {
  start: Date;
  end: Date;
  score: number;
}

// ====== Constants ======

const MS_PER_MINUTE = 60 * 1000;
const LUNCH_START = 11.5; // 11:30 AM
const LUNCH_END = 13.0;   // 1:00 PM

// ====== Helpers ======

function getDayStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function groupByDay(events: Event[]): Record<string, Event[]> {
  const grouped: Record<string, Event[]> = {};
  for (const e of events) {
    const key = getDayStart(e.start).toISOString();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  }
  return grouped;
}

function getCandidateBlocks(dayEvents: Event[], date: Date): { start: Date; end: Date }[] {
  const blocks: { start: Date; end: Date }[] = [];

  const startHour = 6;
  const endHour = 20;

  const startTime = new Date(date);
  startTime.setHours(startHour, 0, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour - 1, 45, 0, 0); // latest start = 6:45 PM

  for (let t = new Date(startTime); t <= endTime; t = new Date(t.getTime() + 15 * MS_PER_MINUTE)) {
    const slotStart = new Date(t);
    const slotEnd = new Date(slotStart.getTime() + 75 * MS_PER_MINUTE);

    const overlaps = dayEvents.some(event =>
      event.start < slotEnd && event.end > slotStart
    );

    if (!overlaps) {
      blocks.push({ start: slotStart, end: slotEnd });
    }
  }

  return blocks;
}

function scoreCandidate(
  slot: { start: Date; end: Date },
  preference: Date,
  skipLunchPenalty: boolean
): number {
  let score = 1.0;

  const slotHour = slot.start.getHours() + slot.start.getMinutes() / 60;
  const prefHour = preference.getHours() + preference.getMinutes() / 60;
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

export function insertPreferredSlots(
  weekEvents: Event[],
  preference: Date,
  frequency: number
): Event[] {
  const eventsByDay = groupByDay(weekEvents);
  const bestPerDay: CandidateSlot[] = [];

  for (const [dayKey, dayEvents] of Object.entries(eventsByDay)) {
    const date = new Date(dayKey);
    const prefHour = preference.getHours() + preference.getMinutes() / 60;
    const skipLunchPenalty = prefHour >= LUNCH_START && prefHour <= LUNCH_END;

    const candidates = getCandidateBlocks(dayEvents, date);
    const scored: CandidateSlot[] = candidates.map(slot => ({
      ...slot,
      score: scoreCandidate(slot, preference, skipLunchPenalty),
    }));

    if (scored.length > 0) {
      scored.sort((a, b) => b.score - a.score);
      bestPerDay.push(scored[0]);
    }
  }

  // Pick top `frequency` scored slots across the week
  bestPerDay.sort((a, b) => b.score - a.score);
  const finalists = bestPerDay.slice(0, frequency);

  // Add as new events with blank title/location
  for (const { start, end } of finalists) {
    weekEvents.push({
      title: '',
      start,
      end,
      location: '',
    });
  }

  return weekEvents;
}
