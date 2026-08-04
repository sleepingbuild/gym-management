# 🗺️ Gym Management System - Development Roadmap

**Project Status:** ✅ Released — v1.0.0 (original 26-issue roadmap below, plus Phase 7–8 extension work — see [PROJECT_STATUS.md](./PROJECT_STATUS.md) for the extension feature list)  
**Last Updated:** 02/08/2026  
**Team Size:** 2 core members (original roadmap); extension phases coordinated across multiple contributing agents on separate feature areas  
**Version:** v1.0.0

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
- ✅ **AI Chatbot** - Hỗ trợ luyện tập và dinh dưỡng (ban đầu Gemini RAG, hiện tại đã chuyển hẳn sang self-trained Qwen 2.5 + RAG + streaming, xem [PROJECT_STATUS.md](./PROJECT_STATUS.md))
- ✅ **Membership System** - Quản lý gói thành viên (kèm hủy gói tự/hộ ở phase mở rộng)
- ✅ **Payment System** - Thanh toán online (VNPay / MoMo)
- ✅ **Notification System** - Thông báo realtime
- ✅ **Body Progress Tracking** - Theo dõi tiến trình cơ thể
- ✅ **Face Check-in** - Điểm danh khuôn mặt, thay thế QR check-in ban đầu (phase mở rộng)
- ✅ **Docker Support** - Containerization
- ✅ **Production Deployment** - Vercel/Render + Neon (đã migrate khỏi Railway)

---

## 🚀 Development Phases & Milestones

### MILESTONE 1: PHASE 1 - PROJECT INITIALIZATION ✅ COMPLETED

**⏱️ Time:** 2-3 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Both

- [x] #1 - Setup repository structure và workflow
- [x] #2 - Setup NodeJS + TypeScript Backend
- [x] #3 - Setup PostgreSQL và Prisma ORM

---

### MILESTONE 2: PHASE 2 - AUTHENTICATION & DATABASE ✅ COMPLETED

**⏱️ Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** M1 + M2 UI Prep

- [x] #4 - Thiết kế Users schema và Roles
- [x] #5 - Xây dựng Register API
- [x] #6 - Xây dựng Login API
- [x] #7 - Middleware Authentication và Authorization
- [x] #8 - Thiết kế Membership System

---

### MILESTONE 3: PHASE 3 - MEMBERSHIP & AI CORE ✅ COMPLETED

**⏱️ Time:** 3-4 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** M1 Backend

- [x] #9 - API lấy danh sách packages
- [x] #10 - API mua gói thành viên
- [x] #11 - Thiết kế bảng AI Chat History
- [x] #12 - Tích hợp AI RAG pipeline (ban đầu Gemini API, sau đó thay hẳn bằng self-trained Qwen — xem CHANGELOG v1.0.0)
- [x] #13 - Giới hạn AI usage theo membership

---

### MILESTONE 4: PHASE 4 - FRONTEND ADMIN DASHBOARD ✅ COMPLETED

**⏱️ Time:** 5-6 days | **🎯 Priority:** 🟡 High | **👥 Owner:** M2 Frontend

- [x] #14 - Setup NextJS Frontend
- [x] #15 - Thiết kế Login Page
- [x] #16 - Dashboard Overview UI
- [x] #17 - User Management Table

---

### MILESTONE 5: PHASE 5 - PAYMENT & NOTIFICATION ✅ COMPLETED

**⏱️ Time:** 4-5 days | **🎯 Priority:** 🟠 Medium | **👥 Owner:** M1 Backend

- [x] #18 - Thiết kế bảng Payments
- [x] #19 - Tích hợp VNPay / MoMo
- [x] #20 - Xây dựng Notification System
- [x] #89 - AI Chat UI (pivot từ mobile sang web)

---

### MILESTONE 6: PHASE 6 - TESTING & DEPLOYMENT ✅ COMPLETED

**⏱️ Time:** 4-5 days | **🎯 Priority:** 🔴 Critical | **👥 Owner:** Both

- [x] #21 - Theo dõi tiến trình cơ thể (BMI, cân nặng, Line Chart)
- [x] #22 - API và Security Testing (Jest, JWT, SQL Injection)
- [x] #23 - Optimize Database và API (Indexing, Redis, < 500ms)
- [x] #24 - Deploy Backend và Database (Docker, ban đầu Railway — đã migrate sang Render sau khi hết credit free tier)
- [x] #25 - Deploy Frontend Web (Vercel)
- [x] #26 - Final Production Release + Monitoring — Closed, v1.0.0

---

## 📊 Timeline Summary

| Milestone / Phase | Duration | Priority | Owner | Status |
|---|---|---|---|---|
| 1. Project Initialization | 2-3 days | 🔴 Critical | Both | ✅ Completed |
| 2. Authentication & Database | 4-5 days | 🔴 Critical | M1 + M2 UI Prep | ✅ Completed |
| 3. Membership & AI Core | 3-4 days | 🔴 Critical | M1 Backend | ✅ Completed |
| 4. Frontend Admin Dashboard | 5-6 days | 🟡 High | M2 Frontend | ✅ Completed |
| 5. Payment & Notification | 4-5 days | 🟠 Medium | M1 Backend | ✅ Completed |
| 6. Testing & Deployment | 4-5 days | 🔴 Critical | Both | ✅ Completed |

**Tổng số Issues:** 27 issues (26 + #89)  
**Status:** 27/27 completed (100%) — cộng thêm Phase 7–8 mở rộng (không đánh số issue gốc), xem [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

## 🌐 Deployment URLs

| Service | URL |
|---------|-----|
| Frontend | https://gym-management-five-gules.vercel.app *(verify current domain — may have changed)* |
| Backend | https://gym-management-dwvx.onrender.com *(migrated from Railway after free-tier credit ran out)* |
| API Docs | https://gym-management-dwvx.onrender.com/api/docs |

---

## 🐳 Docker Commands

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose logs -f backend

# Stop all
docker-compose down
**Tổng số Issues:** 27 issues (26 issues gốc + #89 bổ sung)  
**Tổng thời gian tối ưu (2 thành viên làm song song):** 4-5 tuần (ước tính ban đầu)  
**Thời gian thực tế Phase 1-5:** 31/05/2026 → 12/06/2026 (~13 ngày, nhanh hơn ước tính ban đầu)

---

## 👥 Team Allocation

### 🧑‍💻 Member 1 — Backend Lead + AI (Phases 1, 2, 3, 5, 6)
- Chịu trách nhiệm thiết kế Database, APIs, bảo mật hệ thống, tích hợp AI (ban đầu Gemini, sau chuyển sang self-trained Qwen), cấu hình cổng thanh toán VNPay/MoMo và hạ tầng server.

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

📚 Related Documents
ARCHITECTURE.MD - System architecture

README.md - Project overview

PROJECT_STATUS.md - Current progress

CHANGELOG.md - Version history

RELEASE_EVIDENCE.md - Release evidence
---