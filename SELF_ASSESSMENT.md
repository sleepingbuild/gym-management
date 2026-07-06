# Student Repository Self-Assessment

This template is aligned with Ian Sommerville's *Engineering Software Products*. Do not only state theory; connect course concepts to evidence in the repository.

## 1. Project information

- Project name: IronFit Pro — Gym Management System
- Repository URL: https://github.com/sleepingbuild/gym-management
- Team name: IronFit Team
- Team members:
  - [Your Name] - Fullstack Developer (Backend & Frontend)
- Course / assignment: Software Engineering
- Demo URL or video:
  - Frontend Live: https://gym-management-five-gules.vercel.app
  - Backend API: https://gym-management-production-44b5.up.railway.app
  - Screenshots: [Thêm link ảnh nếu có]
- Main tech stack:
  - Frontend: Next.js 16, TailwindCSS, Zustand, Recharts
  - Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL + pgvector, Redis
  - AI: Gemini 2.0 Flash, gemini-embedding-001
  - Payment: VNPay, MoMo
  - Deployment: Vercel, Railway, Neon
  - Container: Docker, docker-compose

## 2. Product vision and users

### Product vision

IronFit Pro is a comprehensive gym management platform that helps gym owners manage memberships, payments, and member progress, while providing members with AI-powered fitness coaching, QR check-in, and goal tracking.

### Target users / stakeholders

- **Admin**: Gym owner/manager who needs to manage users, memberships, payments, and view system statistics.
- **Member**: Gym member who wants to register for plans, chat with AI trainer, track body progress, set fitness goals, and check-in via QR.
- **PT (Personal Trainer)**: Trainer who needs to manage assigned students and view their progress (planned for v0.2.1).

### Main scenarios or user stories

| ID | Persona/User | Scenario or user story | Acceptance criteria | Implemented? | Evidence |
|---|---|---|---|---|---|
| US-1 | Member | Register and log in to the system | User can sign up with email/password and log in to access dashboard | Yes | `src/controllers/auth.controller.ts`, `frontend/app/(auth)/login/page.tsx` |
| US-2 | Member | Purchase a membership plan | User can view plans, buy one, and see active membership status | Yes | `src/controllers/membership.controller.ts`, `/member/dashboard` |
| US-3 | Member | Chat with AI fitness coach | User can ask fitness/nutrition questions and receive AI-generated responses | Yes | `src/controllers/ai.controller.ts`, `/member/ai-chat` |
| US-4 | Member | Track body progress (weight, BMI, body fat) | User can add progress records, view charts and statistics | Yes | `src/controllers/bodyProgress.controller.ts`, `/member/progress` |
| US-5 | Member | Check-in/out using QR code | User can generate QR, scan to check-in, and view history | Yes | `src/controllers/attendance.controller.ts`, `/member/check-in` |
| US-6 | Member | Set fitness goals | User can set target weight/BMI/body fat and track achievement | Yes | `src/controllers/bodyGoal.controller.ts`, `/member/progress` (GoalSetting component) |
| US-7 | Admin | Manage users (lock/unlock, change roles) | Admin can view user list, toggle active status, change roles | Yes | `src/controllers/admin.controller.ts`, `/admin/users` |
| US-8 | PT | View assigned students and their progress | PT can see list of students (mock data for v0.2.0) | Partial | `/pt/dashboard` (mock) |

## 3. Architecture and design decisions

Describe the architecture briefly. Add a diagram link if available.

Architecture: Client-Server with RESTful API.

- **Frontend**: Next.js App Router, Zustand for state, Axios for API calls, Tailwind for styling.
- **Backend**: Express.js with layered architecture (Controller → Service → Prisma). Zod for validation, JWT for auth, bcrypt for password hashing.
- **Database**: PostgreSQL with pgvector extension for vector embeddings (AI RAG). Prisma as ORM.
- **AI**: Gemini 2.0 Flash + gemini-embedding-001 with RAG pipeline (embedding → pgvector similarity search → Gemini response).
- **Caching**: Redis (optional, falls back gracefully).
- **Deployment**: Backend on Railway, Frontend on Vercel, DB on Neon, Docker support for local development.

| Decision | Course concept used | Why this decision? | Repo evidence | Trade-off / limitation |
|---|---|---|---|---|
| Use of RESTful API with Controller-Service-Pattern | Software architecture | Separates concerns: Controllers handle HTTP, Services contain business logic, Prisma handles DB. Increases maintainability and testability. | `backend/src/controllers/*`, `backend/src/services/*` | Adds boilerplate, but improves long-term maintainability. |
| Use of JWT with refresh tokens | Security and privacy | Access token short-lived (15min) for security, refresh token (7d) for user experience. | `backend/src/utils/generateToken.ts`, JWT config | More complex than session-based auth; requires token rotation. |
| Use of Zod for input validation | Reliable programming | Prevents invalid data from reaching business logic, reduces security risks. | `backend/src/validators/*.ts` | Adds validation overhead but ensures data integrity. |
| Use of pgvector for RAG | Cloud-based software / AI | Enables semantic search over gym knowledge base for AI responses. | `prisma/schema.prisma` KnowledgeBase model | Requires pgvector extension; not all hosting providers support it. |
| Use of Redis for caching | Performance optimization | Caches frequently accessed data (membership plans) to reduce DB load. | `backend/src/config/redis.ts`, `cache.middleware.ts` | Adds complexity; optional fallback if Redis unavailable. |
| Use of Docker for local development | DevOps and reproducibility | Standardizes environment, avoids "works on my machine" issues. | `docker-compose.yml`, `Dockerfile` | Adds learning curve; heavier than direct npm install. |

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

