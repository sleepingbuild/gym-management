# 🗺️ Gym Management System - Development Roadmap

**Project Status:** In Development  
**Last Updated:** 31/05/2026  
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
- ✅ **Mobile Application** - Ứng dụng cho người dùng
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

- [ ] **Issue #1 [Setup]:** Khởi tạo repository structure và workflow
  - Setup branch strategy
  - Setup README.md
  - Setup issue templates
  - Setup pull request templates
  - Setup coding conventions
  - Setup folder architecture

- [ ] **Issue #2 [Backend]:** Setup NodeJS + TypeScript Backend
  - Setup TypeScript
  - Setup dotenv
  - Setup ESLint + Prettier
  - Setup Nodemon
  - Setup Logger
  - Setup global error handling
  - Folder structure: controllers, routes, services, middlewares, validators, utils, config

- [ ] **Issue #3 [Database]:** Setup PostgreSQL và Prisma ORM
  - Setup PostgreSQL
  - Setup Prisma ORM
  - Setup migration system
  - Setup seed system

#### ⚠️ Important Rules
- Không push trực tiếp vào `main`
- Tất cả feature phải thông qua pull request
- Tất cả AI agents phải đọc kỹ repository structure trước khi code
- Không được sửa database trực tiếp — tất cả thay đổi schema phải qua migration

#### 🏗️ Deliverables
- ✅ Nền tảng dự án sẵn sàng, Backend kết nối DB thành công
- ✅ Migration system và seed system hoạt động

---

### MILESTONE 2: PHASE 2 - AUTHENTICATION & DATABASE SYSTEM
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Member 1 (Backend) + Member 2 (UI Prep)  
*Các Issues liên kết:* `#4` -> `#8`

#### 📝 Tasks (Issues)

- [ ] **Issue #4 [Database]:** Thiết kế Users schema và Roles
  - Bảng Users: id, fullName, email, password, avatar, phone, role
  - Roles: ADMIN, STAFF, MEMBER, PT

- [ ] **Issue #5 [Auth]:** Xây dựng Register API
  - `POST /api/auth/register`
  - Validation: email hợp lệ, password >= 8 ký tự, không duplicate email
  - Hash password (bcrypt), Generate JWT, Save user vào database
  - ⚠️ Không lưu password dạng plain text

- [ ] **Issue #6 [Auth]:** Xây dựng Login API
  - `POST /api/auth/login`
  - Verify password
  - Generate access token + refresh token

- [ ] **Issue #7 [Auth]:** Middleware Authentication và Authorization
  - JWT middleware
  - Role authorization
  - Error handling middleware

- [ ] **Issue #8 [Database]:** Thiết kế Membership System
  - Bảng MembershipPackages + UserMemberships
  - Basic: 10 AI messages/day
  - Premium: 100 AI messages/day
  - Elite: Unlimited AI usage

> 💡 **Member 2 (tuần này):** Trong khi Member 1 xây dựng Auth, Member 2 thiết kế mockup UI (Figma hoặc trực tiếp code), chuẩn bị component library (TailwindCSS, shadcn/ui), và thiết lập project NextJS.

#### 🏗️ Deliverables
- ✅ Hệ thống đăng ký/đăng nhập hoàn thiện, bảo mật
- ✅ Phân quyền route theo Role
- ✅ Membership schema sẵn sàng cho Phase 3

---

### MILESTONE 3: PHASE 3 - MEMBERSHIP & AI CORE
**⏱️ Estimated Time:** 3-4 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Member 1 (Backend)  
*Các Issues liên kết:* `#9` -> `#13`

#### 📝 Tasks (Issues)

- [ ] **Issue #9 [Membership]:** API lấy danh sách packages
  - `GET /api/packages`
  - Trả về danh sách gói Basic, Premium, Elite với thông tin chi tiết

- [ ] **Issue #10 [Membership]:** API mua gói thành viên
  - `POST /api/packages/buy`
  - Xử lý logic đăng ký gói, lưu vào UserMemberships
  - Validate membership chưa active

- [ ] **Issue #11 [AI]:** Thiết kế bảng AI Chat History
  - Schema lưu lịch sử trò chuyện AI
  - Liên kết với User và Membership

- [ ] **Issue #12 [AI]:** Tích hợp OpenAI / Gemini API
  - Tích hợp SDK OpenAI hoặc Gemini
  - Workout recommendation
  - Nutrition recommendation
  - Gym assistant chatbot

- [ ] **Issue #13 [AI]:** Giới hạn AI usage theo membership
  - Basic: 10 messages/day
  - Premium: 100 messages/day
  - Elite: Unlimited
  - Middleware kiểm tra quota trước mỗi request

#### 🏗️ Deliverables
- ✅ Membership API hoạt động đầy đủ
- ✅ AI Chatbot kết nối thành công, phân biệt giới hạn theo gói
- ✅ Lịch sử chat được lưu trữ

