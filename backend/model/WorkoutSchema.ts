import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Workout {
  name: string;
  set: number;
  reps: number;
}

export interface IWorkoutStructure extends Document {
  workoutId: string;
  title: string;
  location: string;
  startTime: Date;
  endTime: Date;
  workoutContent: Workout[];
}

const WorkoutSchema: Schema = new Schema({
  workoutId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  workoutContent: [
    {
      name: { type: String, required: true },
      set: { type: Number, required: true },
      reps: { type: Number, required: true },
    }
  ]
});

export interface WeeklyWorkoutPlan extends Document {
  userId: Types.ObjectId;
  weekStart: Date;
  generatedAt: Date;
  schedule: IWorkoutStructure[];
}

const WeeklyWorkoutSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  generatedAt: { type: Date, default: Date.now },
  schedule: [WorkoutSchema],
});

export default mongoose.model<WeeklyWorkoutPlan>('WeeklyWorkoutPlan', WeeklyWorkoutSchema);
