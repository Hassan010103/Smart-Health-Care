import mongoose, { Document, Schema } from 'mongoose';

export interface ITreatment extends Document {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  benefits: string[];
  howToUse: string;
  disclaimer: string;
  createdAt: Date;
  updatedAt: Date;
}

const TreatmentSchema = new Schema<ITreatment>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  benefits: { type: [String], default: [] },
  howToUse: { type: String },
  disclaimer: { type: String },
}, { timestamps: true });

export default mongoose.model<ITreatment>('Treatment', TreatmentSchema); 