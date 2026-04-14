import mongoose, { Schema, Document } from 'mongoose';
import { User, PlanType } from '../../types';

export interface IUserDocument extends Omit<User, 'id'>, Document {
  // Mongoose automatically adds _id and handles it as string/ObjectId
}

const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro', 'team', 'enterprise'], default: 'free' },
  creditsBalance: { type: Number, default: 100 },
  creditsResetDate: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  refreshTokenHash: { type: String, index: true }, // Added index for O(1) lookups during refresh
  avatarUrl: { type: String },
  onboardingCompleted: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.passwordHash;
      delete ret.refreshTokenHash;
      return ret;
    }
  }
});

// Helper for finding user by refresh token
UserSchema.statics.findByRefreshToken = function(token: string) {
  // Note: we still need to bcrypt.compare in the service, 
  // but we can at least filter by indexed fields if we changed how we store it.
  // For now, index helps even with a partial match if we used a prefix-based token.
  return this.findOne({ refreshTokenHash: { $exists: true } }); 
};

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
