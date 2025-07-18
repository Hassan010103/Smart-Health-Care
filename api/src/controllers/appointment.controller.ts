import { Request, Response } from 'express';
import Appointment from '../models/appointment.model';
import User from '../models/user.model';
import Joi from 'joi';
import mongoose from 'mongoose';

const bookSchema = Joi.object({
  doctorId: Joi.string().required(),
  slot: Joi.date().iso().required(),
});

export const bookAppointment = async (req: any, res: Response) => {
  const { error, value } = bookSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { doctorId, slot } = value;
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ error: 'Doctor not found' });

  // Check for slot conflict
  const conflict = await Appointment.findOne({ doctor: doctorId, slot: new Date(slot), status: { $in: ['pending', 'confirmed'] } });
  if (conflict) return res.status(409).json({ error: 'Slot already booked' });

  const appointment = new Appointment({
    patient: req.user.id,
    doctor: doctorId,
    slot: new Date(slot),
    status: 'pending',
  });
  await appointment.save();
  res.status(201).json({ message: 'Appointment booked', appointment });
};

export const listAppointments = async (req: any, res: Response) => {
  const { role, id } = req.user;
  let query: any = {};
  if (role === 'patient') query.patient = id;
  else if (role === 'doctor') query.doctor = id;
  // admin: can see all, or filter by patient/doctor
  if (role === 'admin') {
    if (req.query.patient) query.patient = req.query.patient;
    if (req.query.doctor) query.doctor = req.query.doctor;
  }
  const appointments = await Appointment.find(query).populate('doctor', 'name specialty').populate('patient', 'name email').sort({ slot: -1 });
  res.json(appointments);
};

export const getAppointmentById = async (req: any, res: Response) => {
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }
  const appt = await Appointment.findById(req.params.id).populate('doctor', 'name specialty').populate('patient', 'name email');
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  // TEMPORARY: Allow any logged-in user to access any appointment (for demo/testing)
  if (!req.user) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Debug logging for permission check
  const patientId = appt.patient?._id?.toString?.() || appt.patient?.toString?.() || "";
  const doctorId = appt.doctor?._id?.toString?.() || appt.doctor?.toString?.() || "";
  const userId = req.user.id;
  console.log('[PERMISSION DEBUG]', { userId, patientId, doctorId, role: req.user.role });
  // Only patient, doctor, or admin can view
  if (
    req.user.role !== 'admin' &&
    userId !== patientId &&
    userId !== doctorId
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(appt);
};

const updateSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled'),
  notes: Joi.string().allow(''),
});

export const updateAppointment = async (req: any, res: Response) => {
  const { error, value } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  // Only doctor or admin can update
  if (req.user.role !== 'admin' && req.user.id !== appt.doctor.toString()) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (value.status) appt.status = value.status;
  if (value.notes !== undefined) appt.notes = value.notes;
  await appt.save();
  res.json({ message: 'Appointment updated' });
};

export const cancelAppointment = async (req: any, res: Response) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  // Patient, doctor, or admin can cancel
  if (req.user.role !== 'admin' && req.user.id !== appt.patient.toString() && req.user.id !== appt.doctor.toString()) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  appt.status = 'cancelled';
  await appt.save();
  res.json({ message: 'Appointment cancelled' });
}; 