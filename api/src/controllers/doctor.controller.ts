import { Request, Response } from 'express';
import User from '../models/user.model';
import Joi from 'joi';
import Appointment from '../models/appointment.model';

const doctorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  specialty: Joi.string().required(),
  qualifications: Joi.array().items(Joi.string()),
  bio: Joi.string().allow(''),
  availability: Joi.array().items(
    Joi.object({
      day: Joi.string().required(),
      times: Joi.array().items(Joi.string()).required()
    })
  ),
});

export const createDoctor = async (req: Request, res: Response) => {
  const { error, value } = doctorSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password, specialty, qualifications, bio, availability } = value;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const doctor = new User({
    name,
    email,
    passwordHash: password,
    role: 'doctor',
    specialty,
    qualifications,
    bio,
    availability,
  });
  await doctor.save();
  res.status(201).json({ message: 'Doctor created', doctor: { id: doctor._id, name: doctor.name, email: doctor.email, specialty: doctor.specialty } });
};

export const listDoctors = async (req: Request, res: Response) => {
  const { specialty, search } = req.query;
  const query: any = { role: 'doctor' };
  if (specialty) query.specialty = { $regex: specialty, $options: 'i' };
  if (search) query.name = { $regex: search, $options: 'i' };
  const doctors = await User.find(query).select('-passwordHash -email');
  res.json(doctors);
};

export const getDoctorById = async (req: Request, res: Response) => {
  const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' }).select('-passwordHash -email');
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doctor);
};

export const updateDoctor = async (req: any, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user || user.role !== 'doctor') return res.status(404).json({ error: 'Doctor not found' });
  // Only admin or the doctor themselves can update
  if (req.user.role !== 'admin' && req.user.id !== id) return res.status(403).json({ error: 'Forbidden' });

  const { specialty, qualifications, bio, availability, name } = req.body;
  if (name) user.name = name;
  if (specialty) user.specialty = specialty;
  if (qualifications) user.qualifications = qualifications;
  if (bio) user.bio = bio;
  if (availability) user.availability = availability;
  await user.save();
  res.json({ message: 'Doctor updated' });
};

export const deleteDoctor = async (req: Request, res: Response) => {
  const doctor = await User.findOneAndDelete({ _id: req.params.id, role: 'doctor' });
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ message: 'Doctor deleted' });
};

// POST /api/doctors/:id/reviews
export const addDoctorReview = async (req: any, res: Response) => {
  const doctorId = req.params.id;
  const { rating, comment } = req.body;
  // Only patients with a completed appointment can review
  const completed = await Appointment.findOne({ doctor: doctorId, patient: req.user.id, status: 'completed' });
  if (!completed) return res.status(403).json({ error: 'You can only review after a completed appointment.' });
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ error: 'Doctor not found' });
  // Defensive: ensure reviews is always an array
  const reviewsArray = Array.isArray(doctor.reviews) ? doctor.reviews : [];
  if (reviewsArray.some((r: any) => r.patient.toString() === req.user.id && r.date && new Date(r.date).toDateString() === new Date().toDateString())) {
    return res.status(409).json({ error: 'You have already reviewed this doctor today.' });
  }
  reviewsArray.push({ patient: req.user.id, rating, comment });
  // Optionally update average rating
  doctor.rating = reviewsArray.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsArray.length;
  doctor.reviews = reviewsArray;
  await doctor.save();
  res.status(201).json({ message: 'Review added' });
};

// GET /api/doctors/:id/reviews
export const getDoctorReviews = async (req: Request, res: Response) => {
  const doctor = await User.findById(req.params.id).populate('reviews.patient', 'name');
  if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ error: 'Doctor not found' });
  res.json(doctor.reviews);
}; 