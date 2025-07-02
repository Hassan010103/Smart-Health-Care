import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-health-care');
});

afterAll(async () => {
  await mongoose.disconnect();
});

jest.setTimeout(20000);
import request from 'supertest';
import app from '../src/app';

describe('Smart Health Care API basic tests', () => {
  let token = '';
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpass123',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    // Accept 201 (created) or 409 (already exists)
    expect([201, 409]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.user.email).toBe(testUser.email);
    }
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should get list of doctors', async () => {
    const res = await request(app)
      .get('/api/doctors')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}); 