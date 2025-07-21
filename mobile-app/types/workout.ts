import { DateTime } from 'luxon';

export interface Workout {
  name: string;
  set: number;
  reps: number;
};

export interface ScheduleResponse {
  title: string;
  startTime: DateTime;
  endTime: DateTime;
  location: string;
  exercises: Workout[]
};