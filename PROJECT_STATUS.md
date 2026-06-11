# PROJECT STATUS

**Project:** Gym Management System
**Team Size:** 2 Developers
**Current Phase:** Phase 5 - Payment & Notification
**Last Updated:** 11/06/2026

---

# Overall Progress

| Phase                                    | Status          |
| ---------------------------------------- | --------------- |
| Phase 1 - Foundation & Database          | ✅ Completed     |
| Phase 2 - Authentication & Authorization | ✅ Completed     |
| Phase 3 - Membership & AI Core           | ✅ Completed     |
| Phase 4 - Frontend Admin Dashboard       | ✅ Completed     |
| Phase 5 - Payment & Notification         | ⏳ Pending       |
| Phase 6 - Testing & Deployment           | ⏳ Pending       |

---

# Phase 1 - Foundation & Database

Status: ✅ COMPLETED

## Issue #1 - Project Initialization
Status: ✅ Completed
* Created GitHub Repository, roadmap, architecture document
* Setup project structure, initialized backend, created development workflow

## Issue #2 - Backend Foundation
Status: ✅ Completed
* Express.js + TypeScript + dotenv + ESLint + Prettier + Nodemon
* Logger + Global Error Middleware + Base folder structure

## Issue #3 - Database & Prisma Setup
Status: ✅ Completed
* PostgreSQL + Prisma ORM + migrations + seed script
* Models: User, MembershipPlan, UserMembership, ChatHistory, KnowledgeBase

---

# Phase 2 - Authentication & Authorization

Status: ✅ COMPLETED

## Issue #4 - Users & Roles Schema
Status: ✅ Completed — 31/05/2026
* Added Role enum (ADMIN, MEMBER, PT)
* Added isActive field for account lock/unlock
* Migration: add_role_enum applied

## Issue #5 - User Registration API
Status: ✅ Completed — 31/05/2026
* Endpoint: POST /api/auth/register
* Validation: email, password >= 8 chars, no duplicate email
* Hash password (bcrypt cost 12), Generate JWT, Save user

## Issue #6 - Login API
Status: ✅ Completed — 31/05/2026
* Endpoint: POST /api/auth/login
* Access token (15m) + Refresh token (7d)

## Issue #7 - Auth & Role Middleware
Status: ✅ Completed — 31/05/2026
* auth.middleware.ts — JWT verification, attaches req.user
* role.middleware.ts — authorize(...roles) factory function
* error.middleware.ts — Zod + AppError + Unknown error handling

## Issue #8 - Membership System Schema
Status: ✅ Completed — 03/06/2026
* Tables: MembershipPlan + UserMembership
* MembershipStatus enum: ACTIVE / EXPIRED / SUSPENDED
* Migration: add_membership_system applied
* Seed: 3 plans (Basic/Premium/Elite)

---

# Phase 3 - Membership & AI Core

Status: ✅ COMPLETED

## Issue #9 - GET /api/memberships/plans
Status: ✅ Completed — 03/06/2026
* Public endpoint, no auth required
* Returns all active plans sorted by price ascending

## Issue #10 - POST /api/memberships/buy + GET /current
Status: ✅ Completed — 03/06/2026
* POST /api/memberships/buy — Purchase membership (JWT required)
* GET /api/memberships/current — Get active membership (JWT required)
* Business logic: block duplicate active membership (MEMBERSHIP_003)

## Issue #11 - ChatHistory Schema
Status: ✅ Completed — 04/06/2026
* ChatHistory model with sessionId, role (ChatRole enum), content, tokens
* ChatRole enum: user / assistant
* Indexes: [userId, sessionId] and [userId, createdAt]
* Migration: add_chat_history applied

