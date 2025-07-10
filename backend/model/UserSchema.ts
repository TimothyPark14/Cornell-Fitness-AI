// models/UserPreferences.ts (or whatever name is appropriate)
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreferences extends Document {
  email: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  experience: string;
  frequency: number;
  time: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  goal: { type: String, required: true },
  experience: { type: String, required: true },
  frequency: { type: Number, required: true },
  time: { type: Date, required: true },
});

export default mongoose.model<IUserPreferences>('User', UserSchema);
