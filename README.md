# LeadGen Pro — Lead Generation SaaS

> Automated lead generation, follow-up tracking, and conversion analytics for Indian businesses.

## Architecture

```
lead-generate/
├── backend/    → Express.js API (port 5000)
└── frontend/   → Next.js App (port 3000)
```

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open

Visit `http://localhost:3000`

## Features

- ✅ Multi-tenant SaaS architecture
- ✅ Lead capture from ads (Google, Meta, Organic)
- ✅ JWT auth with refresh tokens
- ✅ Real-time analytics & charts
- ✅ Follow-up tracking & missed lead alerts
- ✅ WhatsApp / Email notification service
- ✅ Status tracking (new → contacted → converted)
- ✅ Source-wise conversion analytics
- ✅ Business settings & notification preferences

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user + business |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/leads` | List leads (with filtering) |
| POST | `/api/leads` | Create lead |
| POST | `/api/leads/public/:businessId` | Public lead form |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| GET | `/api/leads/followups/due` | Get due follow-ups |
| GET | `/api/leads/alerts/missed` | Get missed leads |
| GET | `/api/analytics/overview` | Dashboard stats |
| GET | `/api/analytics/sources` | Source analytics |
| GET | `/api/analytics/daily` | Daily lead trends |
| GET | `/api/business` | Get business profile |
| PUT | `/api/business` | Update business |

## Tech Stack

**Backend:** Express.js, MongoDB, Mongoose, JWT, Nodemailer, Helmet, CORS  
**Frontend:** Next.js 15 (App Router), Zustand, Recharts, React Hook Form, Tailwind CSS