# Docker (optional)
docker-compose up --build
Required environment variables:

text
# Backend .env
DATABASE_URL=postgresql://user:password@localhost:5432/gym_management
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
GEMINI_API_KEY=your-gemini-key
FRONTEND_URL=http://localhost:3000
REDIS_HOST=localhost
REDIS_PORT=6379
# ... (other payment keys)

# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
## 5. Testing and verification
Test type	What is verified?	Command or evidence	Result
Unit / Integration (Jest)	Auth, Membership, Admin, Body Progress APIs	cd backend && npm test	16 tests passed ✅
Manual API tests	QR generation, check-in/out, goal setting	PowerShell scripts in test logs	All endpoints return success ✅
UI manual tests	Login, registration, QR check-in, goal setting	Screenshots in repo/docs	All flows work ✅
Important user scenarios verified:

Scenario 1 (Member signup & login): User registers, receives JWT, redirected to dashboard. (Tested with Postman and UI)

Scenario 2 (Membership purchase): User buys Basic plan, membership status appears in dashboard. (Tested via API and UI)

Scenario 3 (AI chat): User asks "Give me a workout plan", receives Gemini response with RAG context. (Tested via UI)

Scenario 4 (Progress tracking): User adds weight/height, BMI auto-calculated, chart displays. (Tested via UI)

Scenario 5 (QR check-in): User generates QR, scans (mock), history updates. (Tested via UI)

Scenario 6 (Goal setting): User sets target weight, status updates when achieved. (Tested via UI)

## 6. Security, privacy, and reliability
Security/privacy checklist
No real secrets committed.

.env.example uses safe placeholder values.

Authentication/authorization is implemented (JWT, RBAC).

Important inputs are validated (Zod).

Sensitive data is not unnecessarily collected or exposed.

Dependency/security risks are noted (npm audit).

Reliability and edge cases
Edge case / failure	Handling strategy	Evidence
Invalid email/password on login	Returns 404/401 with appropriate error code	auth.service.ts, tests
Missing JWT token	Returns 401 with AUTH_006	auth.middleware.ts
Expired QR code	Returns 400 with ATTENDANCE_001	attendance.service.ts
Duplicate goal creation	Returns 400 with GOAL_001 (handled in frontend)	bodyGoal.service.ts
Database connection failure	Health check returns 503, app logs error	server.ts health endpoint
Empty progress data	Chart/Stats components show "No data" state	ProgressChart.tsx, ProgressStats.tsx
## 7. DevOps, code management, and teamwork
Branching strategy: Feature branches from main, PRs for major features.

