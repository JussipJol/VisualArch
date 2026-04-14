import mongoose, { Schema, Document } from 'mongoose';
import { Transaction, TransactionType } from '../../types';

export interface ITransactionDocument extends Omit<Transaction, 'id'>, Document {}

const TransactionSchema = new Schema<ITransactionDocument>({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['purchase', 'earn', 'spend'], required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed', required: true },
  referenceId: { type: String, index: true },
  meta: { type: Schema.Types.Mixed, default: {} },
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

// Index for getting latest history
TransactionSchema.index({ userId: 1, createdAt: -1 });

export const TransactionModel = mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);
