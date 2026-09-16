# Blood Bank Management System

Complete full-stack Blood Bank Management System with inventory tracking, donations, requests, and analytics.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express.js + MongoDB (Mongoose) + JWT |
| Analytics | Python + FastAPI (stock analysis, compatibility, alerts) |

## Features

- **Roles**: Admin, Staff, Donor, Hospital
- **Blood Inventory**: Track units by blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Donations**: Record donations, auto-update stock, bag ID, expiry (42 days)
- **Eligibility**: 90-day gap between donations enforced
- **Blood Requests**: Create requests with urgency (normal/urgent/critical)
- **Fulfillment**: Staff/Admin can fulfill or reject requests (stock deducted)
- **Python Analytics**: Low-stock alerts, critical groups, priority collection
- **Blood Compatibility**: Lookup via Python service
- **Dashboard**: Real-time stock overview with color-coded alerts

## Project Structure

```
blood-bank/
├── backend/           # Express API
│   ├── models/        # User, BloodUnit, Donation, Request
│   ├── routes/        # auth, inventory, donations, requests, donors
│   ├── server.js
│   └── seed.js
├── frontend/          # React Vite SPA
│   └── src/pages/     # Dashboard, Inventory, Donations, Requests, etc.
├── python-service/    # FastAPI analytics
└── README.md
```

## Quick Start

### 1. MongoDB
```bash
mongod
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev          # http://localhost:5000
```

### 3. Python Analytics
```bash
cd python-service
pip install -r requirements.txt
python main.py       # http://localhost:8000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

## Demo Accounts

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@bloodbank.com    | admin123     |
| Staff    | staff@bloodbank.com    | staff123     |
| Donor    | ali@donor.com          | donor123     |
| Hospital | hospital@city.com      | hospital123  |

## Main Workflow

1. **Donor** registers / logs in → Record Donation
2. **Hospital** requests blood (select group + urgency)
3. **Staff/Admin** views Inventory → Fulfills pending requests
4. Dashboard shows critical/low stock alerts (Python analytics)

## API Overview

- `POST /api/auth/register` | `POST /api/auth/login`
- `GET  /api/inventory` — stock + analytics
- `POST /api/donations` — record donation
- `POST /api/requests` — create blood request
- `PUT  /api/requests/:id/process` — fulfill/reject
- `GET  /api/donors` — list/search donors

## License

MIT
# blood_bank_management_system
