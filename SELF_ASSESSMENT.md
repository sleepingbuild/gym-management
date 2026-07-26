# Student Repository Self-Assessment

## 1. Project information

- Project name: IronFit Pro — Gym Management System
- Repository URL: https://github.com/sleepingbuild/gym-management
- Team name: IronFit Team
- Team members:
  - Phạm Hoàng Phi - Backend Lead & Fullstack (Backend APIs, Database, Deployment, Frontend Integration)
  - Giang Văn Quang - Frontend Lead (UI/UX, Components, State Management, API Integration)
- Course / assignment: Software Engineering
- Demo URL or video:
  - Frontend Live: https://gym-management-five-gules.vercel.app *(verify current Vercel domain before submission — may have changed)*
  - Backend API: https://gym-management-dwvx.onrender.com *(migrated from Railway after free-tier credit ran out; Render free tier sleeps after ~15 min idle — open the link a few minutes before a live demo)*
- Main tech stack:
  - Frontend: Next.js 16, TailwindCSS, Zustand, Recharts
  - Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL + pgvector, Redis (optional)
  - AI: Gemini 2.0 Flash + gemini-embedding-001 (RAG), **or** a self-trained Qwen 2.5 1.5B (LoRA fine-tuned, served locally via FastAPI) — switchable via `AI_PROVIDER` env var
  - Payment: VNPay, MoMo
  - Deployment: Vercel (frontend), Render (backend), Neon (database)
  - Container: Docker (used for local dev; Render deployment runs Node directly, not the Docker image)

## 2. Product vision and users

### Product vision

