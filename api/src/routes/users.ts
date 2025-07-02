import { Router } from 'express';
import { getMe, updateMe, listUsers, getUserById, deleteUser } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// User profile
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

// Admin user management
router.get('/', authenticate, requireRole('admin'), listUsers);
router.get('/:id', authenticate, requireRole('admin'), getUserById);
router.delete('/:id', authenticate, requireRole('admin'), deleteUser);

export default router; 