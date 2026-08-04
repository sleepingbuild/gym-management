# Changelog

## [v1.0.0] - 2026-08-04

### Added
- **PT role wired end-to-end** — dashboard, clients list, client progress, schedule endpoints (`/pt/dashboard`, `/pt/clients`, `/pt/clients/progress`); login redirect and sidebar now branch correctly by role
- **Email verification + Terms of Service** — mandatory email verification on register (via Mailjet), login blocked until verified, `/terms` acceptance checkbox
- **Face Check-in** — face-recognition check-in (`face-api.js`, client-side) for Member and PT self check-in, plus an Admin enroll page and walk-up Kiosk mode; fully replaces QR check-in and manual PT check-in, which have been deleted
- **Trainer scheduling** — Admin CRUD for trainer working hours (recurring weekly or specific-date), a shared Google-Calendar-style weekly grid across Admin/PT/Member, and booking validated against real working hours (not just slot-collision)
- **Bulk trainer-schedule creation** (`POST /admin/trainer-schedules/bulk`) — apply one shift template to multiple trainers/weekdays in a single call; conflicting combinations are skipped individually with reasons returned, rather than failing the whole batch
- **Member "Trainers" page** — now shows the real trainer list and links into booking (previously a non-functional placeholder)
- **Membership cancellation** — member self-cancel (`PATCH /memberships/cancel`) and admin assign/cancel on a user's behalf (`PATCH /admin/users/:id/membership`)
- **AI Chatbot v2** — dropped Gemini entirely; Qwen 2.5 1.5B (LoRA) is now the only provider, with RAG over pgvector (embeddings resized to 384-dim, `paraphrase-multilingual-MiniLM-L12-v2`), SSE token streaming, multi-session chat (`ChatSession` model, `GET /ai/sessions`), and a free heuristic scope-limiter (RAG similarity + keyword list) instead of an extra model call

### Fixed
- **VNPay bypass** — buying any plan (including paid ones) previously skipped payment entirely and activated the membership immediately; frontend now correctly redirects paid plans through `paymentService.createPayment()` → VNPay, with `/payment/success` and `/payment/failed` callback pages added
- **Payment history endpoint mismatch** — `/member/payments` called a non-existent route; fixed to call `/payments/history`, with backend now also returning aggregate stats and the related membership plan
- **`P2002` unique constraint on re-purchase** — `buyMembership` used `prisma.userMembership.create()`, which failed after a cancel (still one row per user); switched to `upsert()`
- **`trust proxy` missing in Express** — `express-rate-limit` was rejecting all requests on Render because of the `X-Forwarded-For` header from Render's proxy
- **`prisma migrate reset` run against the wrong target** — no data was lost, but prompted a proper `seed-test-accounts.ts` upsert script that now runs after every reset
- Repository cleanup: removed stray `git`/`prisma`/`lib`/`node_modules` artifacts committed at the repo root from commands run in the wrong directory
- **VNPay sandbox** — old merchant had gone invalid (re-registered a new one); fixed a double amount-multiplication bug (`plan.price * 1000` in the controller on top of `* 100` in the service) and a signature-encoding mismatch (`qs` library didn't match VNPay's `application/x-www-form-urlencoded` requirement — switched to `URLSearchParams`); full flow verified end-to-end on local and production
- **Trainer available slots hardcoded** — `getAvailableSlots` only ever checked against 6 fixed 1-hour slots, so an 8-hour shift only ever showed one bookable slot; now generates 1-hour slots dynamically from each day's real `TrainerSchedule` times
- **Neon migration history reconciled** — replaced the drifted/duplicate migration state (including `20260730122711_add_vector_embedding`/`20260731082443_add_vector_embedding` and the previously-unrecorded `TrainerSchedule`/`TrainerCheckIn` tables) with a fresh baseline reflecting Neon's true schema; `migrate deploy` now works normally for future changes

### Changed
- Deployment fully moved from Railway (free-tier credit exhausted) to **Render** for both backend and frontend
- Email provider settled on **Mailjet** (REST over HTTPS) after Resend (sandbox-only), Brevo (manual account approval), and Gmail SMTP (blocked by Render's free-tier outbound port restrictions) all proved unworkable
- `.gitignore` updated to exclude `node_modules/` at the repo root

### Known limitations
- The Qwen chatbot only responds while a developer's local machine, `serve.py`, and its ngrok tunnel are all running
- No automated tests yet for trainer-schedules, available-slots, admin membership edit, or member cancel endpoints

---

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

## [0.2.0] - 2026-07-05

### Added
- **QR Check-in** — Check-in/Check-out bằng QR code
  - Tạo QR code cho mỗi hội viên
  - Check-in bằng QR
  - Lịch sử check-in
  - Thống kê attendance

- **Goal Setting** — Đặt mục tiêu cho Body Progress
  - Đặt mục tiêu cân nặng, BMI, mỡ cơ thể
  - Theo dõi tiến trình so với mục tiêu
  - Tự động cập nhật khi đạt mục tiêu

- **PT Dashboard** — Dashboard cho PT
  - Xem danh sách học viên
  - Xem thông tin học viên

### Changed
- Update Prisma schema (Attendance, BodyGoal)
- Update frontend services
- Update API routes

### Fixed
- Fix CORS issues
- Fix 401 error on frontend
- Fix goal creation conflict

### Tech Stack (v0.1.0)
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL + pgvector
- Frontend: Next.js 16 + TailwindCSS + Zustand
- AI: Gemini 2.0 Flash + gemini-embedding-001 (RAG)
- Payment: VNPay + MoMo

> Note: QR Check-in and the original manual PT check-in shipped in v0.2.0 were fully removed and replaced by Face Check-in in v1.0.0 (see above).