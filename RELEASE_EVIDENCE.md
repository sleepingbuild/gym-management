# Release Evidence — v1.0.0

> Raw URL (for automated evaluation):
> https://raw.githubusercontent.com/sleepingbuild/gym-management/main/RELEASE_EVIDENCE.md

## 🌐 Live Deployment

| Service | URL | Status |
|---|---|---|
| Frontend | https://gym-management-five-gules.vercel.app *(verify current domain before submission — may have changed)* | — |
| Backend API | https://gym-management-dwvx.onrender.com *(migrated from Railway after free-tier credit ran out)* | — |
| Database | Neon PostgreSQL + pgvector (Singapore) | ✅ Live |

**Verification:** https://gym-management-dwvx.onrender.com/api/memberships/plans

> ⚠️ Render free tier sleeps after ~15 min idle — open the link a few minutes before checking, or before a live demo.

---

## ✅ CI/CD Pipeline

**GitHub Actions** — automatic on every push to `main` and all PRs:

```yaml
Jobs:
  backend:
    - npm ci (install all dependencies)
    - npx prisma generate (generate Prisma Client)
    - npm run lint (ESLint)
    - npx tsc --noEmit (TypeScript typecheck)

  frontend:
    - npm ci
    - npm run lint (ESLint)
    - npm run build (Next.js production build)
```

**Pipeline:** https://github.com/sleepingbuild/gym-management/actions/workflows/ci.yml
**Workflow file:** https://github.com/sleepingbuild/gym-management/blob/main/.github/workflows/ci.yml

> Confirm current pipeline status on the Actions tab before citing this as evidence — status can change with each push.

---

## 🧪 API Integration Tests — Production

The 7 tests below were run against production on **2026-06-19**, against the v0.1.0 feature set (auth, membership plans, admin users, AI usage, validation). They cover endpoints that have not changed shape since, so they remain a valid smoke test.

**They do NOT cover any v1.0.0-era feature** — face check-in, VNPay payment creation/return, trainer scheduling, membership cancel, or the Qwen-only AI chat/stream/sessions endpoints have not been re-verified live in this document and should be re-tested against current production before being cited as "evidence" for those features.

### TEST 1 — Public Endpoint
```
GET /api/memberships/plans
Expected: 200 OK, plans returned
Result: ✅ PASSED (2026-06-19)
Response: { success: true, statusCode: 200,
  data: { plans: [
    { name: "Basic", price: 0, aiDailyLimit: 1 },
    { name: "Premium", price: 9.99, aiDailyLimit: 10 },
    { name: "Elite", price: 29.99, aiDailyLimit: -1 }
  ]}}
```

### TEST 2 — User Registration
```
POST /api/auth/register
Body: { fullName: "Test User", email: "testevidence@ironfit.com", password: "Test123456" }
Expected: 201 Created
Result: ✅ PASSED (2026-06-19)
Response: { success: true, statusCode: 201, message: "Registration successful",
  data: { user: {...}, tokens: { accessToken, refreshToken } }}
```
> Note: as of v1.0.0, registration no longer auto-logs-in — it now requires email verification via Mailjet before login succeeds. This test predates that change and should be re-run to reflect the current flow.

### TEST 3 — User Login
```
POST /api/auth/login
Body: { email: "admin@ironfit.com", password: "Admin123456" }
Expected: 200 OK, JWT tokens returned
Result: ✅ PASSED (2026-06-19)
Response: { success: true, statusCode: 200, message: "Login successful",
  data: { user: { role: "ADMIN" }, tokens: { accessToken, refreshToken } }}
```

### TEST 4 — JWT + Role Authorization (Admin only)
```
GET /api/admin/users
Headers: Authorization: Bearer <accessToken>
Expected: 200 OK, users list returned
Result: ✅ PASSED (2026-06-19)
Response: { success: true, statusCode: 200, message: "Users retrieved",
  data: { users: [...] }}
```

