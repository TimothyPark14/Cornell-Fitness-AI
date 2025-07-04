// services/OpenAIWorkoutService.ts
interface WorkoutPreferences {
  goal: string;
  fitnessLevel: string;
  equipment: string[];
  workoutType: string;
}

interface WorkoutSlot {
  start: Date;
  end: Date;
  duration: number;
}

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  rest?: string;
  instructions?: string;
}

interface WorkoutPlan {
  title: string;
  description: string;
  duration: number;
  estimatedCalories: number;
  warmup: Exercise[];
  mainWorkout: Exercise[];
  cooldown: Exercise[];
  tips: string[];
}

class OpenAIWorkoutService {
  private static readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  
  // Get API key from environment variables
  private static readonly API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  static async generateWorkout(
    preferences: WorkoutPreferences, 
    slot: WorkoutSlot
  ): Promise<WorkoutPlan> {
    console.log('🧠 OpenAI Service: Starting workout generation...');
    console.log('🔑 API Key exists:', !!this.API_KEY);
    console.log('🔑 API Key starts with:', this.API_KEY?.substring(0, 7) + '...');

    try {
      // Try real OpenAI first if we have an API key
      if (this.API_KEY && this.API_KEY.startsWith('sk-') && this.API_KEY.length > 20) {
        console.log('🚀 Using REAL OpenAI API!');
        return await this.generateRealOpenAIWorkout(preferences, slot);
      } else {
        console.log('📱 No valid OpenAI API key, using intelligent mock workouts');
        return this.generateIntelligentMockWorkout(preferences, slot);
      }
    } catch (error) {
      console.error('❌ OpenAI API Error:', error);
      console.log('🔄 Falling back to intelligent mock workout');
      return this.generateIntelligentMockWorkout(preferences, slot);
    }
  }

