import { Request, Response } from 'express';
import ChatMessage from '../models/chat.model';
import Appointment from '../models/appointment.model';

export const getChatHistory = async (req: any, res: Response) => {
  const { id: userId, role } = req.user;
  const { appointmentId } = req.params;
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  // Only patient, doctor, or admin can view
  if (role !== 'admin' && userId !== appt.patient.toString() && userId !== appt.doctor.toString()) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const messages = await ChatMessage.find({ appointment: appointmentId }).populate('sender', 'name role').sort({ timestamp: 1 });
  res.json(messages);
}; 