### TEST 5 — AI Usage Tracking
```
GET /api/ai/usage
Headers: Authorization: Bearer <accessToken>
Expected: 200 OK, usage stats returned
Result: ✅ PASSED (2026-06-19)
Response: { success: true, statusCode: 200, message: "Usage retrieved",
  data: { aiDailyCount: 0, aiUsageCount: 0, aiDailyLimit: 0, aiLimit: 0 }}
```

### TEST 6 — Input Validation (Zod)
```
POST /api/auth/register
Body: { fullName: "Test", email: "bad@test.com", password: "123" }
Expected: 400 Bad Request, validation error
Result: ✅ PASSED (2026-06-19)
Response: { success: false, statusCode: 400, message: "Validation error",
  errors: [{ field: "password", message: "AUTH_002: Password must be at least 8 characters" }]}
```

### TEST 7 — Unauthorized Access
```
GET /api/admin/users (no token)
Expected: 401 Unauthorized
Result: ✅ PASSED (2026-06-19)
Response: { success: false, statusCode: 401, message: "AUTH_006: Invalid or expired token" }
```

### Test Summary
| Category | Tests | Passed | Failed |
|---|---|---|---|
| Public endpoints | 1 | 1 | 0 |
| Authentication | 2 | 2 | 0 |
| JWT Authorization | 2 | 2 | 0 |
| Input Validation | 1 | 1 | 0 |
| Security | 1 | 1 | 0 |
| **Total** | **7** | **7** | **0** |

**Test environment:** Production (originally Railway + Neon; backend has since migrated to Render + Neon)
**Test date:** 2026-06-19 — **stale relative to v1.0.0**; re-run recommended, especially for auth (email verification now required) and any v1.0.0 feature

### 🔜 Tests still needed for v1.0.0 evidence
- Face check-in: enroll → self check-in → Kiosk check-in
- Payment: `POST /payments/create` for a paid plan → VNPay redirect → `GET /payments/vnpay-return`
- Trainer scheduling: `GET /bookings/trainers/:trainerId/available-slots`, `POST /admin/trainer-schedules`
- Membership cancel: `PATCH /memberships/cancel`, `PATCH /admin/users/:id/membership`
- AI chat: `POST /ai/chat/stream`, `GET /ai/sessions`

---

## Known Limitations

### CI Pipeline
- Confirm current status directly on the GitHub Actions tab — status can change with each push, so it is not restated here as a fact
- This section previously noted a `prisma db push`/pgvector CI issue as a configuration-only problem, not a code-quality one; re-verify if still applicable

---

## 👥 User Personas

### Admin — Quản lý phòng gym
Quản lý toàn bộ hội viên, khóa/mở tài khoản, thay đổi role, quản lý ca làm việc HLV, xem báo cáo thanh toán, chấm công.
- Đăng nhập ADMIN → User Management → lock/unlock/đổi role/sửa gói
- Xem thống kê tổng quan hệ thống, quản lý lịch làm việc HLV, kiosk điểm danh khuôn mặt

### Member — Hội viên phòng gym
Đăng ký gói tập (xác nhận email trước), chat AI Personal Trainer, thanh toán online, đặt lịch HLV theo lưới tuần, điểm danh khuôn mặt.
- Register → xác nhận email → chọn gói Premium → thanh toán VNPay (nay đã đi qua đúng cổng thanh toán)
- Nhận notification "Gói đã kích hoạt"
- Chat AI (Qwen, streaming): "Lịch tập 3 ngày/tuần giảm 5kg trong 2 tháng"
- Đặt lịch với HLV theo khung giờ thật, điểm danh bằng khuôn mặt

### PT — Personal Trainer
Đầy đủ dashboard: học viên, tiến trình học viên, lịch dạy theo tuần, điểm danh khuôn mặt.

---