  private static async generateRealOpenAIWorkout(
    preferences: WorkoutPreferences, 
    slot: WorkoutSlot
  ): Promise<WorkoutPlan> {
    const prompt = this.createDetailedPrompt(preferences, slot);
    
    console.log('📤 Sending request to OpenAI...');
    
    const response = await fetch(this.OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // More cost-effective than gpt-4
        messages: [
          {
            role: 'system',
            content: `You are an expert personal trainer at Cornell University. You create safe, effective, and engaging workout plans specifically for college students using Cornell's gym facilities. Always prioritize proper form and progressive overload principles.

IMPORTANT: Respond with a valid JSON object in this exact format:
{
  "title": "workout title",
  "description": "brief description",
  "estimatedCalories": number,
  "warmup": [
    {
      "name": "exercise name",
      "duration": "5 minutes",
      "instructions": "clear instructions"
    }
  ],
  "mainWorkout": [
    {
      "name": "exercise name",
      "sets": 3,
      "reps": "8-12",
      "rest": "90 seconds",
      "instructions": "detailed form cues"
    }
  ],
  "cooldown": [
    {
      "name": "stretch name",
      "duration": "30 seconds",
      "instructions": "how to perform"
    }
  ],
  "tips": [
    "helpful tip 1",
    "helpful tip 2"
  ]
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Response Error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI API Response received!');
    
    const workoutText = data.choices[0].message.content;
    console.log('📝 Raw OpenAI response:', workoutText.substring(0, 200) + '...');
    
    return this.parseOpenAIResponse(workoutText, preferences, slot);
  }

  private static createDetailedPrompt(preferences: WorkoutPreferences, slot: WorkoutSlot): string {
    const timeOfDay = this.getTimeOfDay(slot.start);
    const equipmentList = preferences.equipment.join(', ');
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `Create a ${slot.duration}-minute ${preferences.goal} workout for a Cornell University student.

WORKOUT CONTEXT:
• Date: ${currentDate}
• Time: ${timeOfDay} (${this.formatTime(slot.start)} - ${this.formatTime(slot.end)})
• Location: Cornell gym (Helen Newman Hall or similar facility)
• Duration: Exactly ${slot.duration} minutes
• Student Level: ${preferences.fitnessLevel}
• Primary Goal: ${preferences.goal}
• Available Equipment: ${equipmentList}

CORNELL-SPECIFIC REQUIREMENTS:
• Adapt intensity for ${timeOfDay} workout (students need energy for classes)
• Consider this is a college campus gym with standard equipment
• Include exercises that work well in a potentially busy gym environment
• Make it time-efficient for students with tight schedules

DETAILED SPECIFICATIONS:
• Warmup: 5-8 minutes of dynamic movement
• Main workout: ${slot.duration - 15} minutes focused on ${preferences.goal}
• Cooldown: 5-7 minutes of stretching and recovery
• All exercises must use only: ${equipmentList}
• ${preferences.fitnessLevel} difficulty level
• Include specific rep ranges, sets, and rest periods
• Provide clear form cues for safety

Please respond with a properly formatted JSON workout plan that a Cornell student can immediately follow.`;
  }

  private static parseOpenAIResponse(response: string, preferences: WorkoutPreferences, slot: WorkoutSlot): WorkoutPlan {
    try {
      // Try to extract JSON from the response
      let jsonStr = response;
      
      // Handle cases where OpenAI wraps JSON in markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      
      // Clean up any extra text before/after JSON
      const startBrace = jsonStr.indexOf('{');
      const endBrace = jsonStr.lastIndexOf('}');
      if (startBrace !== -1 && endBrace !== -1) {
        jsonStr = jsonStr.substring(startBrace, endBrace + 1);
      }
      
      console.log('🔍 Parsing JSON response...');
      const parsedWorkout = JSON.parse(jsonStr);
      
      // Validate and return structured workout
      return {
        title: parsedWorkout.title || `${slot.duration}-Minute ${preferences.goal} Workout`,
        description: parsedWorkout.description || `AI-generated ${preferences.goal.toLowerCase()} workout`,
        duration: slot.duration,
        estimatedCalories: parsedWorkout.estimatedCalories || this.estimateCalories(slot.duration, preferences.goal),
        warmup: parsedWorkout.warmup || [],
        mainWorkout: parsedWorkout.mainWorkout || [],
        cooldown: parsedWorkout.cooldown || [],
        tips: parsedWorkout.tips || ['AI-generated workout - listen to your body!']
      };
      
    } catch (error) {
      console.error('❌ Error parsing OpenAI response:', error);
      console.log('🔄 Falling back to mock workout due to parsing error');
      
      // Fallback to mock if parsing fails
      return this.generateIntelligentMockWorkout(preferences, slot);
    }
  }

  private static generateIntelligentMockWorkout(preferences: WorkoutPreferences, slot: WorkoutSlot): WorkoutPlan {
    console.log('🎭 Generating intelligent mock workout');
    
    const workoutTemplates = {
      strength: {
        warmup: [
          { name: 'Dynamic Stretching', duration: '5 minutes', instructions: 'Arm circles, leg swings, torso twists to prepare joints' },
          { name: 'Light Cardio', duration: '5 minutes', instructions: 'Treadmill or bike at conversational pace' }
        ],
        mainWorkout: slot.duration < 45 ? [
          { name: 'Goblet Squats', sets: 3, reps: '12-15', rest: '60 seconds', instructions: 'Hold dumbbell at chest, squat deep' },
          { name: 'Push-ups', sets: 3, reps: '8-12', rest: '60 seconds', instructions: 'Modify on knees if needed' },
          { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: '60 seconds', instructions: 'One arm at a time, squeeze shoulder blades' }
        ] : [
          { name: 'Barbell Squats', sets: 4, reps: preferences.fitnessLevel === 'beginner' ? '10-12' : '6-8', rest: '2 minutes', instructions: 'Keep chest up, knees track over toes' },
          { name: 'Bench Press', sets: 4, reps: preferences.fitnessLevel === 'beginner' ? '10-12' : '6-8', rest: '2 minutes', instructions: 'Control the descent, press explosively' },
          { name: 'Bent-over Rows', sets: 3, reps: '8-12', rest: '90 seconds', instructions: 'Hinge at hips, pull to lower chest' },
          { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90 seconds', instructions: 'Core tight, press straight overhead' },
          { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: '90 seconds', instructions: 'Hinge at hips, feel hamstring stretch' }
        ],
        cooldown: [
          { name: 'Chest Stretch', duration: '30 seconds', instructions: 'Doorway stretch, feel opening across chest' },
          { name: 'Hip Flexor Stretch', duration: '30 seconds each side', instructions: 'Lunge position, push hips forward' },
          { name: 'Shoulder Rolls', duration: '1 minute', instructions: 'Slow, controlled circles to release tension' }
        ]
      },
      cardio: {
        warmup: [
          { name: 'Walking', duration: '3 minutes', instructions: 'Start slow, gradually increase pace' },
          { name: 'Dynamic Movements', duration: '2 minutes', instructions: 'High knees, butt kicks, leg swings' }
        ],
        mainWorkout: slot.duration < 30 ? [
          { name: 'HIIT Intervals', duration: '15 minutes', instructions: '30 seconds hard, 30 seconds easy on treadmill/bike' },
          { name: 'Bodyweight Circuit', duration: '8 minutes', instructions: 'Jumping jacks, mountain climbers, burpees' }
        ] : [
          { name: 'Cardio Machine', duration: `${Math.floor(slot.duration * 0.6)} minutes`, instructions: 'Maintain 70-80% max heart rate' },
          { name: 'Circuit Training', duration: '15 minutes', instructions: 'Rotate: bike, rowing, elliptical every 5 minutes' },
          { name: 'Core Finisher', duration: '5 minutes', instructions: 'Planks, bicycle crunches, dead bugs' }
        ],
        cooldown: [
          { name: 'Walking Cool-down', duration: '5 minutes', instructions: 'Gradual pace reduction' },
          { name: 'Full Body Stretch', duration: '5 minutes', instructions: 'Focus on legs, hips, and back' }
        ]
      },
      fullbody: {
        warmup: [
          { name: 'Joint Mobility', duration: '5 minutes', instructions: 'Circles for ankles, knees, hips, shoulders' },
          { name: 'Movement Prep', duration: '5 minutes', instructions: 'Bodyweight squats, arm swings, lunges' }
        ],
        mainWorkout: [
          { name: 'Squats', sets: 3, reps: '12-15', rest: '60 seconds', instructions: 'Bodyweight or goblet style' },
          { name: 'Push-ups', sets: 3, reps: '8-12', rest: '60 seconds', instructions: 'Modify as needed for your level' },
          { name: 'Dumbbell Rows', sets: 3, reps: '10-12 each arm', rest: '60 seconds', instructions: 'Single arm, focus on form' },
          { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60 seconds', instructions: 'Step back, 90-degree angles' },
          { name: 'Plank', sets: 3, duration: preferences.fitnessLevel === 'beginner' ? '30 seconds' : '60 seconds', rest: '60 seconds', instructions: 'Straight line from head to heels' },
          { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60 seconds', instructions: 'Seated or standing with dumbbells' }
        ],
        cooldown: [
          { name: 'Full Body Flow', duration: '8 minutes', instructions: 'Cat-cow, child\'s pose, gentle twists' },
          { name: 'Deep Breathing', duration: '2 minutes', instructions: '4 counts in, 6 counts out' }
        ]
      },
      hiit: {
        warmup: [
          { name: 'Dynamic Warmup', duration: '5 minutes', instructions: 'Prepare body for high intensity' }
        ],
        mainWorkout: [
          { name: 'Circuit Round 1', duration: '8 minutes', instructions: '40 seconds work, 20 seconds rest: burpees, mountain climbers, jump squats, high knees' },
          { name: 'Recovery', duration: '2 minutes', instructions: 'Light walking or marching in place' },
          { name: 'Circuit Round 2', duration: '8 minutes', instructions: '40 seconds work, 20 seconds rest: push-ups, jumping lunges, plank jacks, bicycle crunches' },
          { name: 'Finisher', duration: `${slot.duration - 25} minutes`, instructions: 'Tabata style: 20 seconds all-out, 10 seconds rest' }
        ],
        cooldown: [
          { name: 'Walking Recovery', duration: '5 minutes', instructions: 'Bring heart rate down gradually' },
          { name: 'Stretching', duration: '5 minutes', instructions: 'Focus on muscles worked' }
        ]
      }
    };

    const template = workoutTemplates[preferences.goal as keyof typeof workoutTemplates] || workoutTemplates.fullbody;
    
    // Adjust difficulty based on fitness level
    const adjustedMainWorkout = template.mainWorkout.map(exercise => {
      // Create a copy to avoid mutating the original
      const adjustedExercise: any = { ...exercise };
      
      // Only adjust rep-based exercises (not duration-based ones)
      if (preferences.fitnessLevel === 'beginner') {
        // Adjust reps if they exist
        if (adjustedExercise.reps && adjustedExercise.reps.includes && adjustedExercise.reps.includes('-')) {
          const parts = adjustedExercise.reps.split('-');
          const min = parseInt(parts[0].trim());
          const max = parseInt(parts[1].trim());
          adjustedExercise.reps = `${Math.max(1, min - 2)}-${Math.max(1, max - 2)}`;
        }
        // Adjust sets if they exist
        if (adjustedExercise.sets && adjustedExercise.sets > 2) {
          adjustedExercise.sets = Math.max(2, adjustedExercise.sets - 1);
        }
      } else if (preferences.fitnessLevel === 'advanced') {
        // Adjust reps if they exist
        if (adjustedExercise.reps && adjustedExercise.reps.includes && adjustedExercise.reps.includes('-')) {
          const parts = adjustedExercise.reps.split('-');
          const min = parseInt(parts[0].trim());
          const max = parseInt(parts[1].trim());
          adjustedExercise.reps = `${min + 2}-${max + 3}`;
        }
        // Adjust sets if they exist
        if (adjustedExercise.sets) {
          adjustedExercise.sets = adjustedExercise.sets + 1;
        }
      }
      
      return adjustedExercise as Exercise;
    });
    
    return {
      title: `${slot.duration}-Minute ${preferences.goal.charAt(0).toUpperCase() + preferences.goal.slice(1)} Workout`,
      description: `Intelligent ${preferences.goal.toLowerCase()} workout tailored for ${preferences.fitnessLevel} level Cornell students`,
      duration: slot.duration,
      estimatedCalories: this.estimateCalories(slot.duration, preferences.goal),
      warmup: template.warmup,
      mainWorkout: this.adjustWorkoutDuration(adjustedMainWorkout, slot.duration),
      cooldown: template.cooldown,
      tips: [
        'Stay hydrated throughout your workout 💧',
        'Focus on proper form over heavy weight',
        'Listen to your body and adjust intensity as needed',
        `Perfect timing for your ${this.getTimeOfDay(slot.start)} Cornell schedule!`,
        preferences.fitnessLevel === 'beginner' ? 'Take extra rest between sets if needed' : 'Challenge yourself while maintaining good form'
      ]
    };
  }

  private static adjustWorkoutDuration(exercises: Exercise[], duration: number): Exercise[] {
    if (duration < 30) {
      return exercises.slice(0, 2); // Short workout
    } else if (duration < 60) {
      return exercises.slice(0, 4); // Medium workout
    }
    return exercises; // Full workout
  }

  private static estimateCalories(duration: number, goal: string): number {
    const baseRate = {
      'strength': 6,
      'cardio': 10,
      'fullbody': 8,
      'hiit': 12
    };
    
    const rate = baseRate[goal as keyof typeof baseRate] || 8;
    return Math.round(duration * rate);
  }

  private static getTimeOfDay(time: Date): string {
    const hour = time.getHours();
    if (hour < 8) return 'early morning';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 20) return 'evening';
    return 'late evening';
  }

  private static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

export default OpenAIWorkoutService;