Issues/tasks used: GitHub Issues (#1–#26, #89).

Pull requests/reviews used: PRs for #21, #22, #23, #24, #25.

CI/CD used: GitHub Actions (lint, typecheck, test), Vercel auto-deploy on main push, Railway auto-deploy on main push.

Deployment/demo process:

Backend: Railway (auto-deploy from main)

Frontend: Vercel (auto-deploy from main)

Database: Neon (managed)

Evidence:

Commit/PR/issue links: https://github.com/sleepingbuild/gym-management/pulls?q=is%3Apr+is%3Aclosed

CI/deployment links: https://github.com/sleepingbuild/gym-management/actions

## 8. Group self-score: 80 points
Category	Max	Self-score	Evidence
Product vision, users, features, scenarios, and stories	10	9	README, issue tracker, user stories table above. Product vision is clear; scenarios and user stories documented.
Functionality and delivered product value	14	13	All core features (auth, membership, AI, progress, QR check-in, goals) work end-to-end. Minor mock in PT dashboard.
Architecture and design rationale	12	11	Clear separation of concerns, documented in ARCHITECTURE.MD and decision table above. Minor over-engineering with Redis but optional.
Code quality, maintainability, and reliable programming	10	9	TypeScript, Zod validation, error handling, consistent naming. Some duplicated code in tests, but acceptable.
Testing and verification strategy	9	8	16 unit/integration tests pass, manual testing documented. Missing automated E2E tests and coverage report.
Security, privacy, and configuration hygiene	8	8	No secrets committed, .env.example, JWT, bcrypt, validation, RBAC.
DevOps, code management, and reproducibility	9	9	GitHub Actions, Docker, Railway, Vercel, clear README, conventional commits, PRs.
Documentation, self-assessment, and theory-practice traceability	8	7	README, ARCHITECTURE, CHANGELOG, this SELF_ASSESSMENT. Theory-practice table provided. Missing video demo.
Total	80	74	
## 9. Theory-to-practice evidence
Provide at least 3 specific examples.

Course concept	Engineering decision	Repo evidence	Result / limitation
User stories → features	Defined core user stories (registration, membership, progress, QR, goals) and implemented them in prioritized order.	Issue tracker, README, source code	All priority stories implemented; PT dashboard remains partial (mock).
Architecture layering	Used Controller-Service-Prisma pattern to separate concerns, making code testable and maintainable.	backend/src/controllers/, services/, prisma/schema.prisma	Good separation; some services grow large (e.g., ai.service.ts) but manageable.
Security and privacy	JWT with short-lived access tokens, refresh tokens, bcrypt hashing, input validation, environment variables.	utils/generateToken.ts, validators/*.ts, .env.example	Robust security; VNPay sandbox limitation not code issue.
Reliable programming	Zod validation, error handling with AppError, handling empty/error states in UI.	validators/*.ts, error.middleware.ts, frontend components	Good defensive programming; edge cases handled gracefully.
Testing	Wrote unit/integration tests for critical APIs (auth, membership, admin, progress).	tests/unit/*.test.ts, tests/integration/api.test.ts	Tests pass and cover main flows; coverage could be increased.
DevOps/Reproducibility	Docker, CI/CD pipelines, environment variable management, clear documentation.	Dockerfile, docker-compose.yml, .github/workflows/	Full pipeline works; project runs from clean clone.

## 10. Individual self-assessment
### Student name: Phạm Hoàng Phi

| Category | Max | Self-score | Evidence |
|---|---:|---:|---|
| Meaningful technical contribution | 7 | 7 | ... |
| Theory-informed ownership and explanation | 5 | 5 | ... |
| Collaboration, agile teamwork, and professionalism | 3 | 3 | ... |
| Testing, documentation, DevOps, and quality practices | 3 | 3 | ... |
| Reflection and improvement mindset | 2 | 2 | ... |
| **Total** | **20** | **20** | |

### Student name: Giang Văn Quang

| Category | Max | Self-score | Evidence |
|---|---:|---:|---|
| Meaningful technical contribution | 7 | 7 | ... |
| Theory-informed ownership and explanation | 5 | 5 | ... |
| Collaboration, agile teamwork, and professionalism | 3 | 3 | ... |
| Testing, documentation, DevOps, and quality practices | 3 | 3 | ... |
| Reflection and improvement mindset | 2 | 2 | ... |
| **Total** | **20** | **20** | |

Contribution evidence:
**Phạm Hoàng Phi:**
- Main files/features owned: Backend APIs (auth, membership, AI, payment, notification, body progress, attendance, body goal), database schema, deployment configuration.
- Important commits/PRs/issues: View https://github.com/sleepingbuild/gym-management/commits/main

**Giang Văn Quang:**
- Main files/features owned: Frontend pages (login, register, dashboard, progress, check-in, PT dashboard), UI components, state management, API integration.
- Important commits/PRs/issues: View https://github.com/sleepingbuild/gym-management/commits/main

Main files/features owned: All backend controllers/services, frontend pages, schema design, deployment configuration.

Important commits/PRs/issues: View https://github.com/sleepingbuild/gym-management/commits/main

Tests/docs/reviews contributed: Auth, membership, admin, body progress tests; README, ARCHITECTURE, CHANGELOG, SELF_ASSESSMENT.

Course concepts applied in my work: Layered architecture, JWT security, input validation, error handling, CI/CD, documentation.

Design/security/testing/reliability trade-offs I can explain: Chose REST over GraphQL for simplicity; opted for JWT over sessions for statelessness; used pgvector for RAG despite setup complexity.

What I learned: Importance of validation, security best practices, real-world deployment pipelines.

What I would improve next: Add E2E tests with Playwright; implement real PT API; add goal notifications.

## 11. Known limitations
VNPay sandbox awaiting merchant approval (Error 72) — signature and flow verified, blocked only by external onboarding.

PT Dashboard uses mock data; backend API for PT features not implemented.

QR scanner is mock (no actual camera integration in v0.2.0); user manually enters QR code.

Goal achievement check is manual (user clicks button); no push notification yet.

Redis caching is optional; works without it.

No automated E2E tests; coverage could be improved.

## 12. Final submission checklist
- [x] README explains project purpose and features.
- [x] Product vision and target users are clear.
- [x] Main scenarios/user stories are documented.
- [x] Setup instructions work from a clean machine.
- [x] `.env.example` exists and contains no real secrets.
- [x] Build/run/test commands are documented.
- [x] Core features have tests or clear verification evidence.
- [x] Security/privacy risks are considered.
- [x] Architecture/design choices are documented.
- [x] DevOps/code management evidence is available.
- [x] No real credentials are committed.
- [x] Main user flows are demonstrated with screenshots/video. 
- [x] Team member contributions are documented.
- [x] Theory-to-practice examples are specific and evidence-based.
- [x] Known limitations are stated honestly.