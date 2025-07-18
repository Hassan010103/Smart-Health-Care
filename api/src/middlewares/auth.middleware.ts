import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log('[AUTH MIDDLEWARE] Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[AUTH MIDDLEWARE] No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded;
    console.log('[AUTH MIDDLEWARE] Token valid, user:', decoded);
    next();
  } catch (err) {
    console.log('[AUTH MIDDLEWARE] Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }
}; 