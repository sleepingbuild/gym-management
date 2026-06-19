# Changelog

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
- **Frontend Web** — Next.js 16 + TailwindCSS, design system cream/coral/dark-navy, Cormorant Garamond
- **AI Chat UI** — giao diện chat bubble, typing indicator, usage badge realtime

### Known Limitations
- VNPay sandbox đang chờ duyệt merchant chính thức (Error 72) — signature đã verify đúng
- PT features chưa implement (role tồn tại trong schema, chưa có UI/API riêng)
- QR Check-in chưa implement
- Body Progress Tracking đang phát triển (Phase 6)

### Tech Stack
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL + pgvector
- Frontend: Next.js 16 + TailwindCSS + Zustand
- AI: Gemini 2.0 Flash + gemini-embedding-001 (RAG)
- Payment: VNPay + MoMo