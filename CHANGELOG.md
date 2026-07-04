# Changelog

## [v1.0.0-rc] - 2026-07-04

### Added
- **Body Progress Tracking** — Theo dõi cân nặng, BMI, mỡ cơ thể, khối lượng cơ
  - Backend: CRUD API với auto BMI calculation
  - Frontend: Charts (Recharts), stats cards, form, history table
  - Design system: Cream (#faf9f5), Coral (#cc785c), Dark Navy (#181715)

- **Unit & Integration Tests** — Jest + Supertest
  - 16 tests passed (Auth, Membership, Admin, Body Progress, Integration)
  - Security tests: SQL Injection, XSS, Rate Limiting, JWT
  - Coverage: 70%+

- **Database Optimization** — Indexes + Redis caching
  - Indexes for all tables (User, UserMembership, BodyProgress, Payment, Notification)
  - Redis cache with ioredis
  - Cache middleware (TTL 5 minutes)
  - Slow query logging (>100ms)

- **Docker Support** — Full stack containerization
  - Dockerfile for backend (production + dev)
  - Dockerfile for frontend (production + dev)
  - docker-compose.yml with PostgreSQL, Redis, Backend, Frontend

- **Deployment** — Production ready
  - Backend: Railway
  - Frontend: Vercel
  - Database: Neon PostgreSQL
  - GitHub Actions CI/CD

- **Swagger API Documentation** — Full API docs at `/api/docs`

### Changed
- Updated CORS configuration for Vercel frontend
- Optimized Prisma connection pool
- Updated .env.example with all required variables
- Migrated from React Native to Next.js Web (scope change)

### Fixed
- Fixed migration drift (Payment, Notification, isActive)
- Fixed CORS issues with frontend (port 3000/3001)
- Fixed TypeScript errors in tests
- Fixed vector extension issues in PostgreSQL

### Removed
- Mobile app references (scope changed to Web only)

---

## [0.1.0] - 2026-06-19

### Added
- **Authentication System** — JWT-based register/login, access token (15m) + refresh token (7d), bcrypt password hashing
- **Role-Based Access Control** — 3 roles: ADMIN, PT, MEMBER với middleware phân quyền
- **Membership System** — 3 gói (Basic/Premium/Elite), API mua gói, theo dõi trạng thái
- **AI Fitness Chatbot** — RAG pipeline với Gemini 2.0 Flash + pgvector, 24 tài liệu gym được seed sẵn
- **AI Usage Limiting** — giới hạn daily + monthly theo từng gói membership
- **Admin Dashboard** — quản lý users, lock/unlock tài khoản, thay đổi role
- **Payment Gateway** — tích hợp VNPay (HMAC-SHA512) và MoMo (HMAC-SHA256)
- **Notification System** — 6 loại thông báo in-app, tích hợp tự động vào payment flow
- **Frontend Web** — Next.js 16 + TailwindCSS, design system cream/coral/dark-navy
- **AI Chat UI** — giao diện chat bubble, typing indicator, usage badge realtime

### Known Limitations (v0.1.0)
- VNPay sandbox đang chờ duyệt merchant chính thức (Error 72) — signature đã verify đúng
- PT features chưa implement (role tồn tại trong schema, chưa có UI/API riêng)
- QR Check-in chưa implement
- Body Progress Tracking đang phát triển (hoàn thành ở v1.0.0-rc)

### Tech Stack (v0.1.0)
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL + pgvector
- Frontend: Next.js 16 + TailwindCSS + Zustand
- AI: Gemini 2.0 Flash + gemini-embedding-001 (RAG)
- Payment: VNPay + MoMo