## Issue #12 - RAG AI Chatbot
Status: ✅ Completed — 05/06/2026
* pgvector extension installed on PostgreSQL 17 (v0.8.2)
* KnowledgeBase table with vector(3072) embeddings
* 24 gym knowledge documents seeded (workout, nutrition, general)
* RAG pipeline: gemini-embedding-001 → cosine similarity search → Gemini 2.0 Flash
* Endpoints:
  - POST /api/ai/chat — RAG chat with session history
  - GET /api/ai/history — Chat history by session
  - GET /api/ai/usage — Usage stats

## Issue #13 - AI Usage Limits per Membership
Status: ✅ Completed — 05/06/2026 (implemented within Issue #12)
* checkAndUpdateUsage() enforces limits before every AI call
* Auto-reset daily count at new day
* Auto-reset monthly count at new month
* Error codes: AI_001 (no membership), AI_002 (daily limit), AI_003 (monthly limit)

| Plan    | Daily     | Monthly    |
|---------|-----------|------------|
| Basic   | 1/day     | 10/month   |
| Premium | 10/day    | 100/month  |
| Elite   | Unlimited | Unlimited  |

---

# Phase 4 - Frontend Admin Dashboard

Status: ✅ COMPLETED

## Issue #14 - Setup NextJS Frontend
Status: ✅ Completed — 07/06/2026
* NextJS 16.2.7 + TypeScript + TailwindCSS + App Router + Turbopack
* Design system from DESIGN-claude.md: cream canvas (#faf9f5), coral (#cc785c), dark navy (#181715)
* Google Fonts: Cormorant Garamond (serif) + Inter (sans) + JetBrains Mono (mono)
* Axios API client with JWT interceptors (reads from Zustand persist store)
* Zustand auth store with persist middleware
* TypeScript types: User, MembershipPlan, UserMembership, ApiResponse

## Issue #15 - Login Page
Status: ✅ Completed — 07/06/2026
* Route: /login (redirect from /)
* react-hook-form + zod validation
* Coral CTA button, cream canvas design
* Role-based redirect: ADMIN→/admin, PT→/pt, MEMBER→/member
* Error handling with inline error messages

## Issue #16 - Dashboard Overview UI
Status: ✅ Completed — 08/06/2026
* Dark navy sidebar (240px fixed): logo, user avatar, nav links by role, logout
* Member Dashboard (/member): membership card, AI usage stats (daily/monthly), quick actions
* Admin Dashboard (/admin): stats cards (total users, members, active), quick management links
* Zustand persist middleware fix — auth state survives navigation
* DashboardLayout hydration fix — no redirect flash on page load

## Issue #17 - User Management Table (Admin)
Status: ✅ Completed — 10/06/2026
* Route: /admin/users
* Columns: Họ tên, Email, Số điện thoại, Vai trò, Gói, Trạng thái, Thao tác
* Search filter by name or email
* Quick filter buttons by plan: Tất cả / Chưa có / Basic / Premium / Elite
* Nút Khóa/Mở khóa tài khoản (instant UI update, cannot lock own account)
* Nút Sửa role inline: dropdown ADMIN/PT/MEMBER + confirm/cancel
* Backend APIs: PATCH /admin/users/:id/toggle-active, PATCH /admin/users/:id/role

---

# Current File Structure

```
backend/src/
├── config/         jwt.ts ✅  logger.ts ✅  prisma.ts ✅
├── constants/      membership.ts ✅
├── controllers/    auth.controller.ts ✅  membership.controller.ts ✅
│                   ai.controller.ts ✅  admin.controller.ts ✅
├── middlewares/    auth.middleware.ts ✅  role.middleware.ts ✅  error.middleware.ts ✅
├── routes/         auth.routes.ts ✅  membership.routes.ts ✅
│                   ai.routes.ts ✅  admin.routes.ts ✅  index.ts ✅
├── services/       auth.service.ts ✅  membership.service.ts ✅  ai.service.ts ✅
├── types/          auth.types.ts ✅  membership.types.ts ✅  ai.types.ts ✅
├── utils/          generateToken.ts ✅  errors.ts ✅
├── validators/     auth.validator.ts ✅  membership.validator.ts ✅
└── server.ts ✅

backend/prisma/
├── schema.prisma ✅
├── seed.ts ✅
├── seed-knowledge.ts ✅
├── knowledge-base.ts ✅
└── migrations/ ✅

frontend/
├── app/
│   ├── (auth)/login/page.tsx ✅
│   ├── (auth)/layout.tsx ✅
│   ├── (dashboard)/layout.tsx ✅
│   ├── (dashboard)/admin/page.tsx ✅
│   ├── (dashboard)/admin/users/page.tsx ✅
│   ├── (dashboard)/member/page.tsx ✅
│   └── page.tsx (redirect to /login) ✅
├── components/ui/ (pending)
├── components/layout/ (pending)
├── lib/api.ts ✅
├── store/auth.store.ts ✅
└── types/index.ts ✅
```

---

# Database Schema

## Models
- **User** — id, email, password, fullName, phone, avatar, role, isActive, isDeleted
- **MembershipPlan** — id, name, price, duration, aiLimit, aiDailyLimit, description, isActive
- **UserMembership** — id, userId, planId, startDate, expiryDate, aiUsageCount, aiDailyCount, aiUsageReset, aiDailyReset, status
- **ChatHistory** — id, userId, sessionId, role, content, tokens, createdAt
- **KnowledgeBase** — id, category, title, content, embedding (vector 3072), createdAt

## Enums
- **Role:** ADMIN, MEMBER, PT
- **MembershipStatus:** ACTIVE, EXPIRED, SUSPENDED
- **ChatRole:** user, assistant

## Migrations Applied
1. add_role_enum
2. add_membership_system
3. add_chat_history
4. add_knowledge_base
5. update_embedding_dimension
6. add_user_isActive (via psql ALTER TABLE)

---

# API Endpoints

## Auth
| Method | Endpoint              | Auth | Description     |
|--------|-----------------------|------|-----------------|
| POST   | /api/auth/register    | ❌   | Register user   |
| POST   | /api/auth/login       | ❌   | Login user      |

## Membership
| Method | Endpoint                    | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| GET    | /api/memberships/plans      | ❌   | Get all active plans     |
| POST   | /api/memberships/buy        | ✅   | Purchase membership      |
| GET    | /api/memberships/current    | ✅   | Get active membership    |

## AI
| Method | Endpoint           | Auth | Description          |
|--------|--------------------|------|----------------------|
| POST   | /api/ai/chat       | ✅   | RAG chat with Gemini |
| GET    | /api/ai/history    | ✅   | Chat history         |
| GET    | /api/ai/usage      | ✅   | AI usage stats       |

## Admin
| Method | Endpoint                          | Auth         | Description           |
|--------|-----------------------------------|--------------|----------------------|
| GET    | /api/admin/stats                  | ✅ ADMIN     | System statistics     |
| GET    | /api/admin/users                  | ✅ ADMIN     | List all users        |
| PATCH  | /api/admin/users/:id/toggle-active| ✅ ADMIN     | Lock/unlock user      |
| PATCH  | /api/admin/users/:id/role         | ✅ ADMIN     | Update user role      |

---

# Error Codes

## Auth
- AUTH_001: Invalid email format
- AUTH_002: Password too short (< 8 chars)
- AUTH_003: User not found
- AUTH_004: Invalid password
- AUTH_005: Email already exists
- AUTH_006: Invalid or expired token

## Membership
- MEMBERSHIP_001: Plan ID is required
- MEMBERSHIP_002: Plan not found or inactive
- MEMBERSHIP_003: User already has an active membership
- MEMBERSHIP_004: User not found

## AI
- AI_001: No active membership
- AI_002: Daily limit reached
- AI_003: Monthly limit reached
- AI_004: Message is required

## User (Admin)
- USER_001: User not found
- USER_002: Cannot lock your own account
- USER_003: Invalid role

---

# Current Status

## Backend
| Component              | Status |
|------------------------|--------|
| Express Server         | ✅ Running on port 5000 |
| Logger                 | ✅ Implemented |
| Global Error Handler   | ✅ Zod + AppError + Unknown |
| Prisma                 | ✅ Connected (v6.19.3) |
| Database               | ✅ gym_management |
| Auth (Register/Login)  | ✅ Working |
| JWT                    | ✅ Access (15m) + Refresh (7d) |
| Roles                  | ✅ ADMIN / MEMBER / PT |
| Membership APIs        | ✅ Working |
| RAG AI Chatbot         | ✅ Working |
| pgvector               | ✅ Installed (PostgreSQL 17, v0.8.2) |
| KnowledgeBase          | ✅ 24 documents embedded (vector 3072) |
| Admin APIs             | ✅ Working |

## Frontend
| Component              | Status |
|------------------------|--------|
| NextJS 16 App Router   | ✅ Running on port 3000 |
| Design System          | ✅ Cream/Coral/Dark Navy |
| Login Page             | ✅ Working |
| Member Dashboard       | ✅ Working |
| Admin Dashboard        | ✅ Working |
| User Management Table  | ✅ Working |
| Zustand Persist        | ✅ Fixed |
| API Interceptors       | ✅ Fixed |

---

# Tech Stack

| Component     | Technology              | Version   |
|---------------|-------------------------|-----------|
| Runtime       | Node.js                 | 18+       |
| Framework     | Express.js              | Latest    |
| Language      | TypeScript              | 6.0.3     |
| ORM           | Prisma                  | 6.19.3    |
| Database      | PostgreSQL               | 17        |
| Vector DB     | pgvector                | 0.8.2     |
| Auth          | JWT                     | Standard  |
| Validation    | Zod                     | Latest    |
| Hashing       | bcrypt                  | cost 12   |
| AI LLM        | Gemini 2.0 Flash        | Latest    |
| AI Embedding  | gemini-embedding-001    | Latest    |
| AI SDK        | @google/genai           | 0.24.1+   |
| Frontend      | NextJS                  | 16.2.7    |
| Styling       | TailwindCSS             | Latest    |
| State         | Zustand + persist       | Latest    |
| Forms         | react-hook-form + zod   | Latest    |
| HTTP Client   | Axios                   | Latest    |

---

# Notes For Future Agents

**CRITICAL — Read before coding:**
1. Stack: Node.js + Express + TypeScript (strict, no any) + PostgreSQL + Prisma 6.19.3
2. Validation: Zod | Hashing: bcrypt cost 12 | Auth: JWT
3. Backend port: 5000 | Frontend port: 3000
4. Roles: ADMIN, MEMBER, PT (NO STAFF)
5. AI: Gemini 2.0 Flash for chat, gemini-embedding-001 for embeddings
6. pgvector dimension: 3072 (gemini-embedding-001 output)
7. Membership tiers: Basic (1/day, 10/month), Premium (10/day, 100/month), Elite (Unlimited)
8. All APIs must have Zod validation + error handling
9. Never hardcode API keys or URLs
10. .env file must NOT be committed to git
11. Zustand store key: 'ironfit-auth' — token at state.accessToken
12. API interceptor: only redirect to /login on /auth/ endpoint 401
13. DashboardLayout has hydration guard — uses useState(hydrated) before checking isAuthenticated
14. isActive field added via psql (not in migration history — drift exists in KnowledgeBase embedding dimension)

**Known Issues:**
- Prisma migration drift: KnowledgeBase.embedding changed from vector(768) to vector(3072) via psql, not tracked in migrations
- Access token expires in 15m — user must re-login after expiry
- Gemini free tier quota limited — may get 429 errors after heavy usage

**Next Phase:** Phase 5 — Payment & Notification (Issues #18–#20)
- Issue #18: Thiết kế bảng Payments
- Issue #19: Tích hợp VNPay/MoMo
- Issue #20: Xây dựng Notification System