---

### MILESTONE 4: PHASE 4 - FRONTEND ADMIN DASHBOARD
**⏱️ Estimated Time:** 5-6 days | **🎯 Priority:** 🟡 High | **👥 Owner:** Member 2 (Frontend)  
*Các Issues liên kết:* `#14` -> `#17`

#### 📝 Tasks (Issues)

- [ ] **Issue #14 [Frontend]:** Setup ReactJS / NextJS Frontend
  - Khởi tạo project NextJS + TailwindCSS
  - Setup Axios Client, Route structure, Auth context
  - Component library setup (shadcn/ui)

- [ ] **Issue #15 [Frontend]:** Thiết kế Login Page
  - Login Page UI
  - Form validation
  - JWT token storage và auto-login

- [ ] **Issue #16 [Frontend]:** Dashboard Overview UI
  - Sidebar + Topbar layout
  - KPI Cards: tổng hội viên, doanh thu, AI usage

- [ ] **Issue #17 [Frontend]:** User Management Table
  - Danh sách người dùng
  - Search / Filter / Pagination
  - Xem chi tiết, chỉnh sửa role

#### 🏗️ Deliverables
- ✅ Giao diện Web Admin hoàn thành core features
- ✅ Kết nối API đồng bộ dữ liệu thực

---

### MILESTONE 5: PHASE 5 - MOBILE APPLICATION
**⏱️ Estimated Time:** 7-10 days | **🎯 Priority:** 🟡 High | **👥 Owner:** Member 2 (Mobile)  
*Các Issues liên kết:* `#18` -> `#21`

#### 📝 Tasks (Issues)

- [ ] **Issue #18 [Mobile]:** Setup React Native Project
  - Khởi tạo project React Native + Expo
  - Navigation setup (Stack + Tab)
  - Theme và folder structure

- [ ] **Issue #19 [Mobile]:** Login / Register Screens
  - Màn hình đăng nhập, đăng ký
  - SecureStore token, Auto-login

- [ ] **Issue #20 [Mobile]:** Home và Workout Screens
  - Màn hình trang chủ: thông tin gói hiện tại, shortcut
  - Màn hình workout

- [ ] **Issue #21 [Mobile]:** AI Chat Screen
  - FlatList messages
  - Typing indicator
  - Hiển thị số lượt AI còn lại theo gói

#### 🏗️ Deliverables
- ✅ Ứng dụng chạy mượt trên Android / iOS
- ✅ Tính năng AI Chat kết nối backend

---

### MILESTONE 6: PHASE 6 - PAYMENT & NOTIFICATION SYSTEM
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🟠 Medium | **👥 Owner:** Member 1 (Backend)  
*Các Issues liên kết:* `#22` -> `#24`

#### 📝 Tasks (Issues)

- [ ] **Issue #22 [Payment]:** Thiết kế bảng Payments
  - Schema: transaction_id, status, amount, package_id, user_id
  - Migration và seed data mẫu

- [ ] **Issue #23 [Payment]:** Tích hợp VNPay / MoMo
  - Xử lý IPN Callback / Webhook
  - Auto-upgrade package sau thanh toán thành công
  - Xử lý thanh toán thất bại

- [ ] **Issue #24 [Notification]:** Xây dựng Notification System
  - FCM / Expo Push Notifications
  - Nhắc gia hạn trước 7 ngày hết hạn
  - Thông báo sau thanh toán thành công

#### 🏗️ Deliverables
- ✅ Dòng tiền tự động qua cổng thanh toán
- ✅ Notification system kích hoạt đúng thời điểm

---

### MILESTONE 7: PHASE 7 - TESTING & DEPLOYMENT
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Both  
*Các Issues liên kết:* `#25` -> `#30`

#### 📝 Tasks (Issues)

- [ ] **Issue #25 [Feature]:** Theo dõi tiến trình cơ thể
  - BMI, cân nặng, tỷ lệ mỡ
  - Line Chart lịch sử tiến trình (Mobile + Frontend)

- [ ] **Issue #26 [Testing]:** API và Security Testing
  - Unit test (Jest)
  - Security audit: JWT, SQL Injection, Rate Limiting
  - Integration test toàn bộ luồng nghiệp vụ

- [ ] **Issue #27 [Optimization]:** Optimize Database và API
  - Indexing các cột hay query
  - Pagination chuẩn
  - Redis Caching nếu cần
  - Target: API response < 500ms

- [ ] **Issue #28 [Deployment]:** Deploy Backend và Database
  - Docker setup
  - Railway / Render hosting
  - Cloud DB (PostgreSQL)
  - HTTPS, Env staging vs production

- [ ] **Issue #29 [Deployment]:** Deploy Frontend Web
  - Deploy lên Vercel
  - Cấu hình domain
  - Env production

