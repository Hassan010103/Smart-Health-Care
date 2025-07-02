import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  specialty: string;
  qualifications: string[];
  bio: string;
  availability: { day: string; times: string[] }[];
  imageUrl?: string;
  location?: string;
  rating?: number;
  reviews?: Array<{
    patient: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    date?: Date;
  }>;
}

const ReviewSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  specialty: { type: String },
  qualifications: { type: [String], default: [] },
  bio: { type: String },
  availability: [{
    day: { type: String },
    times: [{ type: String }]
  }],
  imageUrl: { type: String },
  location: { type: String },
  rating: { type: Number, default: 4.5 },
  reviews: { type: [ReviewSchema], default: [] },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema); 