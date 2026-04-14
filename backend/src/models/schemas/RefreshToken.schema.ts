import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshTokenDocument extends Document {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>({
  tokenHash: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
}, { timestamps: true });

export const RefreshTokenModel = mongoose.model<IRefreshTokenDocument>('RefreshToken', RefreshTokenSchema);
