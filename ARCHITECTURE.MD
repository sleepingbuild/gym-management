# 🏗️ GYM MANAGEMENT SYSTEM - ARCHITECTURE GUIDE

## 📌 Project Overview

Gym Management System là một nền tảng quản lý phòng gym đa nền tảng bao gồm:

* Backend API Server
* Web Admin Dashboard
* Mobile Application
* AI Fitness Chatbot
* Membership System
* QR Check-in System
* Payment Gateway
* Notification System

---

# ⚠️ GLOBAL DEVELOPMENT RULES

## 1. KHÔNG PHÁ VỠ KIẾN TRÚC HIỆN TẠI

Trước khi tạo:

* file mới
* folder mới
* service mới
* component mới

=> bắt buộc đọc structure hiện tại.

---

## 2. KHÔNG DUPLICATE CODE

* Không tạo service trùng chức năng.
* Không tạo helper/function trùng.
* Không copy business logic sang nhiều nơi.

---

## 3. KHÔNG VIẾT BUSINESS LOGIC TRONG CONTROLLER

### Controller chỉ làm:

* nhận request
* gọi service
* trả response

### Service mới xử lý:

* logic hệ thống
* database
* AI
* payment
* validation nâng cao

---

## 4. KHÔNG HARDCODE

Tất cả:

* API KEY
* DATABASE URL
* JWT SECRET
* PAYMENT SECRET
* PORT

=> phải nằm trong `.env`

---

## 5. TYPESCRIPT STRICT MODE

* Không dùng `any`
* Luôn định nghĩa types/interfaces rõ ràng
* Ưu tiên DTO pattern

---

## 6. MỌI API PHẢI CÓ

* validation
* try/catch
* error handling
* standardized response

---

# 📂 ROOT PROJECT STRUCTURE

```text
gym-management/
│
├── backend/
├── frontend/
├── mobile/
│
├── ROADMAP.md
├── ARCHITECTURE.md
├── CURRENT_STATUS.md
├── README.md
```

---

# 🖥️ BACKEND ARCHITECTURE

## ⚙️ Tech Stack

* NodeJS
* ExpressJS
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* OpenAI / Gemini SDK

---

# 📂 BACKEND STRUCTURE

```text
backend/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   ├── constants/
│   ├── docs/
│   └── server.ts
│
├── .env
├── package.json
└── tsconfig.json
```

---

# 📌 FOLDER RESPONSIBILITIES

---

## config/

Chứa:

* database config
* AI config
* JWT config
* payment config

Ví dụ:

```text
config/
 ├── database.ts
 ├── jwt.ts
 ├── ai.ts
 └── payment.ts
```

---

## controllers/

### Chỉ xử lý:

* req
* res
* gọi service

### KHÔNG:

* query database trực tiếp
* xử lý AI logic
* payment logic

Ví dụ:

```ts
login(req, res)
register(req, res)
```

---

## services/

### Chứa toàn bộ business logic.

Ví dụ:

```text
services/
 ├── auth.service.ts
 ├── ai.service.ts
 ├── membership.service.ts
 ├── payment.service.ts
 └── attendance.service.ts
```

### Service được phép:

* query database
* xử lý AI
* xử lý payment
* xử lý business rules

---

## routes/

### Chỉ định nghĩa API endpoint.

Ví dụ:

```text
routes/
 ├── auth.routes.ts
 ├── ai.routes.ts
 ├── membership.routes.ts
```

---

## middlewares/

### Chứa:

* auth middleware
* role middleware
* error middleware
* rate limit middleware

Ví dụ:

```text
middlewares/
 ├── auth.middleware.ts
 ├── role.middleware.ts
 ├── error.middleware.ts
 └── rateLimit.middleware.ts
```

---

## validators/

### Chứa:

* zod schema
* request validation

Ví dụ:

```text
validators/
 ├── login.validator.ts
 ├── register.validator.ts
 └── payment.validator.ts
```

---

## utils/

### Chứa helper functions.

Ví dụ:

```text
utils/
 ├── generateToken.ts
 ├── hashPassword.ts
 ├── qrGenerator.ts
 └── calculateBMI.ts
```

---

## types/

### Chứa custom TypeScript types/interfaces.

Ví dụ:

```text
types/
 ├── auth.types.ts
 ├── ai.types.ts
 └── payment.types.ts
```

---

## constants/

### Chứa constants hệ thống.

Ví dụ:

```text
constants/
 ├── roles.ts
 ├── membership.ts
 └── aiLimits.ts
```

---

