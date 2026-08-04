# 🏋️ IronFit Pro — Gym Management System

![CI](https://github.com/sleepingbuild/gym-management/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

A full-stack gym management platform with membership management, trainer scheduling & PT booking, face-recognition check-in, body progress tracking, a self-trained RAG-based AI fitness chatbot, and online payments (VNPay/MoMo). Built as a course project demonstrating modern software engineering practices across 3 role-based dashboards (Admin / PT / Member).

---

## 🎯 Product Vision

**What is the product to be developed?**
IronFit Pro — a comprehensive gym management platform combining membership management, PT scheduling & booking (real working-hours based), face-recognition check-in, a self-trained AI fitness coach (RAG-based), and local payment integration (VNPay/MoMo).

**Who are the target customers and users?**
Small-to-medium gym owners/managers in Vietnam who need affordable digital management tools; gym members who want instant AI-powered fitness/nutrition advice and easy PT booking; personal trainers who need to manage their student roster and schedule.

**Why should customers buy this product?**
Lower operating cost (self-trained AI chatbot reduces reliance on paid cloud AI APIs and human consultation staff); face-recognition check-in removes the friction and spoofing risk of QR codes; local payment support (VNPay/MoMo); fast, low-cost cloud-native deployment suitable for small gyms without dedicated infrastructure.

---

## 👥 User Personas & Role Dashboards

### 🧑‍💼 Admin — Quản lý phòng gym
Full system oversight in one dashboard.
- User management (search, filter, lock/unlock, change roles, assign/cancel a member's plan)
- Revenue analytics (monthly revenue chart, membership distribution, payment history + stats)
- Membership plan management (create/edit/delete plans)
- Trainer management (add/edit/remove trainers) + trainer working-hours schedule (weekly calendar grid, recurring or specific-date shifts)
- Booking oversight (view all bookings, confirm/cancel)
- Face enrollment (register a member/PT's face on their behalf) + Face Kiosk (walk-up check-in via webcam) + Trainer check-in report

### 🏃 Member — Hội viên phòng gym
Self-service fitness management.
- Register (email verification required), buy/renew/cancel membership plans, pay via VNPay or MoMo
- AI Personal Trainer chat (fitness & nutrition Q&A, streaming responses, multiple chat sessions)
- Browse trainers and book sessions on a weekly calendar grid (only real, free working-hour slots are bookable)
- Track body progress (weight, BMI, body fat, muscle mass) with charts
- Set and track body goals
- Face check-in at the gym (webcam-based, self-service)

### 🤸 PT — Personal Trainer
Dedicated dashboard for managing students and schedule.
- View assigned students and their body-progress history
- View own weekly schedule as a calendar grid; confirm/complete/cancel a session
- Quick stats: total students, today's sessions, upcoming sessions, pending confirmations
- Face check-in (self-service, replaces the old manual check-in button)

---

## ✨ Features

### ✅ Implemented
| Feature | Chi tiết |
|---|---|
| Authentication | JWT register/login/refresh/logout, bcrypt, access (15m) + refresh (7d) token, rate limiting, mandatory email verification (Mailjet) + Terms-of-Service acceptance before login |
| Role-Based Access | ADMIN / PT / MEMBER, middleware phân quyền |
| Membership System | Multiple plans (Admin CRUD), member self-cancel, admin assign/cancel on a user's behalf, daily-only AI limits, auto-expiry tracking |
| AI Fitness Chatbot | Self-trained Qwen 2.5 1.5B (LoRA fine-tuned) with RAG over a 24-entry pgvector knowledge base (384-dim multilingual embeddings), SSE token streaming, multi-session chat history, free heuristic scope-limiting (no extra model call) |
| Trainer Scheduling | Admin defines trainer working hours (recurring weekly or specific-date shifts); Member/PT/Admin all see a shared weekly calendar grid; booking is validated against real working hours, not just slot-collision |
| PT Booking System | Member picks trainer + real available slot; PT views own schedule/students; Admin oversees all bookings |
| Trainer Management | Admin CRUD for trainer profiles (specialties, bio, status) |
| Body Progress Tracking | Weight/height/body fat/muscle mass records, auto BMI calculation, chart + stats |
| Body Goals | Set target weight/BMI/body fat/muscle, track achievement |
| Face Check-in | Face-recognition check-in for Member/PT self-service (`face-api.js`, client-side matching) and an Admin Kiosk mode; fully replaces the earlier QR check-in and manual PT check-in |
| Admin Dashboard | User management, revenue chart, membership distribution chart, booking management, trainer management, trainer working-hours management, trainer check-in report |
| Payment Gateway | VNPay (HMAC-SHA512) + MoMo (HMAC-SHA256 + IPN webhook); frontend correctly routes paid plans through the gateway instead of activating them for free |
| Notification System | In-app notifications, auto-triggered on payment/membership events |
| Caching | Redis-backed response caching (optional — app runs without it) |
| API Docs | Swagger UI at `/api/docs` |
| Automated Tests | Jest unit + integration tests (auth, membership, admin, body progress) |

### 🔜 Planned
- Run the Qwen AI service on a cloud GPU so the chatbot doesn't depend on a developer's machine + ngrok tunnel being online
- "Resend verification email" flow for expired/failed tokens
- Dedicated `MembershipStatus` value to distinguish user-cancelled vs admin-cancelled vs naturally-expired plans
- Automated tests for the newer endpoints (trainer-schedules, available-slots, admin membership edit, member cancel)
- E2E test coverage

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Backend | Node.js 20 + Express + TypeScript |
| Frontend | Next.js 16 + TailwindCSS + Zustand + Recharts |
| Database | PostgreSQL 16 + pgvector |
| ORM | Prisma v6 |
| Cache | Redis (optional, graceful fallback) |
| Authentication | JWT (access + refresh tokens) + Mailjet email verification |
| AI | Self-trained Qwen 2.5 1.5B (LoRA fine-tuned), RAG via pgvector + `paraphrase-multilingual-MiniLM-L12-v2` embeddings, FastAPI serving, SSE streaming |
| Face recognition | face-api.js (client-side) |
| Payment | VNPay + MoMo |
| Testing | Jest (unit + integration) |
| API Docs | Swagger / OpenAPI |
| Deployment | Render (backend + frontend) + Vercel (frontend) + Neon (database) |
| CI/CD | GitHub Actions |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────┐
│    Next.js 16    │────▶│   Express REST API    │────▶│  PostgreSQL 16  │
│  (Vercel/Render) │     │   (Render)             │     │  + pgvector     │
│                  │     │                        │     │  (Neon)         │
│  Admin/PT/Member │     │  JWT Auth + RBAC       │     │                 │
│  dashboards      │     │  Zod validation        │     │  Prisma ORM     │
│  Zustand store   │     │  Redis cache (opt.)    │     └─────────────────┘
│  Axios client     │     │                        │
│  face-api.js      │     │  ┌──────────────────┐  │     ┌─────────────────┐
└──────────────────┘     │  │   Qwen provider  │  │────▶│  Qwen FastAPI   │
                         │  │   (RAG + stream) │  │     │  (local + ngrok)│
                         │  └──────────────────┘  │     └─────────────────┘
                         └────────────────────────┘
```

See [ARCHITECTURE.MD](./ARCHITECTURE.MD) for full DB schema, API standards, and design decisions.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ with pgvector extension
- Redis (optional)
- A self-trained Qwen model to serve the AI chatbot (see [ai-service/README.md](./ai-service/README.md)) — the chatbot degrades gracefully if this isn't running

### Backend Setup
```bash
git clone https://github.com/sleepingbuild/gym-management.git
cd gym-management/backend
cp .env.example .env        # fill in DB URL, JWT secrets, Mailjet key, VNPay/MoMo keys
npm install
npx prisma migrate deploy
npx prisma db seed
npx tsx prisma/seed-knowledge.ts   # seed AI knowledge base (Qwen RAG)
npm run dev
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL
npm install
npm run dev
```

### Run Tests
```bash
cd backend
npm test
```

### Optional — Self-trained AI (Qwen)
```bash
cd ai-service
python -m venv venv && venv\Scripts\activate   # Windows
pip install -r requirements.txt
python serve.py   # FastAPI on :5000
```
Set `QWEN_API_URL` in backend `.env` to your local URL or a public tunnel (e.g. an ngrok static domain) if the backend is deployed remotely. See [ai-service/README.md](./ai-service/README.md) for training instructions.

---

## 📚 API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/verify-email
```

### Membership
```http
GET   /api/memberships/plans
POST  /api/memberships/buy
GET   /api/memberships/current
PATCH /api/memberships/cancel
```

### AI Chat
```http
POST /api/ai/chat
POST /api/ai/chat/stream
GET  /api/ai/history
GET  /api/ai/usage
GET  /api/ai/sessions
```

### Body Progress
```http
POST   /api/body-progress
GET    /api/body-progress
GET    /api/body-progress/latest
GET    /api/body-progress/chart
GET    /api/body-progress/stats
PUT    /api/body-progress/:id
DELETE /api/body-progress/:id
```

### Body Goals
```http
POST   /api/body-goal
GET    /api/body-goal/current
PUT    /api/body-goal
GET    /api/body-goal/check-achievement
DELETE /api/body-goal
```

### Face Check-in
```http
GET    /api/face/me
GET    /api/face/enrollable-users        # Admin
POST   /api/face/enroll                  # Admin
GET    /api/face/profiles                # Admin
DELETE /api/face/:userId                 # Admin
POST   /api/face-attendance/checkin        # Admin (Kiosk)
POST   /api/face-attendance/checkin/self   # PT, Member
```

### Bookings (Member)
```http
GET   /api/bookings/trainers
GET   /api/bookings/trainers/:trainerId/available-slots
POST  /api/bookings
GET   /api/bookings/my
PATCH /api/bookings/:id/cancel
```

### PT
```http
GET   /api/pt/dashboard
GET   /api/pt/students
GET   /api/pt/clients
GET   /api/pt/clients/progress
GET   /api/pt/bookings
PATCH /api/pt/bookings/:id/status
GET   /api/pt/stats
```

### Admin
```http
GET    /api/admin/users
GET    /api/admin/stats
PATCH  /api/admin/users/:id/toggle-active
PATCH  /api/admin/users/:id/role
PATCH  /api/admin/users/:id/membership
GET    /api/admin/revenue
GET    /api/admin/memberships/distribution
GET    /api/admin/memberships
POST   /api/admin/memberships
PUT    /api/admin/memberships/:id
PATCH  /api/admin/memberships/:id/toggle-active
DELETE /api/admin/memberships/:id
GET    /api/admin/trainers
POST   /api/admin/trainers
PUT    /api/admin/trainers/:id
DELETE /api/admin/trainers/:id
GET    /api/admin/trainer-schedules
POST   /api/admin/trainer-schedules
PUT    /api/admin/trainer-schedules/:id
DELETE /api/admin/trainer-schedules/:id
GET    /api/admin/bookings
PATCH  /api/admin/bookings/:id/status
GET    /api/admin/payments
GET    /api/admin/trainer-checkins
POST   /api/admin/trainer-checkins
DELETE /api/admin/trainer-checkins/:id
```

### Payment
```http
POST /api/payments/create
GET  /api/payments/history
GET  /api/payments/vnpay-return
POST /api/payments/momo-webhook
```

### Notification
```http
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

### Ops
```http
GET /api/health      # DB connectivity + uptime
GET /api/docs         # Swagger UI
```

---

## 🔒 Security
- JWT Authentication (access + refresh tokens)
- Password hashing (bcrypt)
- Role-Based Access Control (RBAC): ADMIN / PT / MEMBER
- Mandatory email verification before login
- Input validation (Zod)
- Rate limiting on auth endpoints
- HTTPS in production
- Environment variables (never hardcoded)

---

## 📦 Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel / Render |
| Backend | Render |
| Database | Neon (PostgreSQL + pgvector) |
| Cache (optional) | Redis |
| Email | Mailjet |
| CI/CD | GitHub Actions |

> The AI chatbot's Qwen model runs on a developer's local machine tunneled via ngrok — the chatbot is only available while that machine, `serve.py`, and the tunnel are running. See "Planned" above.

---

## 📖 Documentation

| File | Mô tả |
|---|---|
| [ARCHITECTURE.MD](./ARCHITECTURE.MD) | System architecture, DB schema, API standards |
| [ROADMAP.md](./ROADMAP.md) | Development plan and phases |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Current progress tracking |
| [RELEASE_EVIDENCE.md](./RELEASE_EVIDENCE.md) | Live verification evidence for the current release |
| [ai-service/README.md](./ai-service/README.md) | Self-trained Qwen model: training + serving |

---

## 📄 License

MIT License — see [LICENSE](./LICENSE)