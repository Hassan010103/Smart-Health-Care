import { Router } from 'express';
import { createPayment, listPayments, getPaymentById, updatePaymentStatus, createRazorpayOrder } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Create payment (patient)
router.post('/', authenticate, createPayment);
// List payments (all roles, filtered)
router.get('/', authenticate, listPayments);
// Get payment details
router.get('/:id', authenticate, getPaymentById);
// Update payment status (admin/mock webhook)
router.patch('/:id/status', authenticate, requireRole('admin'), updatePaymentStatus);
// Create Razorpay order
router.post('/razorpay/order', authenticate, createRazorpayOrder);

export default router; 