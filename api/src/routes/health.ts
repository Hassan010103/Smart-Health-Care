import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Health Care API is healthy.' });
});

export default router; 