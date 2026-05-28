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

#### 🏗️ Deliverables
- ✅ Nền tảng dự án sẵn sàng, Backend kết nối DB thành công.

---

### MILESTONE 2: PHASE 2 - AUTHENTICATION & DATABASE SYSTEM
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Member 1 (Backend)
*Các Issues liên kết:* `#4` -> `#8`

#### 📝 Tasks (Issues)
- [ ] **Issue #4 [Database]:** Thiết kế cấu trúc bảng Users (Người dùng) và Roles (Quyền hạn: ADMIN, STAFF, MEMBER, PT).
- [ ] **Issue #5 [Auth]:** Xây dựng cổng API Đăng ký tài khoản (Register API - mã hóa bcrypt, JWT).
- [ ] **Issue #6 [Auth]:** Xây dựng cổng API Đăng nhập hệ thống (Login API - Access/Refresh token).
- [ ] **Issue #7 [Auth]:** Triển khai bộ lọc trung gian Authentication và Authorization Middleware.
- [ ] **Issue #8 [Database]:** Thiết kế cấu trúc bảng quản lý gói hội viên (Basic, Premium, Elite).

#### 🏗️ Deliverables
- ✅ Hệ thống đăng ký/đăng nhập hoàn thiện bảo mật, phân quyền route chặt chẽ.

---

### MILESTONE 3: PHASE 3 - MEMBERSHIP & AI CORE
**⏱️ Estimated Time:** 3-4 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Member 1 (Backend)
*Các Issues liên kết:* `#9` -> `#13`

#### 📝 Tasks (Issues)
- [ ] **Issue #9 [Membership]:** Phát triển API lấy danh sách các gói hội viên hiện có (`GET /api/packages`).
- [ ] **Issue #10 [Membership]:** Phát triển API đăng ký mua gói dịch vụ thành viên (`POST /api/packages/buy`).
- [ ] **Issue #11 [Database]:** Thiết kế cấu trúc bảng lưu trữ lịch sử trò chuyện AI Chat History.
- [ ] **Issue #12 [AI]:** Tích hợp bộ công cụ kết nối SDK OpenAI / Gemini API (AI fitness coach).
- [ ] **Issue #13 [AI]:** Xây dựng logic giới hạn số lượt sử dụng AI theo từng hạng gói hội viên (Basic: 10, Premium: 100, Elite: Unlimited).

#### 🏗️ Deliverables
- ✅ Quản lý gói cước vận hành tốt, Core AI có khả năng nhận diện giới hạn gói để phản hồi.

---

### MILESTONE 4: PHASE 4 - FRONTEND ADMIN DASHBOARD
**⏱️ Estimated Time:** 5-6 days | **🎯 Priority:** 🟡 High | **👥 Owner:** Member 2 (Frontend)
*Các Issues liên kết:* `#14` -> `#17`

#### 📝 Tasks (Issues)
- [ ] **Issue #14 [Frontend]:** Khởi tạo nền tảng dự án Frontend bằng ReactJS / NextJS + TailwindCSS (Axios Client, Route setup).
- [ ] **Issue #15 [Frontend]:** Thiết kế giao diện trang Đăng nhập (Login Page UI & Form validation).
- [ ] **Issue #16 [Frontend]:** Thiết kế cấu trúc giao diện trang Dashboard Overview chính (Sidebar, Topbar, KPI Cards).
- [ ] **Issue #17 [Frontend]:** Phát triển cấu phần bảng quản lý danh sách người dùng (User Management Table, Search/Filter).

#### 🏗️ Deliverables
- ✅ Giao diện Web Admin hoàn thành các tính năng cốt lõi, kết nối API đồng bộ dữ liệu.

---

### MILESTONE 5: PHASE 5 - MOBILE APPLICATION
**⏱️ Estimated Time:** 7-10 days | **🎯 Priority:** 🟡 High | **👥 Owner:** Member 2 (Mobile)
*Các Issues liên kết:* `#18` -> `#21`

#### 📝 Tasks (Issues)
- [ ] **Issue #18 [Mobile]:** Khởi tạo nền tảng ứng dụng di động Mobile với React Native + Expo (Navigation, Theme).
- [ ] **Issue #19 [Mobile]:** Xây dựng màn hình Đăng nhập và Đăng ký thành viên (SecureStore token, Auto-login).
- [ ] **Issue #20 [Mobile]:** Thiết kế giao diện trang chủ Home và màn hình Lịch trình tập luyện.
- [ ] **Issue #21 [Mobile]:** Thiết kế và phát triển màn hình giao diện phòng trò chuyện AI Chat (FlatList, Typing indicator).

#### 🏗️ Deliverables
- ✅ Ứng dụng chạy mượt mà trên Android/iOS, tính năng chat Real-time kết nối trơn tru.

---

