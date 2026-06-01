# 🏗️ GYM MANAGEMENT SYSTEM - ARCHITECTURE GUIDE

## 📌 Project Overview

Gym Management System là một nền tảng quản lý phòng gym bao gồm:

* Backend API Server
* Web Admin Dashboard
* Membership System
* QR Check-in System
* Payment Gateway
* Notification System
* AI Fitness Chatbot

---

## 📋 Table of Contents

1. [Global Development Rules](#global-development-rules)
2. [Root Project Structure](#root-project-structure)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Architecture](#database-architecture)
6. [API Standards](#api-standards)
7. [System Flows](#system-flows)
8. [Environment Variables](#environment-variables)
9. [Critical Rules Summary](#critical-rules-summary)

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

* validation (Zod)
* try/catch
* error handling
* standardized response format
* proper HTTP status codes

---

# 📂 ROOT PROJECT STRUCTURE

```text
gym-management/
│
├── backend/                    # NodeJS + Express + TypeScript
├── frontend/                   # NextJS + TailwindCSS
│
├── ROADMAP.md                  # Development timeline
├── ARCHITECTURE.md             # This file
├── PROJECT_STATUS.md           # Current progress tracking
├── .gitignore
└── README.md
🖥️ BACKEND ARCHITECTURE
⚙️ Tech Stack
NodeJS (v18+)

ExpressJS

TypeScript

PostgreSQL

Prisma ORM

JWT Authentication

OpenAI / Gemini SDK

VNPay / MoMo SDK

📂 BACKEND STRUCTURE
text
backend/
│
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   ├── migrations/             # DB migration history
│   └── seed.ts                 # Initial data seeding
│
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   ├── ai.ts
│   │   ├── payment.ts
│   │   └── email.ts
│   │
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── membership.controller.ts
│   │   ├── attendance.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── pt.controller.ts
│   │   └── notification.controller.ts
│   │
│   ├── services/               # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── membership.service.ts
│   │   ├── attendance.service.ts
│   │   ├── ai.service.ts
│   │   ├── payment.service.ts
│   │   ├── pt.service.ts
│   │   ├── notification.service.ts
│   │   └── qr.service.ts
│   │
│   ├── repositories/           # Database access layer (optional)
│   │   ├── user.repository.ts
│   │   ├── membership.repository.ts
│   │   └── ...
│   │
│   ├── middlewares/            # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── validators/             # Request validation schemas
│   │   ├── auth.validator.ts
│   │   ├── membership.validator.ts
│   │   ├── payment.validator.ts
│   │   ├── attendance.validator.ts
│   │   └── ai.validator.ts
│   │
│   ├── types/                  # TypeScript types & interfaces
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── membership.types.ts
│   │   ├── payment.types.ts
│   │   ├── ai.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/                  # Helper functions
│   │   ├── generateToken.ts
│   │   ├── hashPassword.ts
│   │   ├── qrGenerator.ts
│   │   ├── calculateBMI.ts
│   │   ├── errors.ts
│   │   └── logger.ts
│   │
│   ├── constants/              # Constants & enums
│   │   ├── roles.ts
│   │   ├── membership.ts
│   │   ├── aiLimits.ts
│   │   ├── paymentStatus.ts
│   │   └── httpStatus.ts
│   │
│   ├── docs/                   # API Documentation
│   │   ├── swagger.ts
│   │   └── endpoints/
│   │
│   ├── routes/                 # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── membership.routes.ts
│   │   ├── attendance.routes.ts
│   │   ├── ai.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── pt.routes.ts
│   │   └── index.ts
│   │
│   ├── server.ts               # Express app setup
│   └── main.ts                 # Entry point
│
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
📌 FOLDER RESPONSIBILITIES
config/
Chứa toàn bộ cấu hình ứng dụng. Không logic gì ở đây, chỉ là biến config.

ts
// config/jwt.ts
export const JWT_CONFIG = {
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  secret: process.env.JWT_SECRET || 'your-secret'
};
controllers/
Chỉ xử lý request/response, gọi service duy nhất. Không query DB, không logic.

ts
// Sai ❌
async login(req, res) {
  const user = await db.user.findUnique(...);
  res.json(user);
}

// Đúng ✅
async login(req, res) {
  const result = await authService.login(req.body);
  res.json(result);
}
services/
Toàn bộ business logic nằm đây. Service được phép:

Query database qua Prisma

Gọi AI API

Gọi Payment API

Xử lý business rules

Gọi service khác

ts
// auth.service.ts
async login(credentials: LoginDTO): Promise<LoginResponse> {
  const user = await prisma.user.findUnique(...);
  if (!user) throw new AppError(404, 'AUTH_003', 'User not found');
  
  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) throw new AppError(401, 'AUTH_004', 'Invalid password');
  
  const tokens = generateTokens(user);
  return tokens;
}
middlewares/
auth.middleware.ts: Verify JWT token

role.middleware.ts: Check user role (ADMIN, PT, MEMBER)

error.middleware.ts: Centralized error handling

rateLimit.middleware.ts: Rate limiting

validation.middleware.ts: Validate request schema

validators/
Dùng Zod để định nghĩa schema validation.

ts
// auth.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('AUTH_001: Invalid email format'),
  password: z.string().min(8, 'AUTH_002: Password too short')
});

export type LoginRequest = z.infer<typeof loginSchema>;
types/
Tất cả TypeScript interfaces đặt ở đây.

ts
// auth.types.ts
export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  PT = 'PT'
}
utils/
Helper functions không liên quan đến business logic.

ts
// utils/errors.ts
export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  
  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

// utils/logger.ts
export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`)
};
constants/
Các hằng số của hệ thống.

ts
// constants/aiLimits.ts
export const AI_LIMITS = {
  BASIC: 10,
  PREMIUM: 100,
  ELITE: Infinity
};

// constants/paymentStatus.ts
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}
🌐 FRONTEND ARCHITECTURE (Web Admin Dashboard)
⚙️ Tech Stack
NextJS 14+ (App Router)

TailwindCSS

shadcn/ui

Axios

TypeScript

React Query / SWR

📂 FRONTEND STRUCTURE
text
frontend/
│
├── public/
│   ├── images/
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── admin/          # Admin only routes
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── memberships/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   ├── payments/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── pts/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/page.tsx
│   │   │   │
│   │   │   ├── pt/             # PT only routes
│   │   │   │   ├── students/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── schedules/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── progress/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── member/         # Member only routes
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── schedule/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── attendance/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── ai-chat/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── progress/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Form.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   │
│   │   ├── membership/
│   │   │   ├── MembershipCard.tsx
│   │   │   ├── PlanSelector.tsx
│   │   │   └── MembershipTable.tsx
│   │   │
│   │   ├── attendance/
│   │   │   ├── AttendanceChart.tsx
│   │   │   ├── CheckinHistory.tsx
│   │   │   └── QRCodeGenerator.tsx
│   │   │
│   │   ├── payment/
│   │   │   ├── PaymentForm.tsx
│   │   │   └── TransactionTable.tsx
│   │   │
│   │   ├── pt/
│   │   │   ├── PTCard.tsx
│   │   │   ├── PTAssignment.tsx
│   │   │   └── PTScheduleForm.tsx
│   │   │
│   │   └── ai/
│   │       ├── ChatMessage.tsx
│   │       ├── ChatInput.tsx
│   │       └── UsageLimit.tsx
│   │
│   ├── services/
│   │   ├── api.client.ts
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── membership.service.ts
│   │   ├── attendance.service.ts
│   │   ├── payment.service.ts
│   │   ├── pt.service.ts
│   │   └── ai.service.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── usePagination.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── AppProvider.tsx
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── membership.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── lib/
│       └── axios.config.ts
│
├── .env.example
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
📌 FRONTEND RULES
1. API calls phải qua service layer
ts
// ❌ WRONG
export function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get('/api/users').then(res => setUsers(res.data));
  }, []);
}

