import mongoose, { Schema, Document } from 'mongoose';
import { Notification, NotificationType } from '../../types';

export interface INotificationDocument extends Omit<Notification, 'id'>, Document {}

const NotificationSchema = new Schema<INotificationDocument>({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, default: {} },
  read: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
