import { Schema, Document, model, Types } from 'mongoose';
import { Wallet } from '../../../../domain/entities/Wallet';

// Define wallet schema
const walletSchema: Schema<Wallet> = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Define wallet model
const walletModel = model<Wallet>('Wallet', walletSchema);

export  {walletModel};
