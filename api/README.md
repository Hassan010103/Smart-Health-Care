# Smart Health Care Backend (API)

This is the backend API for the Smart Health Care application, built with Node.js, Express, TypeScript, and MongoDB.

## Features
- Modular, scalable architecture
- JWT authentication
- MongoDB (Mongoose ODM)
- RESTful API
- Logging, validation, security best practices
- Payment gateway integration (Paytm-ready)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

**Add these for Paytm integration:**
```
PAYTM_MID=your_paytm_merchant_id
PAYTM_MKEY=your_paytm_merchant_key
PAYTM_WEBSITE=WEBSTAGING
PAYTM_CALLBACK_URL=http://localhost:5000/api/payments/paytm/callback
```

### 3. Run in development
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

### 5. Start in production
```bash
npm start
```

## Scripts
- `dev`: Start server with hot reload (ts-node-dev)
- `build`: Compile TypeScript to JavaScript
- `start`: Run compiled server
- `test`: Run tests (Jest)

## Folder Structure
- `src/` - Source code
- `dist/` - Compiled output

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Server port (default: 5000)
- `PAYTM_MID` - Paytm Merchant ID
- `PAYTM_MKEY` - Paytm Merchant Key
- `PAYTM_WEBSITE` - Paytm Website (WEBSTAGING for test)
- `PAYTM_CALLBACK_URL` - Paytm callback URL

## Payment Flow (Paytm)
- Backend exposes `/api/payments/paytm/order` to create a Paytm order.
- Frontend calls this endpoint, then redirects to Paytm payment page.
- Paytm callback endpoint `/api/payments/paytm/callback` updates payment status in the database.

---

For more details, see the main project documentation. 