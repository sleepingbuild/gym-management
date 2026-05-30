# 🗺️ Gym Management System - Development Roadmap

**Project Status:** In Development  
**Last Updated:** May 28, 2026  
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
- ✅ **Check-in / Attendance System** - Điểm danh hội viên bằng QR Code
- ✅ **PT Management** - Quản lý huấn luyện viên cá nhân
- ✅ **Payment System** - Thanh toán online
- ✅ **Notification System** - Thông báo realtime

---

## 🚀 Development Phases & Milestones

### MILESTONE 1: PHASE 1 - PROJECT INITIALIZATION
**⏱️ Estimated Time:** 2-3 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Both
*Các Issues liên kết:* `#1` -> `#3`

#### 📝 Tasks (Issues)
- [ ] **Issue #1 [Setup]:** Khởi tạo cấu trúc repository và quy trình làm việc (Branching, README, templates, .gitignore).
- [ ] **Issue #2 [Backend]:** Thiết lập môi trường và cấu hình NodeJS + TypeScript Backend (Express/NestJS, ESLint, Prettier, Logger, Global Error).
- [ ] **Issue #3 [Database]:** Thiết lập hệ quản trị cơ sở dữ liệu PostgreSQL và Prisma ORM (Init, Migration system, Seed system).

#### 🌱 Seed Data (chạy song song với Issue #3)
- [ ] **Issue #3a [Database]:** Tạo seed data mẫu cho toàn bộ hệ thống (Users, Packages, PT Profiles) để Member 2 (Frontend) có thể làm việc độc lập ngay từ Week 2.

#### 🏗️ Deliverables
- ✅ Nền tảng dự án sẵn sàng, Backend kết nối DB thành công.
- ✅ Có seed data + Swagger docs để Member 2 bắt đầu frontend ngay.

---

### MILESTONE 2: PHASE 2 - AUTHENTICATION & DATABASE SYSTEM
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Member 1 (Backend) + Member 2 (UI Prep)
*Các Issues liên kết:* `#4` -> `#9`

#### 📝 Tasks (Issues)
- [ ] **Issue #4 [Database]:** Thiết kế cấu trúc bảng Users (Người dùng) và Roles (Quyền hạn: ADMIN, STAFF, MEMBER, PT).
- [ ] **Issue #5 [Auth]:** Xây dựng cổng API Đăng ký tài khoản (Register API - mã hóa bcrypt, JWT).
- [ ] **Issue #6 [Auth]:** Xây dựng cổng API Đăng nhập hệ thống (Login API - Access/Refresh token).
- [ ] **Issue #7 [Auth]:** Triển khai bộ lọc trung gian Authentication và Authorization Middleware.
- [ ] **Issue #8 [Database]:** Thiết kế cấu trúc bảng quản lý gói hội viên (Basic, Premium, Elite).
- [ ] **Issue #9 [Docs]:** Thiết lập Swagger / OpenAPI documentation cho toàn bộ API (auto-generated, cập nhật liên tục theo từng phase).

> 💡 **Member 2 (Week 2):** Trong khi Member 1 xây dựng Auth, Member 2 thiết kế mockup UI (Figma hoặc trực tiếp code), chuẩn bị component library (TailwindCSS, shadcn/ui), và thiết lập project NextJS.

#### 🏗️ Deliverables
- ✅ Hệ thống đăng ký/đăng nhập hoàn thiện bảo mật, phân quyền route chặt chẽ.
- ✅ API docs (Swagger) trực tuyến để Member 2 tích hợp không cần hỏi Member 1.

---

### MILESTONE 3: PHASE 3 - MEMBERSHIP, CHECK-IN & AI CORE
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Member 1 (Backend)
*Các Issues liên kết:* `#10` -> `#16`

