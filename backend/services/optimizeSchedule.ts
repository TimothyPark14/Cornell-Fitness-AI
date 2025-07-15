import calendarService from './getCalendarData';
import { insertPreferredSlots } from './findBestTime';
import { cleanEvents } from '../utils/cleanEvents';
import { getOpenAIWorkout } from './getOpenAIWorkout';
import { IUserPreferences } from '../model/UserSchema';
import { DateTime } from 'luxon'

export async function optimizeSchedule(userDoc: IUserPreferences, accessToken: string) {
    // const frequency = userDoc.frequency || 3;
    // const preferredTime = userDoc.time;
    const { frequency, time } = userDoc

    const rawEvents = await calendarService.getWeeksSchedule(accessToken);
    const cleanedEvents = cleanEvents(rawEvents);

    const optimizedEvents = await insertPreferredSlots(cleanedEvents, new DateTime(time), frequency);

    // const optimizedLocation = await optimalLocation(optimizedEvents)
    // Optional: use OpenAI to generate personalized workouts

    const openaiResponse = await getOpenAIWorkout(optimizedEvents, userDoc);


    return openaiResponse;
}


