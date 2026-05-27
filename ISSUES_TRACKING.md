# 📊 Gym Management System - Issues Tracking

## Phase Distribution (30 Issues)

### 📌 PHASE 1: Project Initialization (3 issues - MVP System)
- [ ] Issue #1: [Setup] Khởi tạo cấu trúc repository và workflow Git
- [ ] Issue #2: [Backend] Setup NodeJS + TypeScript Backend
- [ ] Issue #3: [Database] Setup PostgreSQL và Prisma ORM

### 📌 PHASE 2: Database & Authentication (7 issues - MVP System)
- [ ] Issue #4: [Database] Thiết kế bảng Users và Roles
- [ ] Issue #5: [Auth] Xây dựng API Register
- [ ] Issue #6: [Auth] Xây dựng API Login
- [ ] Issue #7: [Auth] Middleware Authentication và Authorization
- [ ] Issue #8: [Database] Thiết kế Membership System
- [ ] Issue #9: [Membership] API lấy danh sách packages
- [ ] Issue #10: [Membership] API mua gói thành viên

### 📌 PHASE 3: Membership System (Included in Phase 2)
**Merged with Phase 2 in MVP System milestone**

### 📌 PHASE 4: AI Chatbot Integration (3 issues - AI Integration)
- [ ] Issue #11: [Database] Thiết kế bảng AI Chat History
- [ ] Issue #12: [AI] Tích hợp OpenAI/Gemini API
- [ ] Issue #13: [AI] Giới hạn AI usage theo membership

### 📌 PHASE 5: Admin Dashboard Frontend (4 issues - Admin Dashboard)
- [ ] Issue #14: [Frontend] Setup ReactJS/NextJS Frontend
- [ ] Issue #15: [Frontend] Thiết kế Login Page
- [ ] Issue #16: [Frontend] Thiết kế Dashboard Overview
- [ ] Issue #17: [Frontend] User Management Table

### 📌 PHASE 6: Mobile Application (4 issues - Mobile Application)
- [ ] Issue #18: [Mobile] Setup React Native Project
- [ ] Issue #19: [Mobile] Thiết kế Login/Register Screen
- [ ] Issue #20: [Mobile] Home Screen và Workout Screen
- [ ] Issue #21: [Mobile] AI Chat Screen

### 📌 PHASE 7: Payment System (2 issues - Final Deployment)
- [ ] Issue #22: [Database] Thiết kế bảng Payments
- [ ] Issue #23: [Payment] Tích hợp VNPay/MoMo

### 📌 PHASE 8: Notification System (1 issue - Final Deployment)
- [ ] Issue #24: [Notification] Xây dựng Notification System

### 📌 PHASE 9: Testing & Optimization (2 issues - Final Deployment)
- [ ] Issue #26: [Testing] API Testing và Security Testing
- [ ] Issue #27: [Optimization] Optimize Database và API

### 📌 PHASE 10: Deployment (3 issues - Final Deployment)
- [ ] Issue #28: [Deployment] Deploy Backend và Database
- [ ] Issue #29: [Deployment] Deploy Frontend Web
- [ ] Issue #30: [Deployment] Build Production Mobile App

### 📌 Additional Features (1 issue - Mobile Application)
- [ ] Issue #25: [Feature] Theo dõi tiến trình cơ thể

---

## 📈 Progress Tracking

### By Phase
| Phase | Issues | Status | Progress |
|-------|--------|--------|----------|
| Phase 1: Initialization | 3 | 🔴 Todo | 0% |
| Phase 2: Database & Auth | 7 | 🔴 Todo | 0% |
| Phase 4: AI Integration | 3 | 🔴 Todo | 0% |
| Phase 5: Admin Dashboard | 4 | 🔴 Todo | 0% |
| Phase 6: Mobile App | 4 | 🔴 Todo | 0% |
| Phase 7: Payment | 2 | 🔴 Todo | 0% |
| Phase 8: Notifications | 1 | 🔴 Todo | 0% |
| Phase 9: Testing | 2 | 🔴 Todo | 0% |
| Phase 10: Deployment | 3 | 🔴 Todo | 0% |
| Additional | 1 | 🔴 Todo | 0% |
| **TOTAL** | **30** | 🔴 Todo | **0%** |

### By Label
| Label | Issues | Progress |
|-------|--------|----------|
| backend | 10 | 0% |
| database | 5 | 0% |
| frontend | 4 | 0% |
| mobile | 5 | 0% |
| ai | 3 | 0% |
| auth | 3 | 0% |
| payment | 2 | 0% |
| testing | 1 | 0% |
| deployment | 3 | 0% |
| setup | 1 | 0% |

### By Milestone
| Milestone | Issues | Progress |
|-----------|--------|----------|
| MVP System | 10 | 0% |
| AI Integration | 3 | 0% |
| Admin Dashboard | 4 | 0% |
| Mobile Application | 5 | 0% |
| Final Deployment | 8 | 0% |

---

## 🎯 Critical Path (Dependencies)

```
Phase 1 (3 issues)
    ↓
Phase 2 (7 issues)
    ├─→ Phase 4 AI (3 issues)
    │       └─→ Phase 6 Mobile (4 issues)
    │
    ├─→ Phase 5 Admin (4 issues)
    │
    └─→ Phase 7 Payment (2 issues)
            └─→ Phase 8 Notifications (1 issue)

Phase 9 Testing (2 issues)
Phase 10 Deployment (3 issues)
```

---

## 📋 Global Rules to Follow

1. ✅ Đọc kỹ project structure trước khi code
2. ✅ Không hardcode API URLs
3. ✅ Không duplicate components/logic
4. ✅ Tất cả API phải có validation
5. ✅ Tất cả feature phải có error handling
6. ✅ Không sửa schema tùy tiện sau migration
7. ✅ Không push trực tiếp lên main
8. ✅ Follow ESLint + Prettier

---

**Last Updated:** May 27, 2026
