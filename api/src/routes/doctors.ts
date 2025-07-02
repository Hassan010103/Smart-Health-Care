import { Router } from 'express';
import { createDoctor, listDoctors, getDoctorById, updateDoctor, deleteDoctor, addDoctorReview, getDoctorReviews } from '../controllers/doctor.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Public: list/search doctors
router.get('/', listDoctors);
// Public: get doctor by id
router.get('/:id', getDoctorById);
// Admin: create doctor
router.post('/', authenticate, requireRole('admin'), createDoctor);
// Admin/Doctor: update doctor
router.put('/:id', authenticate, updateDoctor);
// Admin: delete doctor
router.delete('/:id', authenticate, requireRole('admin'), deleteDoctor);
// Reviews
router.post('/:id/reviews', authenticate, addDoctorReview);
router.get('/:id/reviews', getDoctorReviews);

export default router; 