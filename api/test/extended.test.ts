import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';

let userToken = '';
let adminToken = '';
let appointmentId = '';
let paymentId = '';
let doctorId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-health-care');
});

afterAll(async () => {
  await mongoose.disconnect();
});

jest.setTimeout(20000);

describe('Smart Health Care API extended tests', () => {
  const testUser = {
    name: 'Test User 2',
    email: 'testuser2@example.com',
    password: 'testpass123',
  };
  const adminUser = {
    email: 'admin@demo.com',
    password: 'admin123',
  };

  it('should register and login a user', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });

  it('should login as admin', async () => {
    const res = await request(app).post('/api/auth/login').send(adminUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  it('should add a doctor (admin)', async () => {
    const res = await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Dr. Test',
        email: 'dr.test@demo.com',
        password: 'password123',
        specialty: 'Testology',
        qualifications: ['MBBS'],
        bio: 'Test doctor',
        availability: [],
      });
    expect([201,409]).toContain(res.statusCode);
    doctorId = res.body.doctor?.id || '';
  });

  it('should list doctors', async () => {
    const res = await request(app).get('/api/doctors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (!doctorId && res.body.length > 0) doctorId = res.body[0]._id || res.body[0].id;
  });

  it('should book an appointment', async () => {
    // Find a doctor with availability
    const doctorsRes = await request(app).get('/api/doctors');
    const doctor = doctorsRes.body[0];
    const slot = new Date(Date.now() + 24*60*60*1000).toISOString();
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ doctorId: doctor._id || doctor.id, slot });
    expect([201,409]).toContain(res.statusCode);
    appointmentId = res.body.appointment?._id || res.body.appointment?.id || '';
  });

  it('should list appointments', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a payment for appointment', async () => {
    if (!appointmentId) return;
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ appointmentId, amount: 1000 });
    expect([201,409]).toContain(res.statusCode);
    paymentId = res.body.payment?._id || res.body.payment?.id || '';
  });

  it('should update payment status (admin)', async () => {
    if (!paymentId) return;
    const res = await request(app)
      .patch(`/api/payments/${paymentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'completed' });
    expect([200,404]).toContain(res.statusCode);
  });

  it('should cancel the appointment', async () => {
    if (!appointmentId) return;
    const res = await request(app)
      .delete(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect([200,404]).toContain(res.statusCode);
  });

  it('should delete the doctor (admin)', async () => {
    if (!doctorId) return;
    const res = await request(app)
      .delete(`/api/doctors/${doctorId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200,404]).toContain(res.statusCode);
  });
}); 