# PROJECT STATUS

**Project:** Gym Management System (IronFit Pro)
**Team Size:** 4 (agents phối hợp trên các mảng: Backend/DB, AI, Frontend UI, PT features)
**Current Phase:** Phase 7 — PT & Trainer Management Expansion
**Last Updated:** 22/07/2026
**Version:** v0.2.0 (in progress)

---

## 📊 Overall Progress

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1 - Foundation & Database | ✅ Completed | 100% |
| Phase 2 - Authentication & Authorization | ✅ Completed | 100% |
| Phase 3 - Membership & AI Core | ✅ Completed | 100% |
| Phase 4 - Frontend Admin Dashboard | ✅ Completed | 100% |
| Phase 5 - Payment & Notification | ✅ Completed | 100% |
| Phase 6 - Testing & Deployment | ✅ Completed | 100% |
| Phase 7 - PT & Trainer Management | ⏳ In Progress | ~70% |

> Phase 7 covers features added after the original 26-issue roadmap: PT booking system, trainer profile management, trainer work schedules, trainer check-in (timekeeping), and dual AI provider support. These are not yet tracked as numbered GitHub issues.

---

## 🎯 Phase 7 — In Progress

| Feature | Backend (schema/API) | Frontend UI | Status |
|---|---|---|---|
| PT Booking (member books trainer) | ✅ Done | ✅ Done | ✅ Complete |
| PT Dashboard (own students/stats) | ✅ Done | ✅ Done | ✅ Complete |
| Admin: Trainer management (CRUD) | ✅ Done | ✅ Done | ✅ Complete |
| Admin: Booking oversight | ✅ Done | ✅ Done | ✅ Complete |
| Admin: Revenue & membership distribution charts | ✅ Done | ✅ Done | ✅ Complete |
| Trainer work schedule (`TrainerSchedule`) | ✅ Schema done | ⏳ Admin UI in progress | ⏳ In progress |
| Trainer check-in / timekeeping (`TrainerCheckIn`) | ✅ Schema done | ⏳ Admin UI in progress | ⏳ In progress |
| PT page: "Học viên của tôi" (student roster detail) | ✅ Data available (Booking) | ❌ Not built | 🔜 Planned |
| PT page: "Thời khoá biểu" (own schedule view) | ✅ Data available | ❌ Not built | 🔜 Planned |
| PT page: "Tiến trình học viên" (view student progress) | ✅ Data available (BodyProgress) | ❌ Not built | 🔜 Planned |
| PT page: "Chấm công" (self check-in) | ✅ Schema done (`TrainerCheckIn`) | ❌ Not built | 🔜 Planned |
| Dual AI provider (Gemini / self-trained Qwen) | ✅ Done | ✅ Done | ✅ Complete |

---

## ⚠️ Known Issues — Not Yet Resolved

| # | Issue | Notes |
|---|---|---|
| 1 | Login redirect logic fixed but not fully re-verified | Previously always redirected to `/member` regardless of role; fixed but a build error (`user is not defined`) needs re-confirmation before considering this closed |
| 2 | 4 PT-facing pages not yet built | Backend data is ready (`Booking`, `BodyProgress`, `TrainerCheckIn`); UI pending |
| 3 | Debug-session secrets not yet rotated | `JWT_SECRET`, `JWT_REFRESH_SECRET`, Neon DB password, `GEMINI_API_KEY`, `VNPAY_HASH_SECRET` were exposed during troubleshooting sessions and must be rotated before real-world use |
| 4 | `AI_PROVIDER=qwen` depends on a personal ngrok tunnel | Only works while a specific developer's machine + `serve.py` + ngrok are running; not viable as a permanent production path |
| 5 | Multiple agents editing schema/migrations concurrently caused a production migration failure | Resolved via `prisma migrate resolve --rolled-back`; going forward, only one agent should run `db push` / `migrate deploy` against Neon at a time |
| 6 | Stale test account `pt.test@ironfit.com` | Exists in DB with role `MEMBER`, no `TrainerProfile` — leftover from an earlier test, safe to ignore or delete |

---

## 🗄️ Database — Neon Production (14 tables)

| Group | Tables | Notes |
|---|---|---|
| Original (May 2026) | `User`, `MembershipPlan`, `UserMembership`, `ChatHistory`, `KnowledgeBase` | 5 original migrations |
| Batch 1 (deployed 21/07/2026) | `Payment`, `Notification`, `BodyProgress`, `Attendance`, `BodyGoal` | Code existed earlier but had **never been deployed to Neon** — this was the root cause of payment/notification/progress/check-in features failing in production while working locally |
| Batch 2 | `TrainerProfile`, `Booking` | Trainer profile + member booking |
| Batch 3 | `TrainerSchedule`, `TrainerCheckIn` | Trainer work schedule + timekeeping |