## 🏗️ Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│    Next.js 16       │───▶│   Express REST API   │───▶│  PostgreSQL 16   │
│  (Vercel/Render)    │    │   (Render)           │    │  + pgvector      │
│  Zustand + Axios    │    │  JWT + Zod + Prisma  │    │  (Neon)          │
│  face-api.js        │    │                      │    └──────────────────┘
└─────────────────────┘    │  RAG Pipeline:       │
                           │  embed → pgvector    │    ┌──────────────────┐
                           │  → Qwen FastAPI      │───▶│  Qwen (local +   │
                           └──────────────────────┘    │  ngrok tunnel)   │
                                                        └──────────────────┘
```

**Pattern:** Controller → Service → Prisma  
**API format:** `{ success, statusCode, message, data }`  
**Error codes:** AUTH_001-006, MEMBERSHIP_001-004, AI_001-003, PAYMENT_001-004

---

## 🔒 Security

- bcrypt password hashing (cost 12)
- JWT access token (15m) + refresh token (7d)
- Role-Based Access Control: ADMIN / PT / MEMBER
- Mandatory email verification before login
- Zod input validation on all endpoints
- HTTPS enforced (Render + Vercel)
- HMAC-SHA512 (VNPay) + HMAC-SHA256 (MoMo) payment signature
- No hardcoded secrets (all via .env) — note: several secrets used during debugging sessions are flagged for rotation in PROJECT_STATUS.md

---

## 📊 Git Workflow & Traceability

**Commit convention:** Conventional Commits (feat/fix/docs/ci/chore)

**Issue → Implementation traceability:**
| Issue | Title | Status |
|---|---|---|
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
| #26 | Final Production Release | ✅ Closed — v1.0.0 |
| #89 | AI Chat UI (web pivot) | ✅ Closed |

Extension work beyond the numbered roadmap (PT dashboard wiring, face check-in, trainer scheduling, membership cancel, AI chatbot v2) is tracked in [PROJECT_STATUS.md](./PROJECT_STATUS.md) and [CHANGELOG.md](./CHANGELOG.md) rather than as numbered issues.

---

## 📦 Tech Stack

| Component | Technology | Version |
|---|---|---|
| Backend | Node.js + Express + TypeScript | 20.x |
| Frontend | Next.js + TailwindCSS + Zustand | 16.2.7 |
| Database | PostgreSQL + pgvector | 16 + 0.8.2 |
| ORM | Prisma | 6.19.3 |
| AI | Self-trained Qwen 2.5 1.5B (LoRA), RAG via pgvector | - |
| Face recognition | face-api.js | - |
| Payment | VNPay + MoMo | - |
| Email | Mailjet | - |
| CI/CD | GitHub Actions | - |
| Hosting | Render + Vercel + Neon | - |

---

## ⚠️ Known Issues

- Qwen AI provider depends on a developer's local machine + ngrok tunnel being online
- Several secrets exposed during debugging sessions still need rotation
- No automated tests yet for the newer v1.0.0 endpoints (see "Tests still needed" above)

### ✅ Resolved for v1.0.0
- VNPay — old sandbox merchant had gone invalid (re-registered); fixed a double amount-multiplication bug (`*1000` then `*100`) and a signature-encoding mismatch (`qs` → `URLSearchParams`); full flow (create → redirect → sandbox payment → return → activation) verified end-to-end on local and production
- Neon migration history reconciled via a fresh baseline (`prisma db pull`-based) covering the duplicate `add_vector_embedding` folders and the previously-unrecorded `TrainerSchedule`/`TrainerCheckIn` tables; `migrate deploy` now works normally
- `VNPAY_RETURN_URL`/`VNPAY_URL`/MoMo return/IPN/endpoint vars added to `backend/.env.example`

---

## 🔜 Next release candidates

- [ ] Cloud-hosted (tunnel-free) Qwen serving
- [ ] "Resend verification email" flow
- [ ] Automated tests for trainer-schedules, available-slots, admin membership edit, member cancel
- [ ] Dedicated `MembershipStatus` value for cancel reasons
- [ ] Re-run the full API integration test suite above against current production and record real results