Following the product vision framework (Sommerville — *what, who, why*), full statement documented in [README.md § Product Vision](./README.md#-product-vision):

- **What is the product to be developed?**
  IronFit Pro — a gym management platform combining membership management, PT booking & scheduling, AI-powered fitness coaching, and local payment integration (VNPay/MoMo).

- **Who are the target customers and users?**
  Small-to-medium gym owners/managers in Vietnam who need affordable digital management tools; gym members who want instant AI-powered fitness/nutrition advice and easy PT booking; personal trainers who need to manage their student roster and schedule.

- **Why should customers buy this product?**
  Lower operating cost (AI chatbot reduces reliance on human consultation staff); reduced vendor lock-in (dual AI provider — cloud Gemini or self-trained Qwen — gives flexibility between cost, latency, and data privacy); local payment support (VNPay/MoMo); low-cost cloud-native deployment suitable for small gyms.

### Target users / stakeholders

- **Admin**: Gym owner/manager who manages users, memberships, payments, trainers, bookings, and views system statistics.
- **Member**: Gym member who registers for plans, chats with the AI trainer, books PT sessions, tracks body progress, sets fitness goals, and checks in via QR.
- **PT (Personal Trainer)**: Trainer who views their booked sessions and student roster; a self-service check-in (timekeeping) and richer student-progress views are still being built (see Known Limitations).

### Main scenarios or user stories

| ID | Persona/User | Scenario or user story | Acceptance criteria | Implemented? | Evidence |
|---|---|---|---|---|---|
| US-1 | Member | Register and log in to the system | User can sign up with email/password and log in, redirected to the dashboard matching their role | Yes | `auth.controller.ts`, `app/(auth)/login/page.tsx` |
| US-2 | Member | Purchase a membership plan | User can view plans, buy one, and see active membership status | Yes | `membership.controller.ts`, `/member/membership` |
| US-3 | Member | Chat with AI fitness coach | User can ask fitness/nutrition questions and receive an AI-generated response (Gemini RAG or self-trained Qwen) | Yes | `ai.controller.ts`, `providers/gemini.provider.ts`, `providers/qwen.provider.ts`, `/member/ai-chat` |
| US-4 | Member | Track body progress (weight, BMI, body fat) | User can add progress records, view charts and statistics | Yes | `bodyProgress.controller.ts`, `/member/progress` |
| US-5 | Member | Check-in/out using QR code | User can generate a QR, check in/out, and view history | Yes | `attendance.controller.ts`, `/member/check-in` |
| US-6 | Member | Set fitness goals | User can set target weight/BMI/body fat and track achievement | Yes | `bodyGoal.controller.ts`, `/member/progress` |
| US-7 | Member | Book a session with a personal trainer | User can pick an active trainer + time slot, view/cancel their own bookings | Yes | `booking.controller.ts`, `/member/booking` |
| US-8 | Admin | Manage users (lock/unlock, change roles) | Admin can view user list, toggle active status, change roles | Yes | `admin.controller.ts`, `/admin/users` |
| US-9 | Admin | View revenue and membership distribution | Admin sees monthly revenue chart and plan distribution | Yes | `admin.controller.ts` (`/admin/revenue`, `/admin/memberships/distribution`), `/admin` |
| US-10 | Admin | Manage trainer profiles | Admin can add/edit/remove trainers (specialties, bio, status) | Yes | `admin.controller.ts`, `/admin/trainers` |
| US-11 | Admin | Oversee all bookings | Admin sees all bookings, can confirm/cancel | Yes | `admin.controller.ts`, `/admin/booking` |
| US-12 | Admin | View and manage trainer work schedules | Admin sees all trainers' schedules | Schema ready, UI in progress | `TrainerSchedule` model; `/admin/trainer-schedules` (in progress) |
| US-13 | Admin | View trainer check-in / timekeeping status | Admin sees which trainers checked in today | Schema ready, UI in progress | `TrainerCheckIn` model; `/admin/trainer-checkins` (in progress) |
| US-14 | PT | View own students and today's bookings/stats | PT dashboard shows student list (derived from confirmed/completed bookings) and stats | Yes | `pt.controller.ts`, `/pt/dashboard` |
| US-15 | PT | Self check-in once per day (timekeeping) | PT clicks a button to confirm attendance; limited to once/day | Not implemented — schema ready | `TrainerCheckIn` model exists, no controller/route/UI yet |
| US-16 | PT | View own weekly schedule | PT sees which time slots they're booked/working | Not implemented | `Booking`/`TrainerSchedule` data exists, no dedicated page yet |
| US-17 | PT | View a specific student's progress | PT opens a student's body-progress history | Not implemented | `BodyProgress` data exists, no PT-facing page yet |

## 3. Architecture and design decisions

Architecture: Client-Server with RESTful API, 3 role-based dashboards (Admin / PT / Member).

- **Frontend**: Next.js App Router, Zustand for state, Axios for API calls, Tailwind for styling, Recharts for admin analytics.
- **Backend**: Express.js with layered architecture (Controller → Service → Prisma). Zod for validation, JWT for auth, bcrypt for password hashing.
- **Database**: PostgreSQL (Neon) with pgvector extension for AI embeddings. Prisma as ORM. 14 tables in production (see [PROJECT_STATUS.md](./PROJECT_STATUS.md) for the full list and history of when each was actually deployed).
- **AI**: Two interchangeable providers behind a shared `AIProvider` interface — Gemini 2.0 Flash + gemini-embedding-001 with a RAG pipeline (embedding → pgvector similarity search → Gemini response), or a self-trained Qwen 2.5 1.5B model (LoRA fine-tuned on gym FAQ data, served via a local FastAPI process). Selected at runtime via `AI_PROVIDER`.
- **Caching**: Redis (optional; the current Render deployment runs without it — the app is written to fall back gracefully).
- **Deployment**: Backend on Render, Frontend on Vercel, DB on Neon. Docker is used for local development only.

| Decision | Course concept used | Why this decision? | Repo evidence | Trade-off / limitation |
|---|---|---|---|---|
| Controller-Service-Prisma layering | Software architecture | Separates HTTP handling, business logic, and persistence; improves testability and maintainability | `backend/src/controllers/*`, `backend/src/services/*` | Adds boilerplate, but pays off as the number of features (booking, PT, trainer mgmt) grew |
| JWT with refresh tokens | Security and privacy | Short-lived access token (15m) limits exposure; refresh token (7d) preserves UX | `utils/generateToken.ts` | More complex than sessions; requires rotation logic |
| Zod for input validation | Reliable programming | Rejects invalid data before it reaches business logic | `backend/src/validators/*.ts` | Adds boilerplate per endpoint |
| pgvector for RAG | Cloud-based software / AI | Enables semantic search over a gym knowledge base | `KnowledgeBase` model | Extension must be explicitly declared and provisioned; caused a real production outage when a migration didn't declare it correctly (fixed) |
| Dual AI provider via a shared interface | Design for change / vendor independence | Avoids hard dependency on one paid API; lets the team swap providers without touching call sites | `services/providers/*.provider.ts`, `services/ai.service.ts` | The self-trained provider currently only works through a personal ngrok tunnel — not production-ready as a permanent path |
| Redis for caching | Performance optimization | Reduces DB load for frequently-read data | `config/redis.ts` | Optional/best-effort; current production deployment runs without it (Render free tier has no Redis) |
| Docker for local development | DevOps and reproducibility | Standardizes the dev environment | `docker-compose.yml`, `Dockerfile` | Production hosting (Render) ended up running Node directly rather than the Docker image, due to platform constraints around `devDependencies` at build time |

## 4. How to run

```bash
# Clone repository
git clone https://github.com/sleepingbuild/gym-management.git
cd gym-management

# Backend
cd backend
cp .env.example .env   # fill in your environment variables
npm install
npx prisma migrate deploy
npx prisma db seed
npx tsx prisma/seed-knowledge.ts   # seeds AI knowledge base for Gemini RAG
npm run dev
# Backend runs on http://localhost:5000

# Frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev
# Frontend runs on http://localhost:3000

# Test
cd backend
npm test

# Build for production
cd backend && npm run build
cd frontend && npm run build

# Docker (optional, local dev only)
docker-compose up --build
```

## 5. Testing and verification

| Test type | What is verified? | Command or evidence | Result |
|---|---|---|---|
| Unit / Integration (Jest) | Auth, Membership, Admin, Body Progress APIs | `cd backend && npm test` | 16 tests passed as of last full run — **re-run before submission**, several new modules (booking, PT, trainer management) were added afterward and are not yet covered |
| Manual API tests | Registration, login, membership purchase, AI chat (both providers), booking creation/cancellation | PowerShell/curl during development | All endpoints returned expected responses |
| UI manual tests | Login/role redirect, registration, QR check-in, goal setting, booking flow, PT dashboard | Manual browser testing on production URLs | Core flows work; 4 PT-facing pages not yet built (see Known Limitations) |

Important user scenarios verified:

- **Scenario 1 (Member signup & login)**: User registers, receives JWT, redirected to the dashboard matching their role.
- **Scenario 2 (Membership purchase)**: User buys a plan, membership status appears on the dashboard.
- **Scenario 3 (AI chat)**: User asks a fitness question, receives a response from either Gemini (RAG) or the self-trained Qwen model depending on `AI_PROVIDER`.
- **Scenario 4 (Progress tracking)**: User adds weight/height, BMI auto-calculated, chart displays.
- **Scenario 5 (QR check-in)**: User generates a QR, checks in, history updates.
- **Scenario 6 (Booking)**: Member picks a trainer + time slot, sees the booking as PENDING, can cancel it; a duplicate booking for the same trainer/date/slot is rejected.
- **Scenario 7 (PT dashboard)**: Trainer logs in, sees their own student list (derived from CONFIRMED/COMPLETED bookings) and today's stats.

### CI/CD Status

GitHub Actions runs lint + typecheck + build on every push to `main` (backend and frontend jobs). This was fixed and verified passing earlier in development; given the volume of new files added since (booking, PT, trainer management), **re-check the Actions tab before submission** to confirm it's still green rather than assuming so from this document.

## 6. Security, privacy, and reliability

### Security/privacy checklist

- [x] No real secrets committed to the repository.
- [x] `.env.example` uses safe placeholder values.
- [x] Authentication/authorization implemented (JWT, RBAC).
- [x] Important inputs are validated (Zod).
- [x] Sensitive data is not unnecessarily collected or exposed.
- [ ] **Secrets rotated after debugging sessions** — `JWT_SECRET`, `JWT_REFRESH_SECRET`, the Neon DB password, `GEMINI_API_KEY`, and `VNPAY_HASH_SECRET` were pasted into terminals/logs during troubleshooting and have not been rotated yet. This should be done before the system is used beyond coursework.

### Reliability and edge cases

| Edge case / failure | Handling strategy | Evidence |
|---|---|---|
| Invalid email/password on login | Returns 404/401 with appropriate error code | `auth.service.ts` |
| Missing JWT token | Returns 401 with AUTH_006 | `auth.middleware.ts` |
| Expired QR code | Returns 400 with ATTENDANCE_001 | `attendance.service.ts` |
| Duplicate goal creation | Returns 400 with GOAL_001 | `bodyGoal.service.ts` |
| Double-booking the same trainer/date/slot | Returns 409 (BOOKING_003) | `booking.controller.ts` |
| AI provider unreachable (e.g. Gemini quota exceeded, Qwen tunnel down) | Error surfaces to the chat UI instead of a raw 500; does not crash the request | `ai.controller.ts`, `providers/*.provider.ts` |
| Database connection failure | Health check returns 503, error logged | `/api/health` |
| Empty progress/booking data | UI shows an explicit "no data yet" state instead of a blank screen | Progress/booking pages |

## 7. DevOps, code management, and teamwork

- Branching strategy: Feature branches from `main`, PRs required for merging (enforced starting from Issue #89 onward).
- Issues/tasks used: GitHub Issues #1–#26, #89; later PT/booking/trainer-management work was tracked via PRs rather than numbered issues (see [PROJECT_STATUS.md](./PROJECT_STATUS.md) Phase 7).
- Pull requests/reviews used: PRs for #21–#25, #89, PT dashboard, member booking, and admin trainer/booking management.
- CI/CD: GitHub Actions (lint, typecheck, build) on every push/PR to `main`; Vercel auto-deploys the frontend from `main`; Render auto-deploys the backend from `main`.
- Deployment/demo process:
  - Backend: Render (auto-deploy from `main`) — **note: free tier sleeps after ~15 min idle**
  - Frontend: Vercel (auto-deploy from `main`)
  - Database: Neon (managed PostgreSQL + pgvector)

Evidence:

- Commit/PR/issue links: https://github.com/sleepingbuild/gym-management/pulls?q=is%3Apr+is%3Aclosed
- CI/deployment links: https://github.com/sleepingbuild/gym-management/actions

## 8. Group self-score: 80 points

| Category | Max | Self-score | Evidence |
|---|---:|---:|---|
| Product vision, users, features, scenarios, and stories | 10 | 9 | README, user stories table above covering all 3 roles including in-progress items honestly marked |
| Functionality and delivered product value | 14 | 12 | Core features (auth, membership, AI, progress, QR check-in, goals, booking, admin analytics) work end-to-end; 4 PT-facing pages still missing |
| Architecture and design rationale | 12 | 11 | Clear separation of concerns; dual AI provider abstraction is a notable design decision, documented above |
| Code quality, maintainability, and reliable programming | 10 | 9 | TypeScript, Zod validation, consistent error-code system across modules |
| Testing and verification strategy | 9 | 7 | Existing Jest suite covers original modules; newer modules (booking, PT, trainer management) not yet covered by automated tests |
| Security, privacy, and configuration hygiene | 7 | 6 | Strong baseline (JWT, bcrypt, RBAC, validation) but debug-session secrets not yet rotated — deducted for this |
| DevOps, code management, and reproducibility | 9 | 8 | GitHub Actions, clear README, PR-based workflow for recent features; migration process had a real incident (resolved, documented in PROJECT_STATUS.md) |
| Documentation, self-assessment, and theory-practice traceability | 9 | 8 | README, PROJECT_STATUS, this document, and RELEASE_EVIDENCE all kept in sync with actual repo state as of this writing |
| **Total** | **80** | **70** | |

## 9. Theory-to-practice evidence

| Course concept | Engineering decision | Repo evidence | Result / limitation |
|---|---|---|---|
| User stories → features | Defined user stories per role and implemented most of them; explicitly tracked which remain in progress rather than marking everything "done" | Issue tracker, PROJECT_STATUS.md, table above | Admin/Member stories fully implemented; 3 PT stories still pending UI |
| Architecture layering | Controller-Service-Prisma pattern | `controllers/`, `services/`, `schema.prisma` | Scaled reasonably well as booking/PT/trainer features were added later |
| Design for change | Abstracted AI calls behind an `AIProvider` interface so the chat feature isn't hard-coupled to Gemini | `services/providers/gemini.provider.ts`, `services/providers/qwen.provider.ts` | Successfully swapped providers via one env var without touching `ai.service.ts`; the self-trained provider is not yet deployable outside a dev machine + tunnel |
| Security and privacy | JWT, bcrypt, input validation, environment variables | `utils/generateToken.ts`, `validators/*.ts` | Solid baseline; secret rotation after debugging is an acknowledged gap |
| Reliable programming | Zod validation, centralized `AppError` + error codes, empty/error UI states | `validators/*.ts`, `error.middleware.ts` | Consistent error-code convention across every module added (e.g. `BOOKING_00x`) |
| Testing | Jest unit/integration tests for original modules | `tests/unit/*.test.ts`, `tests/integration/*.test.ts` | Coverage gap for newer modules is explicitly acknowledged rather than hidden |
| DevOps/Reproducibility | CI/CD, environment variable management, a mid-project hosting migration (Railway → Render) documented rather than silently done | `.github/workflows/ci.yml`, PROJECT_STATUS.md | Migration required real debugging (build paths, missing env vars, CORS) — captured as a learning experience |

## 10. Individual self-assessment

### Student name: Phạm Hoàng Phi

| Category | Max | Self-score | Evidence |
|---|---:|---:|---|
| Meaningful technical contribution | 7 | 7 | Backend APIs, database schema, dual AI provider integration, payment, deployment (including the Railway→Render migration), booking/PT/trainer-management backend |
| Theory-informed ownership and explanation | 5 | 5 | Can explain every architecture decision above, including trade-offs of the AI provider abstraction and the production migration incident |
| Collaboration, agile teamwork, and professionalism | 3 | 3 | GitHub issues, PRs, and documentation kept current as scope grew significantly beyond the original 26-issue plan |
| Testing, documentation, DevOps, and quality practices | 3 | 2 | Backend tests exist but don't yet cover the newest modules; documentation is current |
| Reflection and improvement mindset | 2 | 2 | Known limitations are stated explicitly rather than glossed over (see Section 11) |
| **Total** | **20** | **19** | |

**Contribution evidence - Phạm Hoàng Phi:**

- **Main files/features owned:** Backend controllers/services/routes/validators/middleware; Prisma schema and migrations; dual AI provider pipeline (Gemini RAG + self-trained Qwen); Payment (VNPay/MoMo); Notifications; Body Progress, QR Check-in, Goal Setting, Booking, PT, and Trainer Management APIs; Docker config; Render & Vercel deployment.
- **Important commits/PRs/issues:** https://github.com/sleepingbuild/gym-management/commits/main?author=sleepingbuild
- **Course concepts applied:** Layered architecture, JWT security, input validation, cloud deployment, provider abstraction for vendor independence.
- **Design/security/testing/reliability trade-offs I can explain:** REST over GraphQL for simplicity; JWT over sessions for statelessness; pgvector for RAG despite setup complexity (and a real outage it caused); Redis optional with graceful fallback; self-trained AI provider trades reliability (tunnel-dependent) for independence from a paid API's quota.
- **What I learned:** The gap between "works locally" and "works in production" (several features had never actually been deployed to the production database until debugged); the operational cost of free-tier hosting platforms (Railway credits, Render sleep behavior); coordinating schema changes safely when multiple people touch the same migration history.
- **What I would improve next:** Add test coverage for booking/PT/trainer-management modules; rotate all secrets used during debugging; find a permanent (non-tunnel) hosting path for the self-trained AI model or default to Gemini for unattended demos.

---

### Student name: Giang Văn Quang

| Category | Max | Self-score | Evidence |
|---|---:|---:|---|
| Meaningful technical contribution | 7 | 6 | Frontend UI/UX for Member and Admin flows, including the newer booking and trainer-management screens; PT-facing pages still incomplete |
| Theory-informed ownership and explanation | 5 | 5 | Can explain component architecture, state management, and API integration patterns used throughout |
| Collaboration, agile teamwork, and professionalism | 3 | 3 | Collaborated on requirements and integrated with backend APIs as they were added |
| Testing, documentation, DevOps, and quality practices | 3 | 3 | UI manual testing across roles, contributed to README/screenshots |
| Reflection and improvement mindset | 2 | 2 | Acknowledged remaining PT-page gaps and mock-scanner limitation |
| **Total** | **20** | **19** | |

**Contribution evidence - Giang Văn Quang:**

- **Main files/features owned:** Frontend pages (Login, Register, Admin Dashboard, Member Dashboard, AI Chat, Progress, QR Check-in, Membership, Booking); UI components; Zustand store; Axios client; design system (TailwindCSS, cream/coral/dark-navy theme).
- **Important commits/PRs/issues:** https://github.com/sleepingbuild/gym-management/commits/main?author=Quang1856
- **Course concepts applied:** Component-based architecture (Next.js App Router), state management, responsive UI, API integration patterns.
- **Design/security/testing/reliability trade-offs I can explain:** Next.js App Router for SEO/performance; Zustand over Redux for simplicity; TailwindCSS for rapid iteration; explicit empty/loading/error states rather than blank screens.
- **What I learned:** Keeping UI in sync with a backend that was evolving quickly (new tables/endpoints for booking, PT, trainer management appearing mid-project); the cost of Tailwind config drift (a version mismatch briefly broke all styling in production).
- **What I would improve next:** Build the remaining 4 PT-facing pages (roster, schedule, student progress, self check-in); replace the mock QR scanner with real camera integration; add E2E tests with Playwright.

## 11. Known limitations

- **4 PT-facing pages not yet built**: student roster detail, own schedule view, student progress view, and self check-in (timekeeping). Backend data/schema is ready for all of them (`Booking`, `BodyProgress`, `TrainerCheckIn`); only the UI + wiring remains.
- **Admin UI for trainer schedules and trainer check-ins is in progress**, not yet complete.
- **Debug-session secrets have not been rotated**: `JWT_SECRET`, `JWT_REFRESH_SECRET`, the Neon DB password, `GEMINI_API_KEY`, and `VNPAY_HASH_SECRET` were exposed in terminal output/logs while troubleshooting production issues. This must be done before the system is used for anything beyond coursework.
- **The self-trained Qwen AI provider depends on a personal ngrok tunnel.** It only works while a specific developer's machine is running `serve.py` + ngrok; it is not a production-viable path as-is. Gemini remains the default (`AI_PROVIDER=gemini`) for anything that needs to work unattended.
- **VNPay sandbox is awaiting merchant approval** (Error 72) — signature and flow were verified correct; this is blocked by external onboarding, not a code issue.
- **QR scanner is mock** — user manually enters/confirms the QR rather than a real camera-based scan.
- **Goal achievement check is manual** (user clicks a button); no push notification yet.
- **Redis caching is optional** and not available on the current Render free-tier deployment; the app runs correctly without it.
- **No automated E2E tests**; Jest unit/integration coverage exists for the original modules but not yet for booking/PT/trainer-management.
- **A stale test account** (`pt.test@ironfit.com`) exists with role `MEMBER` and no `TrainerProfile` — a leftover from early testing, safe to ignore or delete.
- **A mid-project hosting migration occurred** (Railway → Render) after the Railway free-trial credit was exhausted. Anyone reviewing older commits/docs may see Railway URLs that are no longer live — current URLs are listed in Section 1 above and in README.md.

## 12. Final submission checklist

- [x] README explains project purpose and features.
- [x] Product vision and target users are clear.
- [x] Main scenarios/user stories are documented, including honestly-marked in-progress items.
- [x] Setup instructions work from a clean machine.
- [x] `.env.example` exists and contains no real secrets.
- [x] Build/run/test commands are documented.
- [x] Core features have tests or clear verification evidence.
- [x] Security/privacy risks are considered — **including an explicit unresolved item (secret rotation)**.
- [x] Architecture/design choices are documented.
- [x] DevOps/code management evidence is available, including a documented production incident and its resolution.
- [x] No real credentials are committed.
- [ ] Main user flows are demonstrated with screenshots/video — **all 10 existing images predate the current UI redesign and are stale. Deferred: will retake after the remaining 4 PT pages (roster, schedule, student progress, self check-in) are built, to avoid re-shooting twice.** See retake list in project notes.
- [x] Team member contributions are documented.
- [x] Theory-to-practice examples are specific and evidence-based.
- [x] Known limitations are stated honestly.