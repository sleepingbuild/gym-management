# PROJECT STATUS

**Project:** Gym Management System (IronFit Pro)
**Team Size:** Multiple agents coordinated on different areas (Backend/DB, AI/embedding, Face check-in, Schedule/Membership/Payment)
**Current Phase:** ✅ Released — v1.0.0
**Last Updated:** 02/08/2026
**Version:** v1.0.0

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
| Phase 7 - PT & Trainer Management | ✅ Completed | 100% |
| Phase 8 - Face Check-in, Trainer Scheduling, Membership Cancel, AI Chatbot v2 | ✅ Completed | 100% |

> Phases 7–8 cover features added after the original 26-issue roadmap and are not tracked as numbered GitHub issues: PT booking system, trainer profile management, trainer work schedules (with a real weekly-grid UI), trainer check-in via face recognition, membership self/admin-cancel, and the Qwen-only RAG chatbot with streaming + multi-session chat.

---

## 🎯 Phase 7–8 — Feature Summary

| Feature | Backend (schema/API) | Frontend UI | Status |
|---|---|---|---|
| PT Booking (member books trainer) | ✅ Done | ✅ Done | ✅ Complete |
| PT Dashboard (own students/stats) | ✅ Done | ✅ Done | ✅ Complete |
| PT: student roster, schedule, student progress view | ✅ Done | ✅ Done | ✅ Complete |
| Admin: Trainer management (CRUD) | ✅ Done | ✅ Done | ✅ Complete |
| Admin: Trainer working-hours schedule | ✅ Done | ✅ Done (weekly grid) | ✅ Complete |
| Admin: Bulk-create trainer schedules (`POST /admin/trainer-schedules/bulk`) | ✅ Done | ✅ Done | ✅ Complete — apply one shift template to multiple trainers/weekdays at once, skips conflicting combos individually |
| Admin: Booking oversight | ✅ Done | ✅ Done | ✅ Complete |
| Admin: Revenue, membership distribution & payment history/stats | ✅ Done | ✅ Done | ✅ Complete |
| Face check-in (Member/PT self, Admin Kiosk, Admin enroll) | ✅ Done | ✅ Done | ✅ Complete — replaces the old QR check-in and manual PT check-in, both deleted |
| Admin: trainer check-in report | ✅ Done | ✅ Done | ✅ Complete |
| Membership self-cancel (Member) | ✅ Done | ✅ Done | ✅ Complete |
| Membership assign/cancel on behalf of user (Admin) | ✅ Done | ✅ Done | ✅ Complete |
| VNPay payment actually enforced for paid plans | ✅ Done | ✅ Done | ✅ Complete — merchant approved, live end-to-end |
| Email verification + Terms acceptance | ✅ Done | ✅ Done | ✅ Complete |
| AI Chatbot — Qwen-only RAG, streaming, multi-session | ✅ Done | ✅ Done | ✅ Complete (still tunnel-dependent — see Known Issues) |

---

## ⚠️ Known Issues — Not Yet Resolved

| # | Issue | Notes |
|---|---|---|
| 1 | Qwen AI provider depends on a personal ngrok tunnel | Only works while a specific developer's machine + `serve.py` + ngrok are running; not viable as a permanent production path |
| 2 | Debug-session secrets not yet rotated | `JWT_SECRET`, `JWT_REFRESH_SECRET`, Neon DB password, and various tried email-provider API keys were exposed during troubleshooting sessions and should be rotated before real-world use |
| 3 | No "resend verification email" flow | If a verification token expires or the send fails, the user currently has no self-service recovery path |
| 4 | No automated tests for newer endpoints | `trainer-schedules`, `available-slots`, admin membership edit, member cancel are untested |
| 5 | `membershipService.getPlans()` (frontend) returns a doubly-nested `response.data.data.plans.plans` | Works, but unconfirmed whether intentional |
| 6 | "Cancelled" membership reuses the `SUSPENDED` status | May need a dedicated enum value later to distinguish user-cancel vs admin-lock vs natural expiry |

### ✅ Resolved for v1.0.0
- VNPay — old sandbox merchant had gone invalid (new one registered); amount was being double-multiplied (`*1000` in controller + `*100` in service, fixed to multiply once); signature encoding used the `qs` library instead of `URLSearchParams`, which didn't match VNPay's required format — all three fixed, full flow (create → redirect → sandbox payment → return → activation) verified on local and production
- Neon migration history — reconciled via a fresh baseline reflecting Neon's true schema (including the two duplicate `add_vector_embedding` folders and the previously-unrecorded `TrainerSchedule`/`TrainerCheckIn` tables); `migrate deploy` now works normally going forward
- `VNPAY_RETURN_URL` / `VNPAY_URL` / MoMo return/IPN/endpoint vars — added to `backend/.env.example`

