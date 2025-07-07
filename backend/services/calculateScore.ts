import { Candidate, DayEvent } from './type';

export const calculate_score = (dayEvent: DayEvent[], timePreference: number): Candidate => {

    dayEvent.forEach(event => {
        
    })
  return {
    date: new Date(), // current date/time
    event: {
      title: dayEvent.title,
      start: dayEvent.start,
      end: dayEvent.end,
      location: dayEvent.location
    },
    score: -1 // placeholder score for now
  };
};