- [ ] **Issue #30 [Deployment]:** Build Production Mobile App
  - Expo EAS Build
  - APK cho Android
  - IPA cho iOS (TestFlight)

#### 🏗️ Deliverables
- ✅ Hệ thống đạt hiệu năng mục tiêu (API < 500ms)
- ✅ Toàn bộ nền tảng online ổn định trên Production
- ✅ Logging, monitoring và backup database tự động

---

## 📊 Timeline Summary

| Milestone / Phase | Duration | Priority | Owner | Issues |
|---|---|---|---|---|
| 1. Project Initialization | 2-3 days | 🔴 Critical | Both | #1 – #3 (3 issues) |
| 2. Authentication & Database | 4-5 days | 🔴 Critical | M1 Backend + M2 UI Prep | #4 – #8 (5 issues) |
| 3. Membership & AI Core | 3-4 days | 🔴 Critical | M1 Backend | #9 – #13 (5 issues) |
| 4. Frontend Admin Dashboard | 5-6 days | 🟡 High | M2 Frontend | #14 – #17 (4 issues) |
| 5. Mobile Application | 7-10 days | 🟡 High | M2 Mobile | #18 – #21 (4 issues) |
| 6. Payment & Notification | 4-5 days | 🟠 Medium | M1 Backend | #22 – #24 (3 issues) |
| 7. Testing & Deployment | 4-5 days | 🔴 Critical | Both | #25 – #30 (6 issues) |

**Tổng số Issues:** 30 issues  
**Tổng thời gian tối ưu (2 thành viên làm song song):** 5-6 tuần

---

## 👥 Team Allocation

### 🧑‍💻 Member 1 — Backend Lead + AI (Phases 1, 2, 3, 6, 7)
- Chịu trách nhiệm thiết kế Database, APIs, bảo mật hệ thống, tích hợp AI OpenAI/Gemini, cấu hình cổng thanh toán VNPay/MoMo và hạ tầng server.
- **Deliverable chính:** API phải luôn hoạt động đúng spec, error handling đầy đủ để Member 2 tích hợp độc lập.

### 🧑‍🎨 Member 2 — Frontend Lead + Mobile (Phases 1, 2, 4, 5, 7)
- Chịu trách nhiệm xây dựng giao diện quản trị Admin Web (React/NextJS) và phát hành ứng dụng di động (React Native + Expo).
- **Tuần 1-2:** Chuẩn bị component library, thiết kế mockup, thiết lập project — làm việc song song với Backend.

---

## 🔗 Dependencies Map

```
Issue #3 (DB Setup)
  └── #4 (Users/Roles) → #5, #6, #7 (Auth APIs)
        └── #8 (Membership Plans)
              └── #9, #10 (Membership APIs)
                    └── #11, #12, #13 (AI Core)
                          └── #22, #23 (Payment)
                                └── #24 (Notification)

Auth APIs (#5-#7) → Member 2
  → #14 (Frontend Setup) → #15 → #16 → #17
  → #18 (Mobile Setup)   → #19 → #20 → #21

All Features → #25 (Body Tracking) → #26 (Testing) → #27 (Optimize) → #28, #29, #30 (Deploy)
```

---

## ⚠️ CRITICAL DEVELOPMENT RULES

### 1️⃣ Architecture Rules
- ❌ Không hardcode API URLs / credentials
- ❌ Không duplicate business logic
- ❌ Không duplicate components
- ❌ Không tạo business logic ở frontend
- ❌ Không sửa database trực tiếp sau khi migrate

### 2️⃣ Code Quality Rules
- ✅ Tất cả APIs phải có validation
- ✅ Tất cả features phải có error handling
- ✅ Sử dụng TypeScript strictly (no `any`)
- ✅ Follow ESLint + Prettier rules

### 3️⃣ Security Rules
- ✅ Hash password bằng bcrypt
- ✅ JWT tokens không hardcode
- ✅ Validate tất cả input từ phía người dùng
- ✅ Prevent SQL injection
- ✅ HTTPS only (production)

### 4️⃣ Pre-Code Checklist (Bắt buộc cho tất cả AI agents)
🔴 **CRITICAL**: Tất cả agent/code assistant phải đọc thật kỹ trước khi code:
1. Toàn bộ project structure
2. Database schema & relations
3. Existing API endpoints
4. Authentication flow
5. Middleware stack
6. Business logic rules
7. Error handling patterns
8. Coding style & conventions

**Mục tiêu:** Tránh code bị loạn, conflict logic, hoặc phá vỡ kiến trúc hệ thống.

---

## 📚 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture details
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [README.md](./README.md) - Project overview
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current progress tracking

---

**Last Updated:** 31/05/2026  
**Status:** 🟡 In Progress — Phase 2  
**Next Step:** Issue #8 — Membership System Schema