#### 📝 Tasks (Issues)
- [ ] **Issue #10 [Membership]:** Phát triển API lấy danh sách các gói hội viên hiện có (`GET /api/packages`).
- [ ] **Issue #11 [Membership]:** Phát triển API đăng ký mua gói dịch vụ thành viên (`POST /api/packages/buy`).
- [ ] **Issue #12 [Check-in]:** Thiết kế bảng Attendance và xây dựng hệ thống Check-in bằng QR Code (Tạo QR cá nhân, Quét QR tại cửa, Lưu lịch sử vào/ra, Validate membership còn hạn).
- [ ] **Issue #13 [PT]:** Thiết kế bảng PT Profile và API quản lý huấn luyện viên (Thông tin PT, Lịch làm việc, Danh sách học viên).
- [ ] **Issue #14 [Database]:** Thiết kế cấu trúc bảng lưu trữ lịch sử trò chuyện AI Chat History.
- [ ] **Issue #15 [AI]:** Tích hợp bộ công cụ kết nối SDK OpenAI / Gemini API (AI fitness coach).
- [ ] **Issue #16 [AI]:** Xây dựng logic giới hạn số lượt sử dụng AI theo từng hạng gói hội viên (Basic: 10, Premium: 100, Elite: Unlimited).

#### 🏗️ Deliverables
- ✅ Hội viên có thể check-in bằng QR Code, lịch sử điểm danh được ghi nhận.
- ✅ Quản lý gói cước vận hành tốt, Core AI có khả năng nhận diện giới hạn gói để phản hồi.
- ✅ PT có thể được gán cho học viên.

---

### MILESTONE 4: PHASE 4 - FRONTEND ADMIN DASHBOARD
**⏱️ Estimated Time:** 6-7 days | **🎯 Priority:** 🟡 High | **👥 Owner:** Member 2 (Frontend)
*Các Issues liên kết:* `#17` -> `#23`

#### 📝 Tasks (Issues)
- [ ] **Issue #17 [Frontend]:** Khởi tạo nền tảng dự án Frontend bằng ReactJS / NextJS + TailwindCSS (Axios Client, Route setup, Auth context).
- [ ] **Issue #18 [Frontend]:** Thiết kế giao diện trang Đăng nhập (Login Page UI & Form validation).
- [ ] **Issue #19 [Frontend]:** Thiết kế cấu trúc giao diện trang Dashboard Overview chính (Sidebar, Topbar, KPI Cards: tổng hội viên, doanh thu, check-in hôm nay, AI usage).
- [ ] **Issue #20 [Frontend]:** Phát triển cấu phần bảng quản lý danh sách người dùng (User Management Table, Search/Filter/Pagination).
- [ ] **Issue #21 [Frontend]:** Phát triển giao diện quản lý Gói Thành Viên (CRUD Membership Plans, xem danh sách hội viên theo gói).
- [ ] **Issue #22 [Frontend]:** Phát triển giao diện quản lý Check-in / Điểm danh (Bảng lịch sử check-in, filter theo ngày/hội viên, thống kê lượt vào theo ngày).
- [ ] **Issue #23 [Frontend]:** Phát triển giao diện quản lý PT (Danh sách PT, phân công học viên, lịch làm việc).

#### 🏗️ Deliverables
- ✅ Giao diện Web Admin hoàn thành các tính năng cốt lõi, kết nối API đồng bộ dữ liệu.

---

### MILESTONE 5: PHASE 5 - MOBILE APPLICATION
**⏱️ Estimated Time:** 7-10 days | **🎯 Priority:** 🟡 High | **👥 Owner:** Member 2 (Mobile)
*Các Issues liên kết:* `#24` -> `#29`

#### 📝 Tasks (Issues)
- [ ] **Issue #24 [Mobile]:** Khởi tạo nền tảng ứng dụng di động Mobile với React Native + Expo (Navigation, Theme, Folder structure).
- [ ] **Issue #25 [Mobile]:** Xây dựng màn hình Đăng nhập và Đăng ký thành viên (SecureStore token, Auto-login, Biometric login nếu có).
- [ ] **Issue #26 [Mobile]:** Thiết kế giao diện trang chủ Home (thông tin gói hiện tại, lịch sử check-in gần đây, shortcut tới AI Chat).
- [ ] **Issue #27 [Mobile]:** Xây dựng màn hình Check-in bằng QR Code (Hiển thị QR cá nhân của hội viên để quét tại cửa gym).
- [ ] **Issue #28 [Mobile]:** Thiết kế và phát triển màn hình giao diện AI Chat (FlatList messages, Typing indicator, Hiển thị số lượt còn lại theo gói).
- [ ] **Issue #29 [Mobile]:** Xây dựng màn hình Hồ sơ cá nhân và theo dõi tiến trình (BMI, Cân nặng, Tỷ lệ mỡ, Line Chart lịch sử).

