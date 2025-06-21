// services/CalendarService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
interface CalendarEvent {
  id?: string;
  summary?: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  creator?: {
    email: string;
    displayName?: string;
  };
  organizer?: {
    email: string;
    displayName?: string;
  };
}

interface CalendarEventsResponse {
  items: CalendarEvent[];
  nextPageToken?: string;
  summary?: string;
  timeZone?: string;
}

interface FreeTimeSlot {
  start: Date;
  end: Date;
  duration: number; // in minutes
}

interface BusyPeriod {
  start: string;
  end: string;
  summary: string;
}

interface CachedData<T = any> {
  data: T;
  timestamp: number;
}

class CalendarService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = 'https://www.googleapis.com/calendar/v3';
  }

  // Get user's calendar events
  async getEvents(
    accessToken: string, 
    timeMin: Date, 
    timeMax: Date, 
    calendarId: string = 'primary'
  ): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '100'
      });

      const response = await fetch(
        `${this.baseURL}/calendars/${calendarId}/events?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }

      const data: CalendarEventsResponse = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  // Find free time slots between events
  findFreeTimeSlots(
    events: CalendarEvent[], 
    startDate: Date, 
    endDate: Date, 
    minDuration: number = 30
  ): FreeTimeSlot[] {
    const freeSlots: FreeTimeSlot[] = [];
    const busyPeriods = this.extractBusyPeriods(events);
    
    // Sort busy periods by start time
    busyPeriods.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    let currentTime = new Date(startDate);
    const endTime = new Date(endDate);
    
    // Check for free time before first event
    if (busyPeriods.length > 0) {
      const firstEventStart = new Date(busyPeriods[0].start);
      if (firstEventStart.getTime() - currentTime.getTime() >= minDuration * 60000) {
        freeSlots.push({
          start: new Date(currentTime),
          end: new Date(firstEventStart),
          duration: Math.floor((firstEventStart.getTime() - currentTime.getTime()) / 60000)
        });
      }
    }
    
    // Check gaps between events
    for (let i = 0; i < busyPeriods.length - 1; i++) {
      const currentEventEnd = new Date(busyPeriods[i].end);
      const nextEventStart = new Date(busyPeriods[i + 1].start);
      
      const gapDuration = nextEventStart.getTime() - currentEventEnd.getTime();
      if (gapDuration >= minDuration * 60000) {
        freeSlots.push({
          start: new Date(currentEventEnd),
          end: new Date(nextEventStart),
          duration: Math.floor(gapDuration / 60000)
        });
      }
    }
    
    // Check for free time after last event
    if (busyPeriods.length > 0) {
      const lastEventEnd = new Date(busyPeriods[busyPeriods.length - 1].end);
      if (endTime.getTime() - lastEventEnd.getTime() >= minDuration * 60000) {
        freeSlots.push({
          start: new Date(lastEventEnd),
          end: new Date(endTime),
          duration: Math.floor((endTime.getTime() - lastEventEnd.getTime()) / 60000)
        });
      }
    }
    
    return freeSlots;
  }

  // Extract busy periods from calendar events
  private extractBusyPeriods(events: CalendarEvent[]): BusyPeriod[] {
    return events
      .filter(event => event.start && event.end)
      .map(event => ({
        start: event.start.dateTime || event.start.date || '',
        end: event.end.dateTime || event.end.date || '',
        summary: event.summary || 'Busy'
      }))
      .filter(period => period.start && period.end);
  }

  // Get today's schedule
  async getTodaysSchedule(accessToken: string): Promise<CalendarEvent[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return await this.getEvents(accessToken, startOfDay, endOfDay);
  }

  // Get this week's schedule
  async getWeeksSchedule(accessToken: string): Promise<CalendarEvent[]> {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return await this.getEvents(accessToken, startOfWeek, endOfWeek);
  }

  // Find workout opportunities for today
  async findTodaysWorkoutSlots(accessToken: string, minWorkoutDuration: number = 30): Promise<FreeTimeSlot[]> {
    try {
      const events = await this.getTodaysSchedule(accessToken);
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0); // 6 AM
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0); // 11 PM
      
      const freeSlots = this.findFreeTimeSlots(events, startOfDay, endOfDay, minWorkoutDuration);
      
      // Filter out slots that are too early or too late for gym hours
      return freeSlots.filter(slot => {
        const hour = slot.start.getHours();
        return hour >= 6 && hour <= 22; // Assume gyms are open 6 AM - 10 PM
      });
    } catch (error) {
      console.error('Error finding workout slots:', error);
      throw error;
    }
  }

  // Cache calendar data
  async cacheCalendarData<T>(data: T, key: string = 'calendar_events'): Promise<void> {
    try {
      const cacheData: CachedData<T> = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching calendar data:', error);
    }
  }

  // Get cached calendar data
  async getCachedCalendarData<T>(
    key: string = 'calendar_events', 
    maxAge: number = 15 * 60 * 1000 // 15 minutes
  ): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const { data, timestamp }: CachedData<T> = JSON.parse(cached);
        if (Date.now() - timestamp < maxAge) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cached calendar data:', error);
      return null;
    }
  }
}

export default new CalendarService();