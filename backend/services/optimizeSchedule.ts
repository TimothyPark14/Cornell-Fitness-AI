import calendarService from './getCalendarData';
import { insertPreferredSlots } from './findBestTime';
import { optimizeGymLocations } from './findBestLocation';
import { cleanEvents } from '../utils/cleanEvents';
import { getOpenAIWorkout } from './getOpenAIWorkout';
import { IUserPreferences } from '../model/UserSchema';
import { DateTime } from 'luxon';

export async function optimizeSchedule(userDoc: IUserPreferences, accessToken: string) {
    try {
        const { frequency, time } = userDoc;
        // Step 1: Get calendar events from Google Calendar
        const rawEvents = await calendarService.getWeeksSchedule(accessToken); 
      
        // Step 2: Clean and format the events
        const cleanedEvents = cleanEvents(rawEvents);
        // Step 3: Find optimal time slots based on user's schedule and preferences
      
        const prefTime = DateTime.fromJSDate(time, {zone: 'America/New_York'})
        const optimizedTime = await insertPreferredSlots(
            cleanedEvents, 
            prefTime,
            frequency
        );
        // Step 4: Optimize gym locations based on where student needs to be next
        const optimizedGymEvents = optimzedTime(
            optimizedLocation,
            {
                // Add user equipment preferences if available
                // requiredEquipment: userDoc.requiredEquipment || []
            }
        );

        // Step 5: Generate personalized workouts for each session
        const workoutPlan = await getOpenAIWorkout(optimizedGymEvents, userDoc);
        // Optional: Save the workout plan to database
        // await saveWorkoutPlan(userDoc._id, optimizedGymEvents, workoutPlan);
        return workoutPlan
    } catch (error) {
        console.error('Error optimizing schedule:', error);
        throw new Error('Failed to optimize workout schedule');
    }
}