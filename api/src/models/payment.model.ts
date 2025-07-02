import mongoose, { Document, Schema } from 'mongoose';

export type PaymentStatus = 'completed' | 'pending' | 'failed';

export interface IPayment extends Document {
  patient: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  gatewayTxnId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'pending' },
  gatewayTxnId: { type: String },
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema); 