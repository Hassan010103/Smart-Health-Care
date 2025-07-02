# API Reference: Smart Health Care Backend

---

## Authentication

### Register
- **POST** `/api/auth/register`
- **Description:** Register a new user (patient/doctor/admin)
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "patient" | "doctor" | "admin" (optional)
}
```
- **Response:**
```json
{
  "user": { "id": "string", "name": "string", "email": "string", "role": "string" },
  "token": "jwt_token"
}
```

### Login
- **POST** `/api/auth/login`
- **Description:** Login as user/admin
- **Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "user": { "id": "string", "name": "string", "email": "string", "role": "string" },
  "token": "jwt_token"
}
```

---

## Users

### Get Current User Profile
- **GET** `/api/users/me`
- **Auth:** Bearer JWT
- **Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

### Update Current User Profile
- **PUT** `/api/users/me`
- **Auth:** Bearer JWT
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Response:** `{ "message": "Profile updated" }`

### Admin: List/Search Users
- **GET** `/api/users?role=doctor|patient|admin&search=...`
- **Auth:** Bearer JWT (admin)

### Admin: Get User by ID
- **GET** `/api/users/:id`
- **Auth:** Bearer JWT (admin)

### Admin: Delete User
- **DELETE** `/api/users/:id`
- **Auth:** Bearer JWT (admin)

---

## Doctors

### List/Search Doctors
- **GET** `/api/doctors?specialty=...&search=...`
- **Public**

### Get Doctor by ID
- **GET** `/api/doctors/:id`
- **Public**

### Admin: Create Doctor
- **POST** `/api/doctors`
- **Auth:** Bearer JWT (admin)
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "specialty": "string",
  "qualifications": ["string"],
  "bio": "string",
  "availability": [{ "day": "string", "times": ["string"] }]
}
```

### Admin/Doctor: Update Doctor
- **PUT** `/api/doctors/:id`
- **Auth:** Bearer JWT (admin/doctor)

### Admin: Delete Doctor
- **DELETE** `/api/doctors/:id`
- **Auth:** Bearer JWT (admin)

### Add Doctor Review
- **POST** `/api/doctors/:id/reviews`
- **Auth:** Bearer JWT (patient, after completed appointment)
- **Request Body:**
```json
{
  "rating": 1-5,
  "comment": "string"
}
```

### Get Doctor Reviews
- **GET** `/api/doctors/:id/reviews`
- **Public**

---

## Treatments

### List/Search Treatments
- **GET** `/api/treatments?category=...&search=...`
- **Public**

### Get Treatment by ID
- **GET** `/api/treatments/:id`
- **Public**

### Admin: Create Treatment
- **POST** `/api/treatments`
- **Auth:** Bearer JWT (admin)

### Admin: Update Treatment
- **PUT** `/api/treatments/:id`
- **Auth:** Bearer JWT (admin)

### Admin: Delete Treatment
- **DELETE** `/api/treatments/:id`
- **Auth:** Bearer JWT (admin)

---

## Appointments

### Book Appointment
- **POST** `/api/appointments`
- **Auth:** Bearer JWT (patient)
- **Request Body:**
```json
{
  "doctorId": "string",
  "slot": "ISO date string"
}
```

### List Appointments
- **GET** `/api/appointments`
- **Auth:** Bearer JWT (role-based)

### Get Appointment by ID
- **GET** `/api/appointments/:id`
- **Auth:** Bearer JWT (patient/doctor/admin)

### Update Appointment
- **PUT** `/api/appointments/:id`
- **Auth:** Bearer JWT (doctor/admin)

### Cancel Appointment
- **DELETE** `/api/appointments/:id`
- **Auth:** Bearer JWT (patient/doctor/admin)

---

## Payments

### Create Payment
- **POST** `/api/payments`
- **Auth:** Bearer JWT (patient)
- **Request Body:**
```json
{
  "appointmentId": "string",
  "amount": 1000
}
```

### List Payments
- **GET** `/api/payments`
- **Auth:** Bearer JWT (role-based)

### Get Payment by ID
- **GET** `/api/payments/:id`
- **Auth:** Bearer JWT (patient/doctor/admin)

### Update Payment Status
- **PATCH** `/api/payments/:id/status`
- **Auth:** Bearer JWT (admin)
- **Request Body:**
```json
{
  "status": "completed" | "pending" | "failed"
}
```

### Create Razorpay Order
- **POST** `/api/payments/razorpay/order`
- **Auth:** Bearer JWT (patient)
- **Request Body:**
```json
{
  "amount": 1000,
  "currency": "INR"
}
```
- **Response:** Razorpay order object

---

## Chat

### Get Chat History
- **GET** `/api/chat/:appointmentId`
- **Auth:** Bearer JWT (patient/doctor/admin)

---

## Real-Time (Socket.io)

- **Connect:**
  - URL: `wss://<backend-url>`
  - Auth: `{ token: <JWT> }`
- **Events:**
  - `join`: `{ appointmentId }` — join appointment room
  - `message`: `{ appointmentId, message }` — send message
  - `signal`: `{ appointmentId, data }` — video call signaling

---

## Error Format
All errors are returned as:
```json
{ "error": "Error message" }
``` 