#### 🏗️ Deliverables
- ✅ Ứng dụng chạy mượt mà trên Android/iOS.
- ✅ Hội viên có thể check-in bằng QR trực tiếp từ app.
- ✅ Tính năng chat AI Real-time kết nối trơn tru.

---

### MILESTONE 6: PHASE 6 - PAYMENT & NOTIFICATION SYSTEM
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🟠 Medium | **👥 Owner:** Member 1 (Backend)
*Các Issues liên kết:* `#30` -> `#33`

#### 📝 Tasks (Issues)
- [ ] **Issue #30 [Database]:** Thiết kế cấu trúc bảng quản lý lịch sử thanh toán Payments (transaction_id, status, amount, package_id, user_id).
- [ ] **Issue #31 [Payment]:** Tích hợp cổng thanh toán trực tuyến VNPay / MoMo (Xử lý IPN Callback, Webhook xác nhận, Auto-upgrade package sau thanh toán thành công, Xử lý thanh toán thất bại và hoàn tiền).
- [ ] **Issue #32 [Payment]:** Xây dựng API lịch sử giao dịch (`GET /api/payments/history`) và tạo Invoice/Receipt sau mỗi giao dịch thành công.
- [ ] **Issue #33 [Notification]:** Xây dựng kiến trúc hệ thống thông báo đẩy Notification System (FCM / Expo Push) - Nhắc gia hạn trước 7 ngày hết hạn, Thông báo check-in thành công, Thông báo sau khi thanh toán.

#### 🏗️ Deliverables
- ✅ Dòng tiền tự động hóa qua cổng thanh toán.
- ✅ Hệ thống tự kích hoạt thông báo nhắc nhở đúng thời điểm.
- ✅ Invoice được tạo tự động sau mỗi giao dịch.

---

### MILESTONE 7: PHASE 7 - TESTING & DEPLOYMENT
**⏱️ Estimated Time:** 5-6 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Both
*Các Issues liên kết:* `#34` -> `#39`

#### 📝 Tasks (Issues)
- [ ] **Issue #34 [Testing]:** Thực hiện viết Unit Test bảo mật và kiểm thử toàn bộ hệ thống API (Jest, Security audit - JWT, SQL Injection, Rate Limiting).
- [ ] **Issue #35 [Testing]:** Kiểm thử tích hợp End-to-End toàn bộ luồng nghiệp vụ (Đăng ký → Mua gói → Check-in → AI Chat → Gia hạn).
- [ ] **Issue #36 [Optimization]:** Tối ưu hóa hiệu năng câu lệnh Database và tốc độ phản hồi API (Indexing các cột hay query, Pagination chuẩn, Redis Caching nếu cần).
- [ ] **Issue #37 [Deployment]:** Thực hiện triển khai máy chủ Backend và cấu hình cơ sở dữ liệu (Docker, Railway/Render, Cloud DB, HTTPS, Env staging vs production).
- [ ] **Issue #38 [Deployment]:** Thực hiện đưa ứng dụng giao diện quản trị Frontend Web vận hành chính thức (Vercel, Cấu hình domain).
- [ ] **Issue #39 [Deployment]:** Đóng gói và phát hành ứng dụng di động Production (Expo EAS Build, APK cho Android, IPA cho iOS TestFlight).

#### 🏗️ Deliverables
- ✅ Hệ thống đạt hiệu năng mục tiêu (API < 500ms).
- ✅ Toàn bộ nền tảng online ổn định trên Production.
- ✅ Có logging, monitoring và backup database tự động.

---

## 📊 Timeline Summary

