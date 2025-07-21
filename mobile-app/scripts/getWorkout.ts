import { DateTime } from 'luxon'

const tz = 'America/New_York' // Fixed: underscore instead of space

interface Workout {
  name: string;
  set: number;
  reps: number;
}

interface ScheduleResponse {
  title: string;
  startTime: DateTime;
  endTime: DateTime;
  location: string;
  exercises: Workout[]
}

const staticEvents = [
  {
    title: '',
    start: DateTime.fromObject({ year: 2025, month: 7, day: 18, hour: 7, minute: 30 }, { zone: 'America/New_York' }),
    end: DateTime.fromObject({ year: 2025, month: 7, day: 18, hour: 8, minute: 45 }, { zone: 'America/New_York' }),
    location: 'Teagle',
    nextLocation: 'Uris Hall',
  },
  {
    title: '',
    start: DateTime.fromObject({ year: 2025, month: 7, day: 19, hour: 10, minute: 0 }, { zone: 'America/New_York' }),
    end: DateTime.fromObject({ year: 2025, month: 7, day: 19, hour: 11, minute: 15 }, { zone: 'America/New_York' }),
    location: 'Teagle',
    nextLocation: 'Duffield Hall',
  },
  {
    title: '',
    start: DateTime.fromObject({ year: 2025, month: 7, day: 20, hour: 13, minute: 15 }, { zone: 'America/New_York' }),
    end: DateTime.fromObject({ year: 2025, month: 7, day: 20, hour: 14, minute: 30 }, { zone: 'America/New_York' }),
    location: 'Teagle',
    nextLocation: 'Mann Library',
  },
  {
    title: '',
    start: DateTime.fromObject({ year: 2025, month: 7, day: 21, hour: 15, minute: 0 }, { zone: 'America/New_York' }),
    end: DateTime.fromObject({ year: 2025, month: 7, day: 21, hour: 16, minute: 0 }, { zone: 'America/New_York' }),
    location: 'Teagle',
    nextLocation: 'Phillips Hall',
  },
  {
    title: '',
    start: DateTime.fromObject({ year: 2025, month: 7, day: 22, hour: 18, minute: 30 }, { zone: 'America/New_York' }),
    end: DateTime.fromObject({ year: 2025, month: 7, day: 22, hour: 19, minute: 15 }, { zone: 'America/New_York' }),
    location: 'Teagle',
    nextLocation: 'Statler Hall',
  },
];

export async function getWorkout(): Promise<ScheduleResponse[]> {
    try {
        // Validate DateTime objects before sending
        const eventsForAPI = staticEvents.map(event => {
            // Check if DateTime objects are valid
            if (!event.start.isValid || !event.end.isValid) {
                throw new Error(`Invalid DateTime object for event: ${event.title}`);
            }
            
            return {
                ...event,
                start: event.start.toISO(), // This preserves timezone info in the ISO string
                end: event.end.toISO(),
                timezone: tz // Send timezone explicitly
            };
        });

        const payload = {
            events: eventsForAPI,
            timezone: tz // Also send at top level for reference
        };

        console.log('Sending payload to API:', JSON.stringify(payload, null, 2));

        const response = await fetch('http://localhost:3000/api/aiWorkout/', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        console.log(typeof data)

        // Validate response structure
        // if (!Array.isArray(data)) {
        //     throw new Error('API response is not an array');
        // }

        const refinedData: ScheduleResponse[] = data.map((item: any, index: number) => {
            // Validate required fields
            if (!item.title || !item.startTime || !item.endTime || !item.location) {
                console.warn(`Missing required fields in item ${index}:`, item);
            }

            // Parse DateTime objects with proper error handling
            let startTime: DateTime;
            let endTime: DateTime;

            try {
                startTime = typeof item.startTime === 'string' 
                    ? DateTime.fromISO(item.startTime, { zone: "utc" })
                    : item.startTime;
                
                startTime.setZone(tz, {keepLocalTime: true});
                
                endTime = typeof item.endTime === 'string' 
                    ? DateTime.fromISO(item.endTime, { zone: "utc" })
                    : item.endTime;

                endTime.setZone(tz, {keepLocalTime: true});

                // Validate parsed DateTime objects
                if (!startTime.isValid) {
                    throw new Error(`Invalid startTime: ${item.startTime}, reason: ${startTime.invalidReason}`);
                }
                if (!endTime.isValid) {
                    throw new Error(`Invalid endTime: ${item.endTime}, reason: ${endTime.invalidReason}`);
                }
            } catch (dateError) {
                console.error(`Error parsing dates for item ${index}:`, dateError);
                throw new Error(`Failed to parse dates for workout ${index}: ${dateError}`);
            }

            return {
                title: item.title || `Workout ${index + 1}`,
                startTime,
                endTime,
                location: item.location || 'Unknown Location',
                exercises: Array.isArray(item.exercises) ? item.exercises : []
            };
        });

        console.log('Refined data:', refinedData);
        return refinedData;

    } catch (error) {
        console.error('Error in getWorkout:', error);
        
        // Provide more specific error information
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to the API. Make sure the server is running on localhost:3000');
        }
        
        throw error;
    }
}

// Helper function to test DateTime parsing
export function testDateTimeParsing() {
    console.log('Testing DateTime parsing...');
    
    staticEvents.forEach((event, index) => {
        console.log(`Event ${index}:`, {
            title: event.title,
            start: event.start.toISO(),
            end: event.end.toISO(),
            isStartValid: event.start.isValid,
            isEndValid: event.end.isValid
        });
    });
}

// Helper function to test API connection
export async function testAPIConnection() {
    try {
        const response = await fetch('http://localhost:3000/api/aiWorkout/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('API connection test - Status:', response.status);
        return response.ok;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
}