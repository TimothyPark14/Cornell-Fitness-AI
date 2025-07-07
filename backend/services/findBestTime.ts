import { DayEvent } from './type'
import { divide_by_day } from './eventFormat'
import { calculate_score } from './calculateScore'

const getBestTimes = (weekEvent: DayEvent[], frequency: number, timePreference: number): DayEvent[] => {
  const cleaned_calendar = divide_by_day(weekEvent)
  
  const candidates = []
  cleaned_calendar.forEach(day => {
    candidates.push(calculate_score(day, timePreference))
  })

  return []
}