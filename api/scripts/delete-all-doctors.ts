import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function deleteAllDoctors() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  const result = await User.deleteMany({ role: 'doctor' });
  console.log(`Deleted ${result.deletedCount} doctors.`);
  await mongoose.disconnect();
  console.log('Done.');
}

deleteAllDoctors().catch(err => { console.error(err); process.exit(1); }); 