| Milestone / Phase | Duration | Week | Priority | Owner | Issues |
|-------------------|----------|------|----------|-------|--------|
| 1. Initialization | 2-3 days | Week 1 | 🔴 | Both | #1-#3a (4 issues) |
| 2. Auth & Database | 4-5 days | Week 2 | 🔴 | M1 (Backend) + M2 (UI Prep) | #4-#9 (6 issues) |
| 3. Membership, Check-in & AI | 4-5 days | Week 3 | 🔴 | M1 (Backend) | #10-#16 (7 issues) |
| 4. Frontend Admin | 6-7 days | Week 4-5 | 🟡 | M2 (Frontend) | #17-#23 (7 issues) |
| 5. Mobile App | 7-10 days | Week 5-6 | 🟡 | M2 (Mobile) | #24-#29 (6 issues) |
| 6. Payment & Noti | 4-5 days | Week 6-7 | 🟠 | M1 (Backend) | #30-#33 (4 issues) |
| 7. Test & Deploy | 5-6 days | Week 7-8 | 🔴 | Both | #34-#39 (6 issues) |

**Tổng số Issues:** 40 issues  
**Tổng thời gian tối ưu (2 thành viên làm song song):** 6-7 tuần

---

## 👥 Team Allocation

### 🧑‍💻 Member 1 — Backend Lead + AI (Phases 1, 2, 3, 6, 7)
- Chịu trách nhiệm thiết kế Database, APIs, bảo mật hệ thống, tích hợp AI OpenAI/Gemini, hệ thống Check-in QR, quản lý PT, cấu hình cổng thanh toán VNPay/MoMo và hạ tầng server.
- **Deliverable chính:** Swagger docs phải luôn được cập nhật sau mỗi issue backend để Member 2 tích hợp độc lập.

### 🧑‍🎨 Member 2 — Frontend Lead + Mobile (Phases 1, 2, 4, 5, 7)
- Chịu trách nhiệm xây dựng giao diện quản trị Admin Web (React/NextJS) và phát hành ứng dụng di động (React Native + Expo).
- **Week 1-3:** Chuẩn bị component library, thiết kế mockup, thiết lập project — làm việc dựa trên Swagger docs và seed data có sẵn, không cần chờ backend hoàn chỉnh.

---

## 🔗 Dependencies Map

```
Issue #3 (DB Setup)
  └── #3a (Seed Data) ──────────────────────────────────────── Member 2 bắt đầu Week 2
  └── #4 (Users/Roles) → #5, #6, #7 (Auth) → #9 (Swagger)
        └── #8 (Membership Plans) → #10, #11 (Membership API)
              └── #12 (Check-in QR)
              └── #13 (PT Management)
              └── #14, #15, #16 (AI Core)
                    └── #30, #31 (Payment)
                          └── #33 (Notification)

Auth APIs (#5-#7) → Member 2 → #17 (Frontend Setup) → #18 → #19 → #20, #21, #22, #23
                              → #24 (Mobile Setup) → #25 → #26 → #27 → #28 → #29
```

---

## ⚠️ CRITICAL DEVELOPMENT RULES

### 1️⃣ Architecture Rules
- ❌ Không code chồng chéo phase
- ❌ Không sửa database tùy tiện sau khi migrate
- ❌ Không hardcode API URLs
- ❌ Không duplicate component
- ❌ Không tạo business logic ở frontend

### 2️⃣ Code Quality Rules
- ✅ Tất cả API phải có validation
- ✅ Tất cả feature phải có error handling
- ✅ Sử dụng TypeScript strictly (no `any`)
- ✅ Follow ESLint + Prettier rules
- ✅ Reusable components

### 3️⃣ Security Rules
- ✅ Hash password bằng bcrypt
- ✅ JWT tokens không hardcode
- ✅ Validate tất cả input
- ✅ Prevent SQL injection
- ✅ HTTPS only (production)

### 4️⃣ Testing Rules
- ✅ Unit test critical functions
- ✅ Integration test APIs
- ✅ Test error scenarios
- ✅ Test edge cases
- ✅ Manual testing checklist

### 5️⃣ Pre-Code Review
🔴 **CRITICAL**: Tất cả agent/code assistant phải đọc thật kỹ:
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

## 📞 Communication & Updates

- **Daily standup:** 10 AM (sync progress)
- **Weekly review:** Friday (demo & planning)
- **Issue tracking:** GitHub Issues
- **Code review:** Pull Request process
- **Documentation:** Keep README updated

---

## 📚 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture details
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API specs
- [SECURITY.md](./SECURITY.md) - Security guidelines

---

**Last Updated:** May 27, 2026  
**Status:** 🟡 In Planning  
**Next Step:** Phase 1 - Project Initialization