### MILESTONE 6: PHASE 6 - PAYMENT & NOTIFICATION SYSTEM
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🟠 Medium | **👥 Owner:** Member 1 (Backend)
*Các Issues liên kết:* `#22` -> `#24`

#### 📝 Tasks (Issues)
- [ ] **Issue #22 [Database]:** Thiết kế cấu trúc bảng quản lý lịch sử thanh toán Payments.
- [ ] **Issue #23 [Payment]:** Tích hợp cổng thanh toán trực tuyến VNPay / MoMo (Xử lý IPN, Webhook, Auto-upgrade package).
- [ ] **Issue #24 [Notification]:** Xây dựng kiến trúc hệ thống thông báo đẩy Notification System (FCM / Expo Push).

#### 🏗️ Deliverables
- ✅ Dòng tiền tự động hóa qua cổng thanh toán, hệ thống tự kích hoạt thông báo nhắc nhở.

---

### MILESTONE 7: PHASE 7 - TESTING & DEPLOYMENT
**⏱️ Estimated Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Both
*Các Issues liên kết:* `#25` -> `#30`

#### 📝 Tasks (Issues)
- [ ] **Issue #25 [Feature]:** Triển khai tính năng hiển thị và theo dõi tiến trình thay đổi cơ thể (Cân nặng, Tỷ lệ mỡ, Line Chart).
- [ ] **Issue #26 [Testing]:** Thực hiện viết Unit Test bảo mật và kiểm thử toàn bộ hệ thống API (Jest, Security audit).
- [ ] **Issue #27 [Optimization]:** Tối ưu hóa hiệu năng câu lệnh Database truy vấn và tốc độ phản hồi API (Indexing, Pagination, Caching).
- [ ] **Issue #28 [Deployment]:** Thực hiện triển khai máy chủ Backend và cấu hình cơ sở dữ liệu Database (Docker, Railway/Render, Cloud DB).
- [ ] **Issue #29 [Deployment]:** Thực hiện đưa ứng dụng giao diện quản trị Frontend Web vận hành chính thức (Vercel).
- [ ] **Issue #30 [Deployment]:** Đóng gói thành phẩm và phát hành phiên bản ứng dụng di động Production Mobile App (Expo EAS Build, APK/IPA).

#### 🏗️ Deliverables
- ✅ Hệ thống đạt hiệu năng mục tiêu (API < 500ms), toàn bộ nền tảng online ổn định trên Production.

---

## 📊 Timeline Summary

| Milestone / Phase | Duration | Start | End | Priority | Issues Count |
|-------------------|----------|-------|-----|----------|--------------|
| 1. Initialization | 2-3 days | Week 1 | Week 1 | 🔴 | 3 Issues (#1-#3) |
| 2. Auth & Database| 4-5 days | Week 2 | Week 2 | 🔴 | 5 Issues (#4-#8) |
| 3. Membership & AI| 3-4 days | Week 3 | Week 3 | 🔴 | 5 Issues (#9-#13) |
| 4. Frontend Admin | 5-6 days | Week 4 | Week 5 | 🟡 | 4 Issues (#14-#17) |
| 5. Mobile App     | 7-10 days| Week 5 | Week 6 | 🟡 | 4 Issues (#18-#21) |
| 6. Payment & Noti | 4-5 days | Week 6 | Week 7 | 🟠 | 3 Issues (#22-#24) |
| 7. Test & Deploy  | 4-5 days | Week 7 | Week 8 | 🔴 | 6 Issues (#25-#30) |

**Tổng thời gian tối ưu (2 thành viên làm song song):** 5-6 tuần.

---

## 👥 Team Allocation

### 🧑‍💻 Member 1 - Backend Lead + AI (Phases 1, 2, 3, 6, 7)
- Chịu trách nhiệm thiết kế Database, APIs, bảo mật hệ thống, tích hợp AI OpenAI/Gemini, cấu hình cổng thanh toán VNPay/MoMo và hạ tầng server.

### 🧑‍🎨 Member 2 - Frontend Lead + Mobile (Phases 1, 4, 5, 7)
- Chịu trách nhiệm xây dựng giao diện quản trị Admin Web (React/NextJS) và phát hành ứng dụng di động cho khách hàng (React Native + Expo).

---

## ⚠️ CRITICAL DEVELOPMENT RULES
1. **Không code chồng chéo phase:** Giải quyết dứt điểm các issues thuộc Milestone hiện tại trước khi chuyển sang Milestone tiếp theo.
2. **Không hardcode cấu hình:** Đưa toàn bộ chuỗi kết nối DB, API Keys, JWT Secret vào file `.env`.
3. **TypeScript Strictly:** Không sử dụng kiểu dữ liệu `any`.
4. **Pre-Code Review:** Tất cả các trợ lý AI/Agents trước khi bắt tay viết code phải đọc kỹ cấu trúc thư mục hiện tại để tránh xung đột cấu trúc.
