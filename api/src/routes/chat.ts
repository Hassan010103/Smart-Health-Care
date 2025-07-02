import { Router } from 'express';
import { getChatHistory } from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Get chat history for an appointment
router.get('/:appointmentId', authenticate, getChatHistory);

export default router; 