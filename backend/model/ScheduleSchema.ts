// models/UserPreferences.ts (or whatever name is appropriate)
import mongoose, { Schema, Document } from 'mongoose';



export interface IUserSchedule extends Document {
  title: string,
  location: string,
  startTime: Date,
  endTime: Date
}

const UserSchedule: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

export default mongoose.model<IUserSchedule[]>('UserSchedule', UserSchedule);
