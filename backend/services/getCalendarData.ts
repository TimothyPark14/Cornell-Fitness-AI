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
}

export default new CalendarService();