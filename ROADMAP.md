# 🗺️ Gym Management System - Development Roadmap

**Project Status:** In Development — Phase 6 (Testing & Deployment)  
**Last Updated:** 18/06/2026 (synced with PROJECT_STATUS.md as of 12/06/2026)  
**Team Size:** 2 Members  

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Development Phases & Milestones](#development-phases--milestones)
3. [Timeline Summary](#timeline-summary)
4. [Team Allocation](#team-allocation)
5. [Dependencies Map](#dependencies-map)
6. [Critical Rules](#critical-rules)

---

## 🎯 Project Overview

Gym Management System là một platform quản lý phòng gym toàn diện bao gồm:

- ✅ **Web Admin Dashboard** - Quản lý hệ thống
- ✅ **AI Chatbot** - Hỗ trợ luyện tập và dinh dưỡng
- ✅ **Membership System** - Quản lý gói thành viên
- ✅ **Payment System** - Thanh toán online (VNPay / MoMo)
- ✅ **Notification System** - Thông báo realtime

---

## 🚀 Development Phases & Milestones

### MILESTONE 1: PHASE 1 - PROJECT INITIALIZATION
**⏱️ Estimated Time:** 2-3 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Both  
*Các Issues liên kết:* `#1` -> `#3`

#### 📝 Tasks (Issues)

- [x] **Issue #1 [Setup]:** Khởi tạo repository structure và workflow
- [x] **Issue #2 [Backend]:** Setup NodeJS + TypeScript Backend
- [x] **Issue #3 [Database]:** Setup PostgreSQL và Prisma ORM

#### 🏗️ Deliverables
- ✅ Nền tảng dự án sẵn sàng, Backend kết nối DB thành công
- ✅ Migration system và seed system hoạt động

---

### MILESTONE 2: PHASE 2 - AUTHENTICATION & DATABASE SYSTEM
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Member 1 (Backend) + Member 2 (UI Prep)  
*Các Issues liên kết:* `#4` -> `#8`

#### 📝 Tasks (Issues)

- [x] **Issue #4 [Database]:** Thiết kế Users schema và Roles
  - Bảng Users: id, fullName, email, password, avatar, phone, role
  - Roles enum: ADMIN, MEMBER, PT (STAFF không có trong scope thực tế)

- [x] **Issue #5 [Auth]:** Xây dựng Register API
  - `POST /api/auth/register`
  - Validation: email hợp lệ, password >= 8 ký tự, không duplicate email
  - Hash password (bcrypt), Generate JWT, Save user vào database

- [x] **Issue #6 [Auth]:** Xây dựng Login API
  - `POST /api/auth/login`
  - Verify password, Generate access token (15m) + refresh token (7d)

- [x] **Issue #7 [Auth]:** Middleware Authentication và Authorization
  - JWT middleware (authenticate)
  - Role authorization (authorize)
  - Error handling middleware (Zod + AppError)

- [x] **Issue #8 [Database]:** Thiết kế Membership System
  - Bảng MembershipPlan + UserMembership
  - Basic: 10 AI messages/month (1/day) | Premium: 100/month (10/day) | Elite: Unlimited
  - ✅ Hoàn thành 03/06/2026 — MembershipStatus enum (ACTIVE/EXPIRED/SUSPENDED), seed 3 plans

> 💡 **Member 2:** Trong khi Member 1 hoàn thiện #8, Member 2 chuẩn bị component library (TailwindCSS, shadcn/ui) và thiết lập project NextJS.

#### 🏗️ Deliverables
- ✅ Hệ thống đăng ký/đăng nhập hoàn thiện, bảo mật
- ✅ Phân quyền route theo Role (ADMIN/PT/MEMBER — không có STAFF, đã bỏ khỏi scope thực tế)
- ✅ Membership schema sẵn sàng cho Phase 3

---

### MILESTONE 3: PHASE 3 - MEMBERSHIP & AI CORE ✅ COMPLETED
**⏱️ Estimated Time:** 3-4 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Member 1 (Backend)  
*Các Issues liên kết:* `#9` -> `#13`

#### 📝 Tasks (Issues)

- [x] **Issue #9 [Membership]:** API lấy danh sách packages
  - `GET /api/packages` → thực tế: `GET /api/memberships/plans` (public, sort theo giá tăng dần)
  - ✅ Hoàn thành 03/06/2026

- [x] **Issue #10 [Membership]:** API mua gói thành viên
  - `POST /api/packages/buy` → thực tế: `POST /api/memberships/buy` + `GET /api/memberships/current` (JWT required)
  - ✅ Hoàn thành 03/06/2026 — chặn duplicate active membership (MEMBERSHIP_003)

- [x] **Issue #11 [AI]:** Thiết kế bảng AI Chat History
  - ✅ Hoàn thành 04/06/2026 — ChatHistory model (sessionId, ChatRole enum, content, tokens)

- [x] **Issue #12 [AI]:** Tích hợp OpenAI / Gemini API
  - Thực tế triển khai: full RAG pipeline (không chỉ gọi API đơn giản)
  - pgvector trên PostgreSQL 17 (v0.8.2), KnowledgeBase với vector(3072) embeddings, 24 documents seeded
  - Pipeline: gemini-embedding-001 → cosine similarity search → Gemini 2.0 Flash
  - ✅ Hoàn thành 05/06/2026

- [x] **Issue #13 [AI]:** Giới hạn AI usage theo membership
  - Basic: 1/day, 10/month | Premium: 10/day, 100/month | Elite: Unlimited
  - ✅ Hoàn thành 05/06/2026 (gộp vào Issue #12) — error codes AI_001/AI_002/AI_003

#### 🏗️ Deliverables
- ✅ Membership API hoạt động đầy đủ
- ✅ AI Chatbot RAG kết nối, phân biệt giới hạn theo gói

---

### MILESTONE 4: PHASE 4 - FRONTEND ADMIN DASHBOARD ✅ COMPLETED
**⏱️ Estimated Time:** 5-6 days | **🎯 Priority:** 🟡 High | **👥 Owner:** Member 2 (Frontend)  
*Các Issues liên kết:* `#14` -> `#17`

#### 📝 Tasks (Issues)

- [x] **Issue #14 [Frontend]:** Setup ReactJS / NextJS Frontend
  - ✅ Hoàn thành 07/06/2026 — NextJS 16.2.7 + TypeScript + TailwindCSS + Turbopack, design system cream/coral/dark-navy
- [x] **Issue #15 [Frontend]:** Thiết kế Login Page
  - ✅ Hoàn thành 07/06/2026 — react-hook-form + zod, redirect theo role
- [x] **Issue #16 [Frontend]:** Dashboard Overview UI
  - ✅ Hoàn thành 08/06/2026 — Admin/Member dashboard, sidebar theo role
- [x] **Issue #17 [Frontend]:** User Management Table
  - ✅ Hoàn thành 10/06/2026 — search/filter, lock/unlock, sửa role inline

#### 🏗️ Deliverables
- ✅ Giao diện Web Admin hoàn thành core features
- ✅ Kết nối API đồng bộ dữ liệu thực

---

### MILESTONE 5: PHASE 5 - PAYMENT & NOTIFICATION SYSTEM ✅ COMPLETED
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🟠 Medium | **👥 Owner:** Member 1 (Backend)  
*Các Issues liên kết:* `#18` -> `#20`, `#89` (bổ sung ngoài roadmap gốc)

#### 📝 Tasks (Issues)

- [x] **Issue #18 [Payment]:** Thiết kế bảng Payments
  - ✅ Hoàn thành 11/06/2026 — tạo qua psql (migration drift workaround)
- [x] **Issue #19 [Payment]:** Tích hợp VNPay / MoMo
  - ✅ Hoàn thành 12/06/2026 — VNPay (HMAC-SHA512), MoMo (HMAC-SHA256)
  - ⚠️ VNPay sandbox merchant đang chờ duyệt chính thức (Error 72) — signature/flow đã verify đúng, chỉ vướng onboarding bên ngoài
- [x] **Issue #20 [Notification]:** Xây dựng Notification System
  - ✅ Hoàn thành 12/06/2026 — 6 loại notification, tích hợp vào payment flow
- [x] **Issue #89 [Frontend]:** AI Chat UI *(bổ sung ngoài 26 issues gốc)*
  - Ban đầu viết cho mobile (React Native), pivot sang NextJS web sau khi mobile bị bỏ khỏi scope ở Phase 4
  - ✅ Hoàn thành 12/06/2026 — chat bubble UI, typing indicator, usage badge
  - PR đầu tiên của dự án: `feature/ai-chat-ui` → PR → merge vào main

#### 🏗️ Deliverables
- ✅ Dòng tiền tự động qua cổng thanh toán
- ✅ Notification system kích hoạt đúng thời điểm
- ✅ AI Chat UI hoạt động trên web (thay thế mobile đã bị cắt khỏi scope)

---

### MILESTONE 6: PHASE 6 - TESTING & DEPLOYMENT ⏳ IN PROGRESS (Current Phase)
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Both  
*Các Issues liên kết:* `#21` -> `#26`

#### 📝 Tasks (Issues)

- [ ] **Issue #21 [Feature]:** Theo dõi tiến trình cơ thể (BMI, cân nặng, Line Chart)
- [ ] **Issue #22 [Testing]:** API và Security Testing (Jest, JWT, SQL Injection)
- [ ] **Issue #23 [Optimization]:** Optimize Database và API (Indexing, Redis, < 500ms)
- [ ] **Issue #24 [Deployment]:** Deploy Backend và Database (Docker, Railway/Render)
- [ ] **Issue #25 [Deployment]:** Deploy Frontend Web (Vercel)
- [ ] **Issue #26 [Deployment]:** Final Production Release + Monitoring

#### 🏗️ Deliverables
- ✅ Hệ thống đạt hiệu năng mục tiêu (API < 500ms)
- ✅ Toàn bộ nền tảng online ổn định trên Production
- ✅ Logging, monitoring và backup database tự động

---

## 📊 Timeline Summary

| Milestone / Phase | Duration | Priority | Owner | Issues | Status |
|---|---|---|---|---|---|
| 1. Project Initialization | 2-3 days | 🔴 Critical | Both | #1 – #3 (3 issues) | ✅ Completed |
| 2. Authentication & Database | 4-5 days | 🔴 Critical | M1 + M2 UI Prep | #4 – #8 (5 issues) | ✅ Completed (03/06) |
| 3. Membership & AI Core | 3-4 days | 🔴 Critical | M1 Backend | #9 – #13 (5 issues) | ✅ Completed (05/06) |
| 4. Frontend Admin Dashboard | 5-6 days | 🟡 High | M2 Frontend | #14 – #17 (4 issues) | ✅ Completed (10/06) |
| 5. Payment & Notification | 4-5 days | 🟠 Medium | M1 Backend | #18 – #20, #89 (4 issues) | ✅ Completed (12/06) |
| 6. Testing & Deployment | 4-5 days | 🔴 Critical | Both | #21 – #26 (6 issues) | ⏳ In Progress (current) |

**Tổng số Issues:** 27 issues (26 issues gốc + #89 bổ sung)  
**Tổng thời gian tối ưu (2 thành viên làm song song):** 4-5 tuần (ước tính ban đầu)  
**Thời gian thực tế Phase 1-5:** 31/05/2026 → 12/06/2026 (~13 ngày, nhanh hơn ước tính ban đầu)

---

## 👥 Team Allocation

### 🧑‍💻 Member 1 — Backend Lead + AI (Phases 1, 2, 3, 5, 6)
- Chịu trách nhiệm thiết kế Database, APIs, bảo mật hệ thống, tích hợp AI OpenAI/Gemini, cấu hình cổng thanh toán VNPay/MoMo và hạ tầng server.

### 🧑‍🎨 Member 2 — Frontend Lead (Phases 1, 2, 4, 6)
- Chịu trách nhiệm xây dựng giao diện quản trị Admin Web (React/NextJS).
- **Tuần 1-2:** Chuẩn bị component library, thiết kế mockup, thiết lập project NextJS — làm việc song song với Backend.

---

## 🔗 Dependencies Map

```
Issue #3 (DB Setup)
  └── #4 (Users/Roles) → #5, #6, #7 (Auth APIs)
        └── #8 (Membership Schema)
              └── #9, #10 (Membership APIs)
                    └── #11, #12, #13 (AI Core)
                          └── #18, #19 (Payment)
                                └── #20 (Notification)

Auth APIs (#5-#7) → Member 2
  → #14 (Frontend Setup) → #15 → #16 → #17

#20 (Notification) → #89 (AI Chat UI, bổ sung — pivot từ mobile sang web)

All Features → #21 → #22 (Testing) → #23 (Optimize) → #24, #25, #26 (Deploy)
```

---

## ⚠️ CRITICAL DEVELOPMENT RULES

### 1️⃣ Architecture Rules
- ❌ Không hardcode API URLs / credentials
- ❌ Không duplicate business logic hoặc components
- ❌ Không tạo business logic ở frontend
- ❌ Không sửa database trực tiếp sau khi migrate

### 2️⃣ Code Quality Rules
- ✅ Tất cả APIs phải có validation (Zod)
- ✅ Tất cả features phải có error handling
- ✅ Sử dụng TypeScript strictly (no `any`)
- ✅ Follow ESLint + Prettier rules

### 3️⃣ Security Rules
- ✅ Hash password bằng bcrypt
- ✅ JWT tokens không hardcode
- ✅ Validate tất cả input từ phía người dùng
- ✅ HTTPS only (production)

### 4️⃣ Git Workflow Rule
- Issues #1–#20: commit trực tiếp vào `main`, không qua PR (pattern đã thiết lập từ đầu dự án)
- **Từ Issue #89 trở đi:** bắt buộc dùng feature branch → Pull Request → Review → Merge, để khớp với rule đã ghi ở mục 1️⃣ ("Tất cả feature phải thông qua pull request") và đạt điểm SE grading rubric

### 5️⃣ Pre-Code Checklist (Bắt buộc cho tất cả AI agents)
🔴 **CRITICAL**: Tất cả agent/code assistant phải đọc thật kỹ trước khi code:
1. Toàn bộ project structure
2. Database schema & relations
3. Existing API endpoints
4. Authentication flow + Middleware stack
5. Business logic rules + Error handling patterns
6. Coding style & conventions

---

## 📚 Related Documents
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture details
- [README.md](./README.md) - Project overview
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current progress tracking

---