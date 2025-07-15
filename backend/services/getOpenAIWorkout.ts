import { DateTime } from 'luxon';
import gymEquipment from '../data/gymEquipment.ts';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend directory (parent directory)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export async function getOpenAIWorkout(
  events: { start: DateTime; location: string }[],
  // user: IUserPreferences
): Promise<string> {
  try {
    // const { frequency, age, gender, height, weight, goal, experience } = user;
    const frequency = 4
    const age = 24
    const gender = 'male'
    const height = 175
    const weight = 75
    const goal = 'build muscle'
    const experience = 'intermediate'

    // Build date-location-equipment map
    const scheduleWithEquipment = events.map(({ start, location }) => {
      const date = start.toFormat('cccc, MMMM d');
      const equipmentList = gymEquipment[location] || [];
      const equipmentText = equipmentList.length
        ? `Available equipment: ${equipmentList.join(', ')}.`
        : `No equipment info found for ${location}.`;
      
      console.log(`Accessing the equipment of ${location} gym`)

      return `${date} at ${location}**\n${equipmentText}`;
    });

    // Final prompt
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
Each workout should last ~60–75 minutes and include warmup, main lifts, and optional accessories.
Use progressive overload when applicable.

Return the response in the form of an Object using the following format.
{
    title: "Chest Day"
    date: "July 16th, 2025"
    exercises: [
      {
        name: 
        set:
        rep: 
      }
    ]
}
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

    if (!response.ok || !data.choices?.[0]?.message?.content) {
      console.error('OpenAI API error:', data);
      return 'Failed to generate a workout. Please try again later.';
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating OpenAI workout:', error);
    return 'An error occurred while generating the workout.';
  }
}
