# Smart Health Care Backend (API)

A robust backend API for the Smart Health Care application, built with Node.js, Express, TypeScript, and MongoDB. This API powers user and admin authentication, doctor and treatment management, appointment booking, online payments, real-time chat/video, and more.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security & Best Practices](#security--best-practices)
- [API Endpoints](#api-endpoints)
- [Payment Flow](#payment-flow)
- [Contributing](#contributing)

---

## Features
- **JWT Authentication** for users and admins
- **RESTful API** for all core resources (users, doctors, treatments, appointments, payments, chat)
- **MongoDB** with Mongoose ODM
- **Admin panel** endpoints for managing doctors, treatments, and payments
- **Online payments** via Razorpay (test mode) and Paytm-ready
- **Real-time chat and video** using Socket.io (with JWT auth)
- **Robust error handling** and input validation (Joi)
- **Logging** with Winston
- **Modular, scalable codebase** (TypeScript)
- **Automated tests** (Jest, Supertest)
- **Defensive coding** and security best practices

---

## Tech Stack
- **Node.js** 18+
- **Express** (REST API)
- **TypeScript**
- **MongoDB** (Mongoose ODM)
- **Socket.io** (real-time chat/video)
- **Razorpay** (payments)
- **Joi** (validation)
- **Winston** (logging)
- **Jest, Supertest** (testing)

---

## Setup & Installation

### 1. Install dependencies
```bash
cd api
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

**Example `.env` file:**
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Seed the database (optional)
```bash
npm run dev
# In another terminal:
npx ts-node scripts/seed-mock-data.ts
```

---

## Environment Variables
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing
- `PORT` — Server port (default: 5000)
- `RAZORPAY_KEY_ID` — Razorpay API key (test mode)
- `RAZORPAY_KEY_SECRET` — Razorpay API secret (test mode)

---

## Scripts
- `dev`: Start server with hot reload (ts-node-dev)
- `build`: Compile TypeScript to JavaScript
- `start`: Run compiled server (`node dist/src/server.js`)
- `test`: Run tests (Jest)
- `postinstall`: Automatically build after install (for deployment)

---

## Folder Structure
- `src/` — Main source code (controllers, models, routes, middlewares)
- `scripts/` — Utility scripts (seed, delete, etc.)
- `test/` — Automated tests (Jest, Supertest)
- `dist/` — Compiled output (ignored in git)

---

## Testing

- **Run all tests:**
  ```bash
  npm test
  ```
- **Test coverage:**
  ```bash
  npm test -- --coverage
  ```
- **Test cases:** See [../docs/test-cases.md](../docs/test-cases.md)

---

## Deployment

- Deploy to [Render](https://render.com/), [Railway](https://railway.app/), [Heroku](https://heroku.com/), or any Node.js host.
- **Root directory:** `api`
- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Environment variables:** Set as per `.env.example`
- **CORS:** Ensure your frontend domain is allowed in production.

---

## Security & Best Practices
- **Never commit secrets:** `.env` is in `.gitignore`.
- **JWT authentication:** All protected routes require a valid token.
- **CORS:** Only allow your frontend domain in production.
- **Input validation:** All user input is validated (Joi).
- **Error handling:** Robust error handling throughout.
- **Logging:** Winston for backend logs.
- **Production:** Use strong secrets, HTTPS, and secure deployment.

---

## API Endpoints

See [../README.md](../README.md#api-endpoints) or [../docs/api.md](../docs/api.md) for full details.

**Examples:**
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login (user/admin)
- `GET /api/doctors` — List/search doctors
- `POST /api/appointments` — Book appointment
- `POST /api/payments/razorpay/order` — Create Razorpay order
- `GET /api/chat/:appointmentId` — Get chat history
- `Socket.io` — Real-time chat/video (see server code)

---

## Payment Flow (Razorpay)
- Backend exposes `/api/payments/razorpay/order` to create a Razorpay order.
- Frontend calls this endpoint, then opens Razorpay checkout.
- On success, payment status is updated in the database.