// ✅ CORRECT
export function UserList() {
  const { data: users } = useFetch(() => userService.getUsers());
}
2. Reusable components
Tất cả UI components được dùng 2+ lần phải được tách ra thành reusable.

3. Type safety
Luôn sử dụng TypeScript types cho props và data.

4. Error handling
Tất cả API calls phải có error handling.

🗄️ DATABASE ARCHITECTURE
⚙️ Tech Stack
PostgreSQL

Prisma ORM

📌 DATABASE SCHEMA
prisma
// User & Authentication
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  fullName  String
  phone     String?
  avatar    String?
  role      Role      @default(MEMBER)
  
  userMembership    UserMembership?
  paymentHistory    Payment[]
  chatHistory       ChatHistory[]
  attendance        Attendance[]
  ptAssignments     PTAssignment[]  // as student
  ptProfile         PTProfile?      // as PT
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  isDeleted Boolean   @default(false)
}

enum Role {
  ADMIN
  MEMBER
  PT
}

// Membership System
model MembershipPlan {
  id          String    @id @default(cuid())
  name        String    // "Basic", "Premium", "Elite"
  price       Float
  duration    Int       // days
  aiLimit     Int       // Monthly AI usage limit
  description String?
  
  userMemberships UserMembership[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model UserMembership {
  id              String    @id @default(cuid())
  userId          String    @unique
  planId          String
  startDate       DateTime  @default(now())
  expiryDate      DateTime
  aiUsageCount    Int       @default(0)
  aiUsageReset    DateTime  @default(now())
  status          String    @default("ACTIVE")  // ACTIVE, EXPIRED, SUSPENDED
  
  user            User            @relation(fields: [userId], references: [id])
  plan            MembershipPlan  @relation(fields: [planId], references: [id])
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// Check-in / Attendance
model Attendance {
  id          String    @id @default(cuid())
  userId      String
  checkInTime DateTime
  checkOutTime DateTime?
  qrCode      String    @unique
  qrExpiry    DateTime
  
  user        User      @relation(fields: [userId], references: [id])
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// AI Chat
model ChatHistory {
  id        String    @id @default(cuid())
  userId    String
  role      String    // "user" or "assistant"
  content   String    @db.Text
  
  user      User      @relation(fields: [userId], references: [id])
  
  createdAt DateTime  @default(now())
}

// Payment
model Payment {
  id              String        @id @default(cuid())
  userId          String
  membershipPlanId String
  amount          Float
  status          PaymentStatus @default(PENDING)
  paymentMethod   String
  transactionId   String?       @unique
  description     String?
  
  user            User          @relation(fields: [userId], references: [id])
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

// Personal Trainer Profile
model PTProfile {
  id            String    @id @default(cuid())
  userId        String    @unique
  specialization String
  bio           String?
  experience    Int       // years
  rate          Float     // per session
  availability  Json      // { "Monday": ["09:00-12:00", "14:00-18:00"], ... }
  
  user          User      @relation(fields: [userId], references: [id])
  assignments   PTAssignment[]
  schedule      PTSchedule[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// PT Assignment (PT-Student relationship)
model PTAssignment {
  id          String    @id @default(cuid())
  ptId        String    // PT's user ID
  studentId   String    // Student's user ID
  status      String    @default("ACTIVE")  // ACTIVE, PAUSED, ENDED
  startDate   DateTime  @default(now())
  endDate     DateTime?
  
  pt          User      @relation("PTAssignments", fields: [ptId], references: [id])
  student     User      @relation("StudentAssignments", fields: [studentId], references: [id])
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// PT Schedule
model PTSchedule {
  id        String    @id @default(cuid())
  ptId      String
  date      DateTime
  startTime String    // "09:00"
  endTime   String    // "12:00"
  isBooked  Boolean   @default(false)
  studentId String?   // Member who booked this slot
  
  pt        PTProfile @relation(fields: [ptId], references: [id])
  
  createdAt DateTime  @default(now())
}

// Body Progress Tracking
model BodyProgress {
  id        String    @id @default(cuid())
  userId    String
  weight    Float     // kg
  bodyFat   Float     // percentage
  bmi       Float
  notes     String?
  
  user      User      @relation(fields: [userId], references: [id])
  
  recordedAt DateTime  @default(now())
}

// Notification
model Notification {
  id        String    @id @default(cuid())
  userId    String
  title     String
  message   String    @db.Text
  type      String    // "MEMBERSHIP_EXPIRY", "PAYMENT_SUCCESS", "CHECKIN_SUCCESS", "AI_LIMIT_WARNING"
  read      Boolean   @default(false)
  data      Json?     // Additional metadata
  
  createdAt DateTime  @default(now())
}
📌 DATABASE RULES
1. Migrations
Mọi thay đổi DB phải qua migrations.

bash
npx prisma migrate dev --name add_new_field
2. Soft Delete
Ưu tiên soft delete thay vì hard delete.

3. Naming Convention
Table/Model: PascalCase

Column/Field: camelCase

Enum: UPPERCASE

4. Timestamps
Tất cả table phải có createdAt và updatedAt.

🔐 AUTHENTICATION ARCHITECTURE
Authentication Flow
text
1. Client gửi credentials (email + password)
   ↓
2. Server verify (bcrypt password)
   ↓
3. Generate JWT tokens (Access + Refresh)
   ↓
4. Client lưu tokens (HTTP Only Cookie hoặc Memory)
   ↓
5. Client gửi Access Token trong mỗi request header: "Authorization: Bearer {token}"
   ↓
6. Server verify token → attach user info vào request
   ↓
7. Route handler xử lý logic
JWT Structure
text
Access Token:
- Expires: 15 minutes
- Contains: userId, email, role

Refresh Token:
- Expires: 7 days
- Contains: userId
Roles & Permissions
Role	Permissions
ADMIN	Quản lý toàn bộ hệ thống (users, PT, memberships, payments, settings)
PT	Xem học viên, quản lý lịch, tạo workout plan, theo dõi tiến độ
MEMBER	Đăng ký gói tập, đặt lịch với PT, chat AI, track progress, check-in
🤖 AI SYSTEM ARCHITECTURE
AI Provider
CHỌN 1 PROVIDER DUY NHẤT:

Gemini API (recommended - free tier tốt)

hoặc OpenAI API

AI Flow
text
1. User gửi tin nhắn chat
   ↓
2. Validate request
   ↓
3. Check membership limit (AI usage count < plan limit)
   ↓
4. Nếu hết lượt → trả về error
   ↓
5. Gọi AI Provider API với system prompt
   ↓
6. AI trả về response
   ↓
7. Lưu chat history (user message + AI response)
   ↓
8. Increment AI usage count
   ↓
9. Trả response về client
AI Limits by Plan
Plan	Monthly Limit	Daily Limit
BASIC	10	1
PREMIUM	100	10
ELITE	Unlimited	Unlimited
💳 PAYMENT ARCHITECTURE
Payment Providers
VNPay (Vietnam)

MoMo (Vietnam)

Payment Flow
text
1. User click "Upgrade Plan"
   ↓
2. Create Payment record (status = PENDING)
   ↓
3. Redirect to VNPay/MoMo payment page
   ↓
4. User completes payment
   ↓
5. Payment gateway sends Webhook callback
   ↓
6. Server receives callback → verify signature
   ↓
7. Update Payment status (SUCCESS or FAILED)
   ↓
8. If SUCCESS: Update UserMembership (new expiry date)
   ↓
9. Send notification
⚠️ CRITICAL PAYMENT RULE
KHÔNG activate membership trước khi nhận webhook xác nhận từ payment gateway.

ts
// ❌ WRONG
async buyMembership(userId, planId) {
  await userMembershipService.upgrade(userId, planId);
  const payment = await paymentService.create(...);
}

// ✅ CORRECT
async buyMembership(userId, planId) {
  const payment = await paymentService.create(userId, planId, { status: 'PENDING' });
  return payment;
}

// In webhook handler:
async handlePaymentCallback(webhookData) {
  if (webhookData.resultCode === 0) {
    await userMembershipService.upgrade(payment.userId, payment.membershipPlanId);
  }
}
🔐 QR CHECK-IN SYSTEM
QR Generation & Validation Flow
text
1. Member requests QR code (GET /api/attendance/qr)
   ↓
2. Server creates Attendance record with:
   - qrCode (unique random string)
   - qrExpiry (now + 5 minutes)
   ↓
3. Member displays QR code
   ↓
4. Member scans QR code (or staff scans)
   ↓
5. Server verifies: QR exists? Not expired? Membership valid?
   ↓
6. If valid: update checkInTime, return success
Security Rules
Expiry: 5 minutes

One-time use

Signature: HMAC-SHA256

🔗 API STANDARDS
Response Format
ts
// Success Response
{
  success: true,
  statusCode: 200,
  message: "Operation successful",
  data: { /* actual data */ }
}

// Error Response
{
  success: false,
  statusCode: 400,
  message: "Error description",
  errors: [
    {
      field: "email",
      message: "Invalid email format"
    }
  ]
}
HTTP Status Codes
Code	Usage
200	Successful GET/PUT/DELETE
201	Successful POST
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
500	Internal Server Error
Error Codes
ts
// AUTH Errors
AUTH_001: "Invalid email format"
AUTH_002: "Password too short"
AUTH_003: "User not found"
AUTH_004: "Invalid password"
AUTH_005: "Email already exists"

// MEMBERSHIP Errors
MEMBERSHIP_001: "Membership plan not found"
MEMBERSHIP_002: "Membership already active"
MEMBERSHIP_003: "AI limit exceeded"

// PAYMENT Errors
PAYMENT_001: "Payment failed"
PAYMENT_002: "Invalid amount"

// ATTENDANCE Errors
ATTENDANCE_001: "Invalid QR code"
ATTENDANCE_002: "QR code expired"
ATTENDANCE_003: "Membership not active"
🌍 ENVIRONMENT VARIABLES
Backend (.env)
bash
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gym_management

# JWT
JWT_SECRET=your-super-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AI
AI_PROVIDER=GEMINI
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# Payment (VNPay)
VNPAY_TMN_CODE=your-merchant-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_RETURN_URL=http://localhost:5000/api/payment/vnpay-callback

# Payment (MoMo)
MOMO_PARTNER_CODE=your-momo-partner-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
Frontend (.env.local)
bash
NEXT_PUBLIC_API_URL=http://localhost:5000
🚫 CRITICAL RULES SUMMARY
Code Structure
✅ Controller → Service → DB

✅ Business logic ONLY in Service

✅ No duplicate code

✅ No hardcode secrets

TypeScript
✅ No any type

✅ Define interfaces for all types

API Standards
✅ Standardized response format

✅ Error codes system

✅ Proper HTTP status codes

✅ Validation on all inputs

Database
✅ Use migrations

✅ Soft delete preferred

✅ Timestamps on all tables

Authentication
✅ JWT with access/refresh tokens

✅ Role-based access control (ADMIN, PT, MEMBER)

Payment
✅ NEVER activate membership before webhook confirmation

Security
✅ All secrets in .env

✅ Password hashing (bcrypt)

✅ QR code expiry (5 minutes)

🎯 FINAL CHECKLIST
Before committing code:

- [ ] Read ROADMAP.md & ARCHITECTURE.md
- [ ] Follow folder structure exactly
- [ ] No `any` types in TypeScript
- [ ] All secrets in .env
- [ ] Service → Controller flow
- [ ] Standardized API response
- [ ] Error handling with proper codes
- [ ] Swagger/API docs updated
- [ ] Unit tests written (if critical path)
- [ ] No duplicate code
- [ ] Run linter & formatter

---

**Last Updated:** May 28, 2026  
**Version:** 1.0
