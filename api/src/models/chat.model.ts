import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  appointment: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 