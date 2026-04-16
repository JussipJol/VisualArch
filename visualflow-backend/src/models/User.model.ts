import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: false, default: null },
  name: { type: String, required: true, trim: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  oauthProvider: { type: String, default: null },
  oauthId: { type: String, default: null },
  avatar: { type: String, default: null },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);