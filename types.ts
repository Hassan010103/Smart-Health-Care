
export interface AvailabilitySlot {
  day: string;
  times: string[];
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  bio: string;
  qualifications: string[];
  availability: AvailabilitySlot[];
}

export type TreatmentCategory = 'Herbal' | 'Homeopathy' | 'Lifestyle' | 'Nutrition' | 'Ayurveda';

export interface Treatment {
  id: number;
  name:string;
  category: TreatmentCategory;
  description: string;
  imageUrl: string;
  benefits: string[];
  howToUse: string;
  disclaimer: string;
}

export interface PrescriptionItem {
    name: string;
    dosage: string;
    duration: string;
}

export interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  prescription?: PrescriptionItem[];
}

export type AuthModalType = 'login' | 'register';

export interface Payment {
  id: number;
  patientName: string;
  appointmentId: number;
  doctorName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export type Theme = 'light' | 'dark';