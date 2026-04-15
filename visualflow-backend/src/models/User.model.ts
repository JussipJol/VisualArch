import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
}, { timestamps: true });

// Email is already unique and indexed via the field definition

export const User = mongoose.model<IUser>('User', UserSchema);
