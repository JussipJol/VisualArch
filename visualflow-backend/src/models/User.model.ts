import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: false, default: null },
  name: { type: String, required: true, trim: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  oauthAccounts: {
    type: [{
      provider: { type: String, enum: ['github', 'google', 'discord'], required: true },
      id:       { type: String, required: true },
    }],
    default: [],
  },
  avatar: { type: String, default: null },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);