---

## 🗄️ Database — Neon Production

| Group | Tables | Notes |
|---|---|---|
| Original (May 2026) | `User`, `MembershipPlan`, `UserMembership`, `ChatHistory`, `KnowledgeBase` | 5 original migrations |
| Batch 1 | `Payment`, `Notification`, `BodyProgress`, `Attendance`, `BodyGoal` | `Attendance` (QR) kept in schema for historical data but no longer written to |
| Batch 2 | `TrainerProfile`, `Booking` | Trainer profile + member booking |
| Batch 3 | `TrainerSchedule`, `TrainerCheckIn` | Trainer work schedule + face/manual timekeeping |
| Batch 4 | `FaceProfile`, `ChatSession` | Face check-in descriptors; multi-session AI chat |

`KnowledgeBase.embedding` was migrated from `vector(3072)` (Gemini) to `vector(384)` (Qwen's multilingual embedding model) via a hand-written migration, since Prisma does not auto-generate `ALTER` SQL for `Unsupported("vector(N)")` size changes.

---

## 🌐 Route / UI Coverage by Role

| Role | Live routes |
|---|---|
| **Admin** | `/admin`, `/admin/users`, `/admin/membership`, `/admin/payment`, `/admin/trainers`, `/admin/trainer-schedules`, `/admin/booking`, `/admin/face-enroll`, `/admin/face-kiosk`, `/admin/trainer-checkins` |
| **Member** | `/member`, `/member/ai-chat`, `/member/membership`, `/member/face-checkin`, `/member/progress`, `/member/bookings`, `/member/trainers`, `/member/payments` |
| **PT** | `/pt`, `/pt/clients`, `/pt/clients/progress`, `/pt/schedule`, `/pt/face-checkin` |

---

## 🚀 Infrastructure

| Item | Value |
|---|---|
| Backend hosting | **Render** — `https://gym-management-dwvx.onrender.com` |
| Frontend hosting | Vercel and/or Render |
| Render runtime | Node (`npm install --include=dev && npx prisma generate && npm run build`, start via `npm run start`) |
| Database | Neon (PostgreSQL 16 + pgvector) |
| Email | Mailjet (REST API over HTTPS) |
| Redis | Not available on Render free tier — app gracefully falls back without cache |

⚠️ **Operational note:** Render free tier sleeps after ~15 min of no traffic. First request after sleep takes ~30-50s to wake up — open the link a few minutes before any live demo. The AI chatbot additionally requires a developer's local Qwen `serve.py` + ngrok tunnel to be running.

---

## 🧪 Test Accounts (Neon)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@ironfit.com` | `Admin123456` |
| Member | `member1@ironfit.com` → `member10@ironfit.com` | `Member123456` |
| PT | `pt.demo@ironfit.com`, `pt2@ironfit.com` → `pt6@ironfit.com` | `Trainer123456` |

---

## 📦 Tech Stack

| Component | Technology | Version |
|---|---|---|
| Backend | Node.js + Express + TypeScript | 20.x |
| Frontend | Next.js + TailwindCSS + Zustand + Recharts | 16.2.7 |
| Database | PostgreSQL + pgvector | 16 |
| ORM | Prisma | 6.19.3 |
| AI | Self-trained Qwen 2.5 1.5B (LoRA), RAG via pgvector + multilingual embeddings, FastAPI | - |
| Face recognition | face-api.js (client-side) | - |
| Payment | VNPay + MoMo | - |
| Email | Mailjet | - |
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
| #12 | AI RAG integration (originally Gemini, now Qwen-only) | ✅ Closed |
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
| #26 | Final Production Release | ✅ Closed — v1.0.0 |
| #89 | AI Chat UI (web pivot) | ✅ Closed |

---

## 🔜 Next Steps (post-v1.0.0)

1. Rotate all secrets exposed during debugging sessions
2. Decide on a permanent, tunnel-free hosting path for the Qwen AI provider (e.g. a cloud GPU)
3. Add automated tests for trainer-schedules, available-slots, admin membership edit, and member cancel
4. Build the "resend verification email" flow
5. Consider a dedicated `MembershipStatus` value to distinguish cancel reasons