# 🗄️ DATABASE ARCHITECTURE

## ⚙️ Database

* PostgreSQL
* Prisma ORM

---

# 📌 DATABASE RULES

## 1. KHÔNG sửa DB trực tiếp

Mọi thay đổi:

```bash
npx prisma migrate dev
```

---

## 2. KHÔNG hard delete

Ưu tiên:

```text
soft delete
```

Ví dụ:

```prisma
isDeleted Boolean @default(false)
```

---

## 3. Naming Convention

### Table:

```text
PascalCase
```

Ví dụ:

```text
User
MembershipPlan
PaymentHistory
```

---

### Column:

```text
camelCase
```

Ví dụ:

```text
createdAt
updatedAt
membershipId
```

---

# 🔐 AUTHENTICATION ARCHITECTURE

## Authentication Flow

```text
Client
 ↓
JWT Access Token
 ↓
Auth Middleware
 ↓
Protected Route
```

---

## Roles

```text
ADMIN
STAFF
MEMBER
PT
```

---

# 📌 AUTH RULES

## Password

* bcrypt hashing
* minimum 8 chars

---

## JWT

* Access Token
* Refresh Token

---

## Protected Routes

Mọi route quan trọng phải qua:

```text
auth middleware
```

---

# 🤖 AI SYSTEM ARCHITECTURE

## AI Provider

Giai đoạn đầu:

```text
CHỈ DÙNG 1 PROVIDER
```

Ví dụ:

* Gemini
  hoặc
* OpenAI

---

# 📌 AI FLOW

```text
User
 ↓
AI Route
 ↓
AI Service
 ↓
Membership Limit Check
 ↓
AI Provider
 ↓
Save Chat History
 ↓
Return Response
```

---

# 📌 AI RULES

## 1. Không gọi AI trực tiếp trong controller

Sai:

```ts
controller -> OpenAI API
```

Đúng:

```ts
controller -> AI Service -> OpenAI
```

---

## 2. Luôn check membership limit trước khi gọi AI

---

## 3. AI chat phải lưu history

---

# 📱 MOBILE ARCHITECTURE

## ⚙️ Stack

* React Native
* Expo
* TypeScript

---

# 📌 MOBILE RULES

## Không hardcode API URL

Dùng:

```text
.env
```

---

## Không lưu JWT trong AsyncStorage

Dùng:

```text
SecureStore
```

---

# 🌐 FRONTEND ARCHITECTURE

## ⚙️ Stack

* NextJS
* TailwindCSS
* shadcn/ui
* Axios

---

# 📌 FRONTEND RULES

## 1. API calls phải qua service layer

Sai:

```ts
component -> axios
```

Đúng:

```ts
component -> api service -> backend
```

---

## 2. Reusable components

Tất cả:

* button
* modal
* table
* form

=> reusable.

---

# 💳 PAYMENT ARCHITECTURE

## Payment Flow

```text
User
 ↓
Create Payment
 ↓
VNPay/MoMo
 ↓
Webhook Callback
 ↓
Verify Payment
 ↓
Activate Membership
```

---

# 📌 PAYMENT RULES

## KHÔNG activate membership trước webhook thành công.

---

## Payment status phải có:

```text
PENDING
SUCCESS
FAILED
```

---

# 🔔 NOTIFICATION SYSTEM

## Notification Types

* Membership Expiration
* Payment Success
* Check-in Success
* AI Usage Warning

---

# 📌 GIT WORKFLOW

## Branch Rules

```text
main
develop
feature/*
hotfix/*
```

---

# 📌 COMMIT RULES

Ví dụ:

```text
feat(auth): implement login API
fix(payment): fix callback verification
```

---

# 📌 AI AGENT RULES

Mọi AI agents trước khi code phải đọc:

* ROADMAP.md
* ARCHITECTURE.md
* CURRENT_STATUS.md

Sau đó mới được:

* tạo file
* sửa code
* generate feature

---

# 🚫 CÁC THỨ BỊ CẤM

* Hardcode secrets
* Duplicate services
* Duplicate APIs
* Viết SQL raw không cần thiết
* Query DB trong controller
* Tạo folder ngoài architecture
* Dùng any trong TypeScript
* Push trực tiếp vào main branch

---

# 🎯 FINAL GOAL

Sau khi hoàn thành:

* Web Admin hoạt động ổn định
* Mobile App hoạt động Android/iOS
* AI Chatbot hoạt động theo membership
* QR Check-in hoạt động
* Payment hoạt động
* Notification hoạt động
* Production deployment ổn định
