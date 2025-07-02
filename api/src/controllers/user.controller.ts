import { Request, Response } from 'express';
import User from '../models/user.model';
import Joi from 'joi';
import bcrypt from 'bcrypt';

// Get current user profile
export const getMe = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

// Update current user profile
const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
});

export const updateMe = async (req: any, res: Response) => {
  const { error, value } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (value.name) user.name = value.name;
  if (value.email) user.email = value.email;
  if (value.password) user.passwordHash = value.password;
  await user.save();
  res.json({ message: 'Profile updated' });
};

// Admin: list/search users
export const listUsers = async (req: Request, res: Response) => {
  const { role, search } = req.query;
  const query: any = {};
  if (role) query.role = role;
  if (search) query.name = { $regex: search, $options: 'i' };
  const users = await User.find(query).select('-passwordHash');
  res.json(users);
};

// Admin: get user by id
export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

// Admin: delete user
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
}; 