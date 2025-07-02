import { Request, Response } from 'express';
import Payment from '../models/payment.model';
import Appointment from '../models/appointment.model';
import Joi from 'joi';

const paymentSchema = Joi.object({
  appointmentId: Joi.string().required(),
  amount: Joi.number().required(),
});

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export const createPayment = async (req: any, res: Response) => {
  const { error, value } = paymentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { appointmentId, amount } = value;
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  // Only patient can pay for their own appointment
  if (req.user.role !== 'admin' && req.user.id !== appt.patient.toString()) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Mock gatewayTxnId
  const payment = new Payment({
    patient: appt.patient,
    appointment: appt._id,
    doctor: appt.doctor,
    amount,
    status: 'pending',
    gatewayTxnId: 'MOCKTXN-' + Date.now(),
  });
  await payment.save();
  res.status(201).json({ message: 'Payment initiated', payment });
};

export const listPayments = async (req: any, res: Response) => {
  const { role, id } = req.user;
  let query: any = {};
  if (role === 'patient') query.patient = id;
  else if (role === 'doctor') query.doctor = id;
  // admin: can see all, or filter by patient/doctor
  if (role === 'admin') {
    if (req.query.patient) query.patient = req.query.patient;
    if (req.query.doctor) query.doctor = req.query.doctor;
  }
  const payments = await Payment.find(query).populate('appointment').populate('doctor', 'name').populate('patient', 'name email').sort({ createdAt: -1 });
  res.json(payments);
};

export const getPaymentById = async (req: any, res: Response) => {
  const payment = await Payment.findById(req.params.id).populate('appointment').populate('doctor', 'name').populate('patient', 'name email');
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  // Only patient, doctor, or admin can view
  if (req.user.role !== 'admin' && req.user.id !== payment.patient.toString() && req.user.id !== payment.doctor.toString()) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(payment);
};

const statusSchema = Joi.object({
  status: Joi.string().valid('completed', 'pending', 'failed').required(),
});

export const updatePaymentStatus = async (req: Request, res: Response) => {
  const { error, value } = statusSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const payment = await Payment.findByIdAndUpdate(req.params.id, { status: value.status }, { new: true });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  res.json({ message: 'Payment status updated', payment });
};

// POST /api/payments/razorpay/order
export const createRazorpayOrder = async (req: any, res: Response) => {
  const Razorpay = require('razorpay');
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const { amount, currency = 'INR', receipt = 'order_rcptid_' + Date.now() } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount is required' });
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // INR to paise
      currency,
      receipt,
    });
    res.json(order);
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
}; 