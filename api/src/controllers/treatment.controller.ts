import { Request, Response } from 'express';
import Treatment from '../models/treatment.model';
import Joi from 'joi';

const treatmentSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().allow(''),
  imageUrl: Joi.string().uri().allow(''),
  benefits: Joi.array().items(Joi.string()),
  howToUse: Joi.string().allow(''),
  disclaimer: Joi.string().allow(''),
});

export const createTreatment = async (req: Request, res: Response) => {
  const { error, value } = treatmentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const treatment = new Treatment(value);
  await treatment.save();
  res.status(201).json({ message: 'Treatment created', treatment });
};

export const listTreatments = async (req: Request, res: Response) => {
  const { category, search } = req.query;
  const query: any = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  const treatments = await Treatment.find(query);
  res.json(treatments);
};

export const getTreatmentById = async (req: Request, res: Response) => {
  const treatment = await Treatment.findById(req.params.id);
  if (!treatment) return res.status(404).json({ error: 'Treatment not found' });
  res.json(treatment);
};

export const updateTreatment = async (req: Request, res: Response) => {
  const { error, value } = treatmentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const treatment = await Treatment.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!treatment) return res.status(404).json({ error: 'Treatment not found' });
  res.json({ message: 'Treatment updated', treatment });
};

export const deleteTreatment = async (req: Request, res: Response) => {
  const treatment = await Treatment.findByIdAndDelete(req.params.id);
  if (!treatment) return res.status(404).json({ error: 'Treatment not found' });
  res.json({ message: 'Treatment deleted' });
}; 