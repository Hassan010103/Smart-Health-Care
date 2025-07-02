// This script seeds mock doctors and treatments from the frontend into the database.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model';
import Treatment from '../src/models/treatment.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';
const DEFAULT_PASSWORD = 'password123';

const mockDoctors = [
  {
    name: 'Dr. Aarav Sharma',
    email: 'aarav.sharma@demo.com',
    passwordHash: DEFAULT_PASSWORD,
    role: 'doctor',
    specialty: 'Cardiologist',
    qualifications: ['MBBS, MD (Cardiology)', 'Fellowship in Interventional Cardiology (USA)'],
    bio: 'Dr. Aarav Sharma is a leading cardiologist with over 15 years of experience in treating complex heart conditions. He is known for his patient-centric approach and dedication to cardiac wellness.',
    availability: [
      { day: 'Mon', times: ['10:00 AM', '02:00 PM'] },
      { day: 'Wed', times: ['09:00 AM', '11:00 AM', '03:00 PM'] },
      { day: 'Fri', times: ['10:00 AM', '02:00 PM'] },
    ],
    imageUrl: 'https://placehold.co/400x400/06b6d4/white?text=Dr.+Aarav+S.',
    location: 'Mumbai, MH',
    rating: 4.9,
    reviews: 142,
  },
  {
    name: 'Dr. Priya Patel',
    email: 'priya.patel@demo.com',
    passwordHash: DEFAULT_PASSWORD,
    role: 'doctor',
    specialty: 'Dermatologist',
    qualifications: ['MBBS, MD (Dermatology)', 'Diploma in Aesthetic Medicine'],
    bio: 'Dr. Priya Patel specializes in cosmetic dermatology and skin wellness. She is passionate about helping patients achieve healthy, radiant skin through personalized treatment plans.',
    availability: [
      { day: 'Tue', times: ['11:00 AM', '03:00 PM'] },
      { day: 'Thu', times: ['10:00 AM', '12:00 PM', '04:00 PM'] },
      { day: 'Sat', times: ['09:00 AM', '11:00 AM'] },
    ],
    imageUrl: 'https://placehold.co/400x400/06b6d4/white?text=Dr.+Priya+P.',
    location: 'Delhi, DL',
    rating: 4.8,
    reviews: 98,
  },
  {
    name: 'Dr. Rohan Mehta',
    email: 'rohan.mehta@demo.com',
    passwordHash: DEFAULT_PASSWORD,
    role: 'doctor',
    specialty: 'Pediatrician',
    qualifications: ['MBBS, DNB (Paediatrics)', 'Member of Indian Academy of Pediatrics'],
    bio: 'With a friendly and gentle approach, Dr. Rohan Mehta is a trusted pediatrician who provides comprehensive care for children from infancy through adolescence.',
    availability: [
      { day: 'Mon', times: ['09:00 AM', '12:00 PM', '05:00 PM'] },
      { day: 'Tue', times: ['09:00 AM', '12:00 PM'] },
      { day: 'Thu', times: ['09:00 AM', '12:00 PM'] },
      { day: 'Fri', times: ['02:00 PM', '05:00 PM'] },
    ],
    imageUrl: 'https://placehold.co/400x400/06b6d4/white?text=Dr.+Rohan+M.',
    location: 'Bengaluru, KA',
    rating: 5.0,
    reviews: 210,
  },
  {
    name: 'Dr. Ananya Iyer',
    email: 'ananya.iyer@demo.com',
    passwordHash: DEFAULT_PASSWORD,
    role: 'doctor',
    specialty: 'Neurologist',
    qualifications: ['MBBS, DM (Neurology)', 'PhD in Neuroscience'],
    bio: 'Dr. Ananya Iyer is an expert in diagnosing and treating neurological disorders. She is dedicated to advancing patient care through research and clinical practice.',
    availability: [
      { day: 'Tue', times: ['02:00 PM', '05:00 PM'] },
      { day: 'Wed', times: ['10:00 AM', '01:00 PM'] },
    ],
    imageUrl: 'https://placehold.co/400x400/06b6d4/white?text=Dr.+Ananya+I.',
    location: 'Chennai, TN',
    rating: 4.7,
    reviews: 76,
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@demo.com',
    passwordHash: DEFAULT_PASSWORD,
    role: 'doctor',
    specialty: 'General Practitioner',
    qualifications: ['MBBS, MRCGP (UK)', 'Certified in Family Medicine'],
    bio: 'Dr. Vikram Singh is a highly experienced General Practitioner, providing holistic primary care for families and individuals. He focuses on preventive health and long-term patient relationships.',
    availability: [
      { day: 'Mon', times: ['09:00 AM', '01:00 PM', '03:00 PM'] },
      { day: 'Tue', times: ['09:00 AM', '01:00 PM'] },
      { day: 'Wed', times: ['09:00 AM', '01:00 PM'] },
      { day: 'Thu', times: ['09:00 AM', '01:00 PM'] },
      { day: 'Fri', times: ['09:00 AM', '01:00 PM'] },
    ],
    imageUrl: 'https://placehold.co/400x400/06b6d4/white?text=Dr.+Vikram+S.',
    location: 'Hyderabad, TG',
    rating: 4.9,
    reviews: 188,
  },
  {
    name: 'Dr. Sunita Rao',
    email: 'sunita.rao@demo.com',
    passwordHash: DEFAULT_PASSWORD,
    role: 'doctor',
    specialty: 'Orthopedist',
    qualifications: ['MS (Orthopaedics)', 'Fellowship in Arthroscopy & Sports Medicine'],
    bio: 'Dr. Sunita Rao specializes in sports injuries and joint replacement surgery. She combines modern surgical techniques with compassionate care to restore mobility for her patients.',
    availability: [
      { day: 'Mon', times: ['11:00 AM'] },
      { day: 'Wed', times: ['11:00 AM', '04:00 PM'] },
      { day: 'Fri', times: ['11:00 AM'] },
    ],
    imageUrl: 'https://placehold.co/400x400/06b6d4/white?text=Dr.+Sunita+R.',
    location: 'Pune, MH',
    rating: 4.8,
    reviews: 112,
  },
];

