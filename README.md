# 🏋️ IronFit Pro — Gym Management System

![CI](https://github.com/sleepingbuild/gym-management/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/version-0.1.0-orange)

A full-stack gym management platform with membership management, AI-powered fitness coaching (RAG), and online payments. Built as a course project demonstrating modern software engineering practices.

🌐 **Live Demo:** https://gym-management-ct9i4d6vr-sleeping-team.vercel.app  
📦 **API:** https://gym-management-production-44b5.up.railway.app/api

---

## 👥 User Personas

### 🧑‍💼 Admin — Quản lý phòng gym
Cần một nền tảng để quản lý toàn bộ hội viên, theo dõi trạng thái tài khoản, và kiểm soát quyền truy cập hệ thống.
- Quản lý danh sách user, lock/unlock tài khoản
- Thay đổi role (ADMIN / PT / MEMBER)
- Xem thống kê tổng quan

### 🏃 Member — Hội viên phòng gym
Muốn đăng ký gói tập, nhận tư vấn AI về luyện tập và dinh dưỡng, và thanh toán online.
- Đăng ký và quản lý gói membership
- Chat với AI Personal Trainer
- Thanh toán qua VNPay / MoMo

### 🤸 PT — Personal Trainer *(planned v0.2.0)*
Muốn quản lý lịch dạy và theo dõi tiến trình học viên.
- Role đã có trong hệ thống
- Features đang phát triển

---

## ✨ Features (v0.1.0)

### ✅ Đã implement
| Feature | Chi tiết |
|---|---|
| Authentication | JWT register/login, bcrypt, access (15m) + refresh (7d) token |
| Role-Based Access | ADMIN / PT / MEMBER, middleware phân quyền |
| Membership System | 3 gói Basic/Premium/Elite, auto-expiry tracking |
| AI Fitness Chatbot | RAG pipeline: pgvector + gemini-embedding-001 + Gemini 2.0 Flash |
| AI Usage Limiting | Daily + monthly limits theo từng gói |
| Admin Dashboard | Quản lý users, lock/unlock, đổi role |
| Payment Gateway | VNPay (HMAC-SHA512) + MoMo (HMAC-SHA256 + IPN webhook) |
| Notification System | 6 loại in-app notification, auto-trigger |
| AI Chat UI | Chat bubble, typing indicator, usage badge realtime |

### 🔜 Planned
- PT scheduling & student management (v0.2.0)
- Body Progress Tracking / BMI chart (v0.2.0)
- QR Check-in (v0.2.0)
- Rate limiting middleware

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Backend | Node.js 20 + Express + TypeScript |
| Frontend | Next.js 16 + TailwindCSS + Zustand |
| Database | PostgreSQL 16 + pgvector (v0.8.2) |
| ORM | Prisma v6 |
| Authentication | JWT (access + refresh tokens) |
| AI | Gemini 2.0 Flash + gemini-embedding-001 (RAG) |
| Payment | VNPay + MoMo |
| Deployment | Railway (backend) + Vercel (frontend) + Neon (database) |
| CI/CD | GitHub Actions |

---

## 🏗️ Architecture
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐

│   Next.js 16    │────▶│  Express REST API     │────▶│  PostgreSQL 16  │

│   (Vercel)      │     │  (Railway)            │     │  + pgvector     │

│                 │     │                       │     │  (Neon)         │

│  Zustand store  │     │  JWT Auth middleware  │     │                 │

│  Axios client   │     │  Zod validation       │     │  Prisma ORM     │

└─────────────────┘     │  Prisma queries       │     └─────────────────┘

│                       │

│  ┌─────────────────┐  │

│  │  RAG Pipeline   │  │

│  │  Gemini 2.0     │  │

│  │  Flash + embed  │  │

│  └─────────────────┘  │

└──────────────────────┘

Xem chi tiết: [ARCHITECTURE.MD](./ARCHITECTURE.MD)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ với pgvector extension
- Gemini API key

### Backend Setup
```bash
git clone https://github.com/sleepingbuild/gym-management.git
cd gym-management/backend
cp .env.example .env        # điền API keys
npm install
npx prisma migrate dev
npx prisma db seed
npx tsx prisma/seed-knowledge.ts   # seed AI knowledge base
npm run dev
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL
npm install
npm run dev
```

---

## 📚 API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
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

### Admin
```http
GET   /api/admin/stats
GET   /api/admin/users
PATCH /api/admin/users/:id/toggle-active
PATCH /api/admin/users/:id/role
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

---

## 🔒 Security
- JWT Authentication (access + refresh tokens)
- Password hashing (bcrypt, cost 12)
- Role-Based Access Control (RBAC)
- Input validation (Zod)
- HTTPS in production
- Environment variables (never hardcoded)

---

## 📦 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://gym-management-ct9i4d6vr-sleeping-team.vercel.app |
| Backend | Railway | https://gym-management-production-44b5.up.railway.app |
| Database | Neon | PostgreSQL + pgvector (Singapore region) |

---

## 📖 Documentation

| File | Mô tả |
|---|---|
| [ARCHITECTURE.MD](./ARCHITECTURE.MD) | System architecture, DB schema, API standards |
| [ROADMAP.md](./ROADMAP.md) | 26-issue development plan, 6 phases |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Current progress tracking |

---

## 📄 License

MIT License — see [LICENSE](./LICENSE)