# 🏋️ IronFit Pro — Gym Management System

![CI](https://github.com/sleepingbuild/gym-management/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/version-0.2.0-orange)

A full-stack gym management platform with membership management, PT booking, body progress tracking, QR check-in, AI-powered fitness coaching (dual provider: Gemini RAG + self-trained Qwen), and online payments. Built as a course project demonstrating modern software engineering practices across 3 role-based dashboards (Admin / PT / Member).

---

## 🎯 Product Vision

**What is the product to be developed?**
IronFit Pro — a comprehensive gym management platform combining membership management, PT booking & scheduling, AI-powered fitness coaching (RAG-based, with a self-trained fallback), and local payment integration (VNPay/MoMo).

**Who are the target customers and users?**
Small-to-medium gym owners/managers in Vietnam who need affordable digital management tools; gym members who want instant AI-powered fitness/nutrition advice and easy PT booking; personal trainers who need to manage their student roster and schedule.

**Why should customers buy this product?**
Lower operating cost (AI chatbot reduces reliance on human consultation staff); reduced vendor lock-in (dual AI provider — cloud Gemini or self-trained Qwen running locally — gives flexibility between cost, latency, and data privacy); local payment support (VNPay/MoMo); fast, low-cost cloud-native deployment suitable for small gyms without dedicated infrastructure.

---

## 👥 User Personas & Role Dashboards

### 🧑‍💼 Admin — Quản lý phòng gym
Full system oversight in one dashboard.
- User management (search, filter, lock/unlock, change roles)
- Revenue analytics (monthly revenue chart, membership distribution)
- Membership plan management (create/edit/delete plans)
- Trainer management (add/edit/remove trainers)
- Booking oversight (view all bookings, confirm/cancel)

### 🏃 Member — Hội viên phòng gym
Self-service fitness management.
- Register, buy/renew membership plans
- AI Personal Trainer chat (fitness & nutrition Q&A)
- Book sessions with a trainer (choose trainer + time slot, view/cancel bookings)
- Track body progress (weight, BMI, body fat, muscle mass) with charts
- Set and track body goals
- QR check-in / check-out at the gym

### 🤸 PT — Personal Trainer
Dedicated dashboard for managing students and schedule.
- View assigned students (derived from confirmed/completed bookings)
- View own booking schedule and today's sessions
- Quick stats: total students, today's bookings, pending confirmations

---

## ✨ Features

### ✅ Implemented
| Feature | Chi tiết |
|---|---|
| Authentication | JWT register/login/refresh/logout, bcrypt, access (15m) + refresh (7d) token, rate limiting |
| Role-Based Access | ADMIN / PT / MEMBER, middleware phân quyền |
| Membership System | Multiple plans (Admin CRUD), daily-only AI limits, auto-expiry tracking |
| AI Fitness Chatbot | Dual provider — Gemini RAG (pgvector + gemini-embedding-001 + Gemini 2.0 Flash) or self-trained Qwen 2.5 1.5B (LoRA fine-tuned, local FastAPI) via `AI_PROVIDER` env switch |
| PT Booking System | Member picks trainer + time slot; PT views own schedule/students; Admin oversees all bookings |
| Trainer Management | Admin CRUD for trainer profiles (specialties, bio, status) |
| Body Progress Tracking | Weight/height/body fat/muscle mass records, auto BMI calculation, chart + stats |
| Body Goals | Set target weight/BMI/body fat/muscle, track achievement |
| QR Check-in/Check-out | Generate QR, check in/out, attendance history + stats |
| Admin Dashboard | User management, revenue chart, membership distribution chart, booking management, trainer management |
| Payment Gateway | VNPay (HMAC-SHA512) + MoMo (HMAC-SHA256 + IPN webhook) |
| Notification System | In-app notifications, auto-triggered on payment/membership events |
| Caching | Redis-backed response caching (optional — app runs without it) |
| API Docs | Swagger UI at `/api/docs` |
| Automated Tests | Jest unit + integration tests (auth, membership, admin, body progress) |

### 🔜 Planned
- PT-initiated booking confirmation flow refinements
- Trainer availability calendar (avoid manual time-slot conflicts beyond same-slot check)
- Push notifications for goal achievement
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
| Authentication | JWT (access + refresh tokens) |
| AI | Gemini 2.0 Flash + gemini-embedding-001 (RAG) **or** self-trained Qwen 2.5 1.5B (LoRA, FastAPI) |
| Payment | VNPay + MoMo |
| Testing | Jest (unit + integration) |
| API Docs | Swagger / OpenAPI |
| Deployment | Render (backend) + Vercel (frontend) + Neon (database) |
| CI/CD | GitHub Actions |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────┐
│    Next.js 16    │────▶│   Express REST API    │────▶│  PostgreSQL 16  │
│   (Vercel)       │     │   (Render)             │     │  + pgvector     │
│                  │     │                        │     │  (Neon)         │
│  Admin/PT/Member │     │  JWT Auth + RBAC       │     │                 │
│  dashboards      │     │  Zod validation        │     │  Prisma ORM     │
│  Zustand store   │     │  Redis cache (opt.)    │     └─────────────────┘
│  Axios client     │     │                        │
└──────────────────┘     │  ┌──────────────────┐  │     ┌─────────────────┐
                         │  │   AI Provider    │  │────▶│  Gemini API     │
                         │  │   (switchable)   │  │     │  or Qwen FastAPI│
                         │  └──────────────────┘  │     │  (local/tunnel) │
                         └────────────────────────┘     └─────────────────┘
```

See [ARCHITECTURE.MD](./ARCHITECTURE.MD) for full DB schema, API standards, and design decisions.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ with pgvector extension
- Redis (optional)
- Gemini API key (or a self-trained Qwen model — see [ai-service/README.md](./ai-service/README.md))

### Backend Setup
```bash
git clone https://github.com/sleepingbuild/gym-management.git
cd gym-management/backend
cp .env.example .env        # fill in API keys, DB URL
npm install
npx prisma migrate deploy
npx prisma db seed
npx tsx prisma/seed-knowledge.ts   # seed AI knowledge base (Gemini RAG)
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
Set `AI_PROVIDER=qwen` and `QWEN_API_URL=https://selection-gala-hassle.ngrok-free.dev` in backend `.env`. See [ai-service/README.md](./ai-service/README.md) for training instructions.

---

## 📚 API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Membership
```http
GET  /api/memberships/plans
POST /api/memberships/buy
GET  /api/memberships/current
```

### AI Chat
```http
POST /api/ai/chat
GET  /api/ai/history
GET  /api/ai/usage
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

### Attendance (QR Check-in)
```http
GET  /api/attendance/qr
POST /api/attendance/check-in
POST /api/attendance/check-out
GET  /api/attendance/history
GET  /api/attendance/stats
```

### Bookings (Member)
```http
GET   /api/bookings/trainers
POST  /api/bookings
GET   /api/bookings/my
PATCH /api/bookings/:id/cancel
```

### PT
```http
GET /api/pt/students
GET /api/pt/bookings
GET /api/pt/stats
```

### Admin
```http
GET    /api/admin/users
GET    /api/admin/stats
PATCH  /api/admin/users/:id/toggle-active
PATCH  /api/admin/users/:id/role
GET    /api/admin/revenue
GET    /api/admin/memberships/distribution
GET    /api/admin/memberships
POST   /api/admin/memberships
PUT    /api/admin/memberships/:id
PATCH  /api/admin/memberships/:id
DELETE /api/admin/memberships/:id
GET    /api/admin/trainers
POST   /api/admin/trainers
PUT    /api/admin/trainers/:id
DELETE /api/admin/trainers/:id
GET    /api/admin/bookings
PATCH  /api/admin/bookings/:id/status
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
- Input validation (Zod)
- Rate limiting on auth endpoints
- HTTPS in production
- Environment variables (never hardcoded)

---

## 📦 Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon (PostgreSQL + pgvector) |
| Cache (optional) | Redis |
| CI/CD | GitHub Actions |

---

## 📖 Documentation

| File | Mô tả |
|---|---|
| [ARCHITECTURE.MD](./ARCHITECTURE.MD) | System architecture, DB schema, API standards |
| [ROADMAP.md](./ROADMAP.md) | Development plan and phases |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Current progress tracking |
| [ai-service/README.md](./ai-service/README.md) | Self-trained Qwen model: training + serving |

---

## 📄 License

MIT License — see [LICENSE](./LICENSE)