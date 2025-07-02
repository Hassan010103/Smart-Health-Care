import { Router } from 'express';
import { bookAppointment, listAppointments, getAppointmentById, updateAppointment, cancelAppointment } from '../controllers/appointment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Book appointment (patient)
router.post('/', authenticate, bookAppointment);
// List appointments (all roles, filtered)
router.get('/', authenticate, listAppointments);
// Get appointment details
router.get('/:id', authenticate, getAppointmentById);
// Update appointment (doctor/admin)
router.put('/:id', authenticate, updateAppointment);
// Cancel appointment (patient/doctor/admin)
router.delete('/:id', authenticate, cancelAppointment);

export default router; 