import { DateTime } from 'luxon';
import gymEquipment from '../data/gymEquipment.ts';
import dotenv from 'dotenv';
import path from 'path';
import { start } from 'repl';

// Load .env from the backend directory (parent directory)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

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

export async function getOpenAIWorkout(

  events: { start: DateTime; 
            end: DateTime; 
            location: string
           }[],

  // user: IUserPreferences
  ): Promise<string> {
  try {
    // const { frequency, age, gender, height, weight, goal, experience, _id } = user;
    const frequency = 4
    const age = 24
    const gender = 'male'
    const height = 175
    const weight = 75
    const goal = 'build muscle'
    const experience = 'intermediate'

    // Build date-location-equipment map
    const scheduleWithEquipment = events.map(({ start, end, location }) => {
      const startTime = start.toISO();
      const endTime = end.toISO();
      const equipmentList = gymEquipment[location] || [];
      const equipmentText = equipmentList.length
        ? `Available equipment: ${equipmentList.join(', ')}.`
        : `No equipment info found for ${location}.`;
      
      console.log(`Accessing the equipment of ${location} gym`)

      return `${startTime} to ${endTime} at ${location}**\n${equipmentText}`;
    });

    const userPrompt = `
      You are a Cornell fitness coach generating personalized workouts for a student.

      👤 Profile:
      - Age: ${age}
      - Gender: ${gender}
      - Height: ${height}
      - Weight: ${weight}
      - Goal: ${goal}
      - Experience level: ${experience}
      - Weekly frequency: ${frequency} times

      📆 Workout Schedule:
      The student will go to the gym on the following days:

      ${scheduleWithEquipment.join('\n\n')}

      🏋️ Generate a detailed workout plan for each day based on their equipment access and personal goals.
      Each workout should last 75 minutes and include warmup, main lifts, and optional accessories.
      Use progressive overload when applicable.

      Return the response as a JSON array of objects, each shaped like the following TypeScript interface:

      interface ScheduleResponse {
        title: string;
        startTime: string; // ISO 8601 format, e.g. "2025-07-18T07:00:00Z"
        endTime: string;   // ISO 8601 format
        location: string;
        exercises: {
          name: string;
          set: number;
          reps: number;
        }[];
      }

      Only return valid JSON, with no extra text, markdown, or explanation.
      DO NOT include Objects of days not spent in a gym facilitiy. In other words, output exercises
      for days ONLY listed in the input events.

      For example:
      [
        {
          "title": "Chest Day",
          "startTime": "2025-07-18T07:00:00Z",
          "endTime": "2025-07-18T08:00:00Z",
          "location": "Teagle Gym",
          "exercises": [
            { "id": 1, "name": "Flat Bench Press", "set": 4, "rep": 8 },
            { "id": 2, "name": "Incline Dumbbell Press", "set": 3, "rep": 10 }
          ]
        }
      ]

      NOTE: The title should be formatted as {Body Part} + Day. 
      For example, Chest Day, Back Day, Pull Day, Leg Day, Upper Body Day, etc. DO NOT include Day X.

      `;

    const messages = [
      { role: 'system', content: 'You are a Cornell fitness coach generating workouts.' },
      { role: 'user', content: userPrompt },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    
    const cleanJSON = extractJSONFromMarkdown(data.choices[0].message.content);
    console.log('ChatGPT response data ', cleanJSON)
    console.log(typeof cleanJSON)

    
    if (!response.ok || !data.choices?.[0]?.message?.content) {
      console.error('OpenAI API error:', data);
      return 'Failed to generate a workout. Please try again later.';
    }
    
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error('Error generating OpenAI workout:', error);
    return 'An error occurred while generating the workout.';
  }
}

function extractJSONFromMarkdown(text: string): string {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}