Schema fixes applied: declared `extensions = [vector]` correctly in `datasource` (was missing, broke pgvector-related CI/migrations); added missing `Payment.membershipPlan` relation; removed 4 redundant indexes duplicating existing unique constraints (`User.email`, `UserMembership.userId`, `BodyGoal.userId`, `Payment.transactionId`); rebaselined messy local migration history (did not affect Neon's real history).

---

## 🌐 Route / UI Coverage by Role

| Role | Live routes | Missing |
|---|---|---|
| **Admin** | `/admin`, `/admin/users`, `/admin/membership`, `/admin/payment`, `/admin/trainers`, `/admin/booking`, `/admin/trainer-schedules` (in progress), `/admin/trainer-checkins` (in progress) | Nearly complete |
| **Member** | `/member`, `/member/ai-chat`, `/member/membership`, `/member/check-in`, `/member/progress`, `/member/booking` | Complete |
| **PT** | `/pt/dashboard` only | 4 pages planned — student roster, schedule, student progress view, self check-in |

---

## 🚀 Infrastructure

| Item | Before | Current |
|---|---|---|
| Backend hosting | Railway (free trial credit exhausted, service stopped) | **Render** — `https://gym-management-dwvx.onrender.com` |
| Render runtime | Docker (auto-detected) | Manually switched to **Node** |
| Render build command | — | `npm install --include=dev && npx prisma generate && npm run build` |
| Render start command | — | `npm run start` (`node dist/src/server.js`) |
| `VNPAY_RETURN_URL` | Pointed at old Railway domain | Updated to Render domain |
| Redis | Used on Railway | Not available on Render free tier — app gracefully falls back without cache |

⚠️ **Operational note:** Render free tier sleeps after ~15 min of no traffic. First request after sleep takes ~30-50s to wake up — open the link a few minutes before any live demo.

---

## 🧪 Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@ironfit.com` | `Admin123456` |
| PT | `pt.demo@ironfit.com` | `Trainer123456` |

---

## 📦 Tech Stack

| Component | Technology | Version |
|---|---|---|
| Backend | Node.js + Express + TypeScript | 20.x |
| Frontend | Next.js + TailwindCSS + Zustand + Recharts | 16.2.7 |
| Database | PostgreSQL + pgvector | 16 |
| ORM | Prisma | 6.19.3 |
| AI | Gemini 2.0 Flash + gemini-embedding-001 (RAG) **or** self-trained Qwen 2.5 1.5B (LoRA, local FastAPI) | - |
| Payment | VNPay + MoMo | - |
| CI/CD | GitHub Actions | - |
| Hosting | Render + Vercel + Neon | - |
| Cache | Redis (optional, graceful fallback) | - |

---

## 📋 All Issues (Original Roadmap #1–#26, #89)

| Issue | Title | Status |
|-------|-------|--------|
| #1 | Setup repository structure | ✅ Closed |
| #2 | Setup NodeJS + TypeScript Backend | ✅ Closed |
| #3 | Setup PostgreSQL + Prisma | ✅ Closed |
| #4 | Users schema + Roles | ✅ Closed |
| #5 | Register API | ✅ Closed |
| #6 | Login API | ✅ Closed |
| #7 | Auth Middleware | ✅ Closed |
| #8 | Membership System schema | ✅ Closed |
| #9 | GET membership plans API | ✅ Closed |
| #10 | Buy membership API | ✅ Closed |
| #11 | AI Chat History schema | ✅ Closed |
| #12 | Gemini RAG integration | ✅ Closed |
| #13 | AI usage limiting | ✅ Closed |
| #14 | NextJS Frontend setup | ✅ Closed |
| #15 | Login page | ✅ Closed |
| #16 | Dashboard UI | ✅ Closed |
| #17 | User Management table | ✅ Closed |
| #18 | Payments schema | ✅ Closed |
| #19 | VNPay + MoMo integration | ✅ Closed |
| #20 | Notification system | ✅ Closed |
| #21 | Body Progress Tracking | ✅ Closed |
| #22 | API & Security Testing | ✅ Closed |
| #23 | Database Optimization | ✅ Closed |
| #24 | Deploy Backend (Docker → later migrated to Render) | ✅ Closed |
| #25 | Deploy Frontend Web | ✅ Closed |
| #26 | Final Production Release | ⏳ Pending — see Phase 7 known issues before closing |
| #89 | AI Chat UI (web pivot) | ✅ Closed |

---

## 🔜 Next Steps

1. Complete 4 remaining PT-facing pages (roster, schedule, student progress, self check-in)
2. Finish Admin UI for `trainer-schedules` and `trainer-checkins`
3. Re-verify the login redirect fix (confirm the `user is not defined` build error is fully resolved)
4. Rotate all secrets exposed during the debugging sessions
5. Decide on a permanent path for the Qwen AI provider (currently tunnel-dependent) or default to Gemini for any unattended demo
6. Update `ARCHITECTURE.MD` to reflect all 14 tables
7. Re-evaluate closing Issue #26 once the above items are resolved