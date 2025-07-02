import { Router } from 'express';
import { createTreatment, listTreatments, getTreatmentById, updateTreatment, deleteTreatment } from '../controllers/treatment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Public: list/search treatments
router.get('/', listTreatments);
// Public: get treatment by id
router.get('/:id', getTreatmentById);
// Admin: create treatment
router.post('/', authenticate, requireRole('admin'), createTreatment);
// Admin: update treatment
router.put('/:id', authenticate, requireRole('admin'), updateTreatment);
// Admin: delete treatment
router.delete('/:id', authenticate, requireRole('admin'), deleteTreatment);

export default router; 