const mockTreatments = [
  { name: 'Tulsi (Holy Basil) Tea', category: 'Herbal', description: 'A traditional Ayurvedic tea known for boosting immunity and reducing stress.', imageUrl: 'https://placehold.co/400x300/0891b2/white?text=Tulsi+Tea', benefits: ['Boosts Immunity', 'Reduces Stress and Anxiety', 'Rich in Antioxidants', 'Improves Respiratory Health'], howToUse: 'Boil a few fresh or dried Tulsi leaves in water for 5-10 minutes. Strain and drink warm. Can be consumed 1-2 times a day.', disclaimer: 'Generally safe, but pregnant women should consult a doctor before regular consumption.' },
  { name: 'Yoga Asanas for Stress', category: 'Lifestyle', description: 'Specific yoga postures to help calm the mind and relieve physical tension.', imageUrl: 'https://placehold.co/400x300/0891b2/white?text=Yoga+Asanas', benefits: ['Calms the Nervous System', 'Improves Flexibility', 'Enhances Mind-Body Connection', 'Promotes Relaxation'], howToUse: 'Practice poses like Balasana (Child\'s Pose), Marjaryasana-Bitilasana (Cat-Cow Pose), and Savasana (Corpse Pose) for 5-10 minutes daily. Focus on deep, steady breathing.', disclaimer: 'Consult a qualified yoga instructor, especially if you have pre-existing injuries or health conditions.' },
  { name: 'Turmeric Paste for Inflammation', category: 'Herbal', description: 'A natural anti-inflammatory remedy made from turmeric (haldi) for minor sprains and swelling.', imageUrl: 'https://placehold.co/400x300/0891b2/white?text=Turmeric+Paste', benefits: ['Natural Anti-inflammatory', 'Reduces Swelling and Pain', 'Antiseptic Properties', 'Improves Skin Health'], howToUse: 'Mix turmeric powder with a small amount of water or coconut oil to form a thick paste. Apply gently to the affected area, leave for 20-30 minutes, then rinse. Avoid on open wounds.', disclaimer: 'May cause temporary yellow staining on the skin. Do not use on broken skin.' },
  { name: 'Balanced Indian Thali', category: 'Nutrition', description: 'A complete meal providing a balance of proteins, carbs, fats, and vitamins as per Indian dietary principles.', imageUrl: 'https://placehold.co/400x300/0891b2/white?text=Indian+Thali', benefits: ['Provides Macro and Micro Nutrients', 'Promotes Healthy Digestion', 'Variety in Diet', 'Culturally Nourishing'], howToUse: 'Include a portion of dal (lentils), sabzi (vegetables), roti/rice (carbohydrates), dahi (yogurt), and a small salad in your main meals.', disclaimer: 'Portion sizes should be adjusted based on individual dietary needs and activity levels.' },
  { name: 'Ashwagandha for Relaxation', category: 'Ayurveda', description: 'An ancient medicinal herb used to manage stress, improve sleep, and boost energy levels.', imageUrl: 'https://placehold.co/400x300/0891b2/white?text=Ashwagandha', benefits: ['Adaptogenic (Helps Body Manage Stress)', 'Improves Sleep Quality', 'Boosts Cognitive Function', 'Enhances Vitality'], howToUse: 'Typically available as a powder or capsule. A common dosage is 1/2 teaspoon of powder mixed with warm milk or honey before bed.', disclaimer: 'Consult an Ayurvedic practitioner for proper dosage and to ensure it doesn\'t interfere with other medications.' },
  { name: 'Pranayama Breathing', category: 'Lifestyle', description: 'Controlled breathing exercises to improve respiratory health and achieve a calm mental state.', imageUrl: 'https://placehold.co/400x300/0891b2/white?text=Pranayama', benefits: ['Reduces Anxiety', 'Improves Lung Capacity', 'Lowers Blood Pressure', 'Increases Mental Clarity'], howToUse: 'Practice techniques like Anulom Vilom (Alternate Nostril Breathing) or Bhramari (Humming Bee Breath) for 5-10 minutes daily in a quiet, comfortable space.', disclaimer: 'Learn from a certified instructor. Certain techniques may not be suitable for individuals with specific health conditions.' },
];

const mockAdmin = {
  name: 'Admin User',
  email: 'admin@demo.com',
  password: 'admin123',
  role: 'admin',
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Seed admin
  const adminExists = await User.findOne({ email: mockAdmin.email });
  if (!adminExists) {
    await new User(mockAdmin).save();
    console.log('Inserted admin user');
  } else {
    console.log('Admin user already exists, skipping.');
  }

  // Seed doctors
  for (const doc of mockDoctors) {
    const exists = await User.findOne({ email: doc.email });
    if (exists) {
      console.log(`Doctor ${doc.name} already exists, skipping.`);
      continue;
    }
    await new User(doc).save();
    console.log(`Inserted doctor: ${doc.name}`);
  }

  // Seed treatments
  for (const t of mockTreatments) {
    const exists = await Treatment.findOne({ name: t.name });
    if (exists) {
      console.log(`Treatment ${t.name} already exists, skipping.`);
      continue;
    }
    await new Treatment(t).save();
    console.log(`Inserted treatment: ${t.name}`);
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch(err => { console.error(err); process.exit(1); }); 