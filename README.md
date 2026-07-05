# 🏋️ IronFit Pro — Gym Management System

![CI](https://github.com/sleepingbuild/gym-management/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/version-v1.0.0-orange)

A full-stack gym management platform with membership management, AI-powered fitness coaching (RAG), and online payments. Built as a course project demonstrating modern software engineering practices.

🌐 **Live Demo:** https://gym-management-five-gules.vercel.app  
📦 **API:** https://gym-management-production-44b5.up.railway.app/api  
📖 **API Docs:** https://gym-management-production-44b5.up.railway.app/api/docs

---

## 👥 User Personas

### 🧑‍💼 Admin — Quản lý phòng gym
- Quản lý danh sách user, lock/unlock tài khoản
- Thay đổi role (ADMIN / PT / MEMBER)
- Xem thống kê tổng quan

### 🏃 Member — Hội viên phòng gym
- Đăng ký và quản lý gói membership
- Chat với AI Personal Trainer
- Thanh toán qua VNPay / MoMo
- Theo dõi tiến trình cơ thể (BMI, weight, body fat)

### 🤸 PT — Personal Trainer *(planned v0.2.0)*
- Role đã có trong hệ thống
- Features đang phát triển

---

## ✨ Features (v1.0.0-rc)

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
| Body Progress Tracking | BMI, weight, body fat, muscle mass with charts |
| Unit Tests | 16 tests, 70%+ coverage |
| Docker Support | Full stack containerization |
| Production Deployment | Vercel + Railway + Neon |
| API Documentation | Swagger/OpenAPI at `/api/docs` |

### 🔜 Planned (v0.2.0)
- PT scheduling & student management
- QR Check-in
- Goal setting for Body Progress
- Export data to CSV/PDF

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
| Container | Docker + docker-compose |

---

## 🏗️ Architecture
┌─────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐
│ Next.js 16 │───▶│ Express REST API │───▶│ PostgreSQL 16 │
│ (Vercel) │ │ (Railway) │ │ + pgvector │
│ Zustand + Axios │ │ JWT + Zod + Prisma │ │ (Neon) │
└─────────────────────┘ │ │ └──────────────────┘
│ RAG Pipeline: │
│ embed → pgvector │
│ → Gemini 2.0 Flash │
└──────────────────────┘

text

**Pattern:** Controller → Service → Prisma  
**API format:** `{ success, statusCode, message, data }`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ with pgvector extension
- Gemini API key

### Backend Setup
```bash
git clone https://github.com/sleepingbuild/gym-management.git
cd gym-management/backend
cp .env.example .env       
npm install
npx prisma migrate dev
npx prisma db seed
npx tsx prisma/seed-knowledge.ts   
npm run dev
```
Frontend Setup
```bash
cd frontend
cp .env.example .env.local 
npm install
npm run dev
```
## Docker Setup
# Development
```bash
docker-compose up --build
```

# Production
```
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🌐 Deployment
Service	Platform	URL
Frontend -Vercel	
```
https://gym-management-five-gules.vercel.app
```
Backend	- Railway	
```
https://gym-management-production-44b5.up.railway.app
```
Database - Neon	
```
PostgreSQL + pgvector (Singapore region)
```
API Docs -Swagger	
```
https://gym-management-production-44b5.up.railway.app/api/docs
```

## 🔒 Security
```
JWT Authentication (access + refresh tokens)

Password hashing (bcrypt, cost 12)

Role-Based Access Control (RBAC)

Input validation (Zod)

HTTPS in production

Environment variables (never hardcoded)

Rate limiting middleware
```

## 📚 API Endpoints
Authentication
```
http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

Membership
```
http
GET  /api/memberships/plans
POST /api/memberships/buy
GET  /api/memberships/current
```

AI Chat
```
http
POST /api/ai/chat
GET  /api/ai/history
GET  /api/ai/usage
```

Body Progress
```
http
POST /api/body-progress
GET  /api/body-progress
GET  /api/body-progress/latest
GET  /api/body-progress/chart
GET  /api/body-progress/stats
PUT  /api/body-progress/:id
DELETE /api/body-progress/:id
```

Admin
```
http
GET   /api/admin/stats
GET   /api/admin/users
PATCH /api/admin/users/:id/toggle-active
PATCH /api/admin/users/:id/role
```

Payment
```
http
POST /api/payments/create
GET  /api/payments/history
GET  /api/payments/vnpay-return
POST /api/payments/momo-webhook
```

Notification
```
http
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

## 📖 Documentation
```
ARCHITECTURE.MD	System architecture
```
```
DB schema
```
```
API standards
```
```
ROADMAP.md	26-issue development plan, 6 phases
```
```
CHANGELOG.md	Version history
```
```
PROJECT_STATUS.md	Current progress tracking
```
```
RELEASE_EVIDENCE.md	Release evidence and test results
```
## 📄 License
MIT License — see LICENSE
