import app from './app';
import { connectDB } from './config/db';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import ChatMessage from './models/chat.model';
import Appointment from './models/appointment.model';
import User from './models/user.model';

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  console.log('[Socket.io] Incoming connection. Token:', token);
  if (!token) {
    console.log('[Socket.io] No token provided');
    return next(new Error('No token provided'));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    (socket as any).user = decoded;
    console.log('[Socket.io] Authenticated user:', decoded);
    next();
  } catch (err) {
    console.log('[Socket.io] Invalid token:', err);
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const user = (socket as any).user;
  // Join appointment room
  socket.on('join', async ({ appointmentId }) => {
    // Check if user is part of the appointment
    const appt = await Appointment.findById(appointmentId);
    if (!appt) return socket.emit('error', 'Appointment not found');
    if (user.role !== 'admin' && user.id !== appt.patient.toString() && user.id !== appt.doctor.toString()) {
      return socket.emit('error', 'Forbidden');
    }
    socket.join(appointmentId);
  });

  // Handle chat message
  socket.on('message', async ({ appointmentId, message }) => {
    if (!message || !appointmentId) return;
    // Check if user is part of the appointment
    const appt = await Appointment.findById(appointmentId);
    if (!appt) return;
    if (user.role !== 'admin' && user.id !== appt.patient.toString() && user.id !== appt.doctor.toString()) {
      return;
    }
    // Save message
    const chatMsg = new ChatMessage({ appointment: appointmentId, sender: user.id, message });
    await chatMsg.save();
    io.to(appointmentId).emit('message', {
      appointment: appointmentId,
      sender: { id: user.id, role: user.role },
      message,
      timestamp: chatMsg.timestamp
    });
  });

  // Video call signaling
  socket.on('signal', async ({ appointmentId, data }) => {
    const appt = await Appointment.findById(appointmentId);
    if (!appt) return;
    if (user.role !== 'admin' && user.id !== appt.patient.toString() && user.id !== appt.doctor.toString()) {
      return;
    }
    socket.to(appointmentId).emit('signal', {
      from: { id: user.id, role: user.role },
      data,
    });
  });
});

io.on('connection_error', (err) => {
  console.error('[Socket.io] Connection error:', err.message);
});

(async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})(); 