# 🏗️ GYM MANAGEMENT SYSTEM - ARCHITECTURE GUIDE

## 📌 Project Overview

Gym Management System là một nền tảng quản lý phòng gym bao gồm:

* Backend API Server
* Web Admin Dashboard
* Membership System (kèm PT booking + trainer working-hours scheduling)
* Face Check-in System (thay thế QR check-in ban đầu — xem CHANGELOG v1.0.0)
* Payment Gateway
* Notification System
* AI Fitness Chatbot (self-trained Qwen + RAG, thay thế Gemini)
* Body Progress Tracking

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
9. [Docker Support](#docker-support)
10. [Deployment](#deployment)
11. [Critical Rules Summary](#critical-rules-summary)

---

# ⚠️ GLOBAL DEVELOPMENT RULES

## 1. KHÔNG PHÁ VỠ KIẾN TRÚC HIỆN TẠI

Trước khi tạo:
* file mới
* folder mới
* service mới
* component mới

=> bắt buộc đọc structure hiện tại.

## 2. KHÔNG DUPLICATE CODE

* Không tạo service trùng chức năng.
* Không tạo helper/function trùng.
* Không copy business logic sang nhiều nơi.

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

## 4. KHÔNG HARDCODE

Tất cả:
* API KEY
* DATABASE URL
* JWT SECRET
* PAYMENT SECRET
* PORT

=> phải nằm trong `.env`

## 5. TYPESCRIPT STRICT MODE

* Không dùng `any`
* Luôn định nghĩa types/interfaces rõ ràng
* Ưu tiên DTO pattern

## 6. MỖI API PHẢI CÓ

* validation (Zod)
* try/catch
* error handling
* standardized response format
* proper HTTP status codes

---

# 📂 ROOT PROJECT STRUCTURE
gym-management/
│
├── backend/ # NodeJS + Express + TypeScript
├── frontend/ # NextJS + TailwindCSS
│
├── .github/workflows/ # CI/CD
├── docker-compose.yml # Docker Compose
├── docker-compose.prod.yml # Docker Compose Production
│
├── ROADMAP.md # Development timeline
├── ARCHITECTURE.md # This file
├── PROJECT_STATUS.md # Current progress tracking
├── README.md # Project overview
├── CHANGELOG.md # Version history
├── RELEASE_EVIDENCE.md # Release evidence
├── .gitignore
└── LICENSE

text

---

# 🖥️ BACKEND ARCHITECTURE

## ⚙️ Tech Stack

NodeJS (v20+)
ExpressJS
TypeScript
PostgreSQL + pgvector
Prisma ORM
JWT Authentication
Self-trained Qwen FastAPI service (RAG, replaces the original Gemini SDK integration)
VNPay / MoMo SDK
Redis (ioredis)
face-api.js (client-side face recognition)
Mailjet (email verification)

## 📂 BACKEND STRUCTURE
backend/
│
├── prisma/
│ ├── schema.prisma # Database schema definition
│ ├── migrations/ # DB migration history
│ ├── seed.ts # Initial data seeding
│ ├── seed-knowledge.ts # AI knowledge base seeding
│ └── knowledge-base.ts # Knowledge base data
│
├── src/
│ ├── config/ # Configuration files
│ │ ├── jwt.ts
│ │ ├── logger.ts
│ │ ├── prisma.ts
│ │ └── redis.ts
│ │
│ ├── constants/ # Constants & enums
│ │ ├── membership.ts
│ │ └── aiLimits.ts
│ │
│ ├── controllers/ # Request handlers
│ │ ├── auth.controller.ts
│ │ ├── user.controller.ts
│ │ ├── membership.controller.ts
│ │ ├── ai.controller.ts
│ │ ├── payment.controller.ts
│ │ ├── notification.controller.ts
│ │ ├── admin.controller.ts
│ │ └── bodyProgress.controller.ts
│ │
│ ├── services/ # Business logic
│ │ ├── auth.service.ts
│ │ ├── user.service.ts
│ │ ├── membership.service.ts
│ │ ├── ai.service.ts
│ │ ├── payment.service.ts
│ │ ├── notification.service.ts
│ │ └── bodyProgress.service.ts
│ │
│ ├── middlewares/ # Express middlewares
│ │ ├── auth.middleware.ts
│ │ ├── role.middleware.ts
│ │ ├── error.middleware.ts
│ │ ├── rateLimit.middleware.ts
│ │ └── cache.middleware.ts
│ │
│ ├── validators/ # Request validation schemas
│ │ ├── auth.validator.ts
│ │ ├── membership.validator.ts
│ │ ├── payment.validator.ts
│ │ └── bodyProgress.validator.ts
│ │
│ ├── types/ # TypeScript types & interfaces
│ │ ├── auth.types.ts
│ │ ├── user.types.ts
│ │ ├── membership.types.ts
│ │ ├── payment.types.ts
│ │ ├── ai.types.ts
│ │ └── bodyProgress.types.ts
│ │
│ ├── utils/ # Helper functions
│ │ ├── generateToken.ts
│ │ ├── hashPassword.ts
│ │ ├── errors.ts
│ │ └── logger.ts
│ │
│ ├── docs/ # API Documentation
│ │ └── swagger.ts
│ │
│ ├── routes/ # API routes
│ │ ├── auth.routes.ts
│ │ ├── user.routes.ts
│ │ ├── membership.routes.ts
│ │ ├── ai.routes.ts
│ │ ├── payment.routes.ts
│ │ ├── notification.routes.ts
│ │ ├── admin.routes.ts
│ │ ├── bodyProgress.routes.ts
│ │ └── index.ts
│ │
│ ├── server.ts # Express app setup
│ └── main.ts # Entry point
│
├── tests/
│ ├── setup.ts # Jest setup
│ ├── helpers/
│ │ └── testDb.ts
│ ├── unit/
│ │ ├── auth.test.ts
│ │ ├── membership.test.ts
│ │ ├── admin.test.ts
│ │ ├── bodyProgress.test.ts
│ │ └── security.test.ts
│ └── integration/
│ └── api.test.ts
│
├── Dockerfile
├── Dockerfile.dev
├── .dockerignore
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── jest.config.js
├── eslint.config.js
└── README.md

text

## 📂 FOLDER RESPONSIBILITIES

### config/
Chứa toàn bộ cấu hình ứng dụng. Không logic gì ở đây, chỉ là biến config.

```typescript
// config/jwt.ts
export const JWT_CONFIG = {
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  secret: process.env.JWT_SECRET || 'your-secret'
};

// config/redis.ts
import Redis from 'ioredis';
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});
controllers/
Chỉ xử lý request/response, gọi service duy nhất. Không query DB, không logic.

typescript
// ❌ Sai
async login(req, res) {
  const user = await db.user.findUnique(...);
  res.json(user);
}

// ✅ Đúng
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

typescript
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

cache.middleware.ts: Redis caching

validators/
Dùng Zod để định nghĩa schema validation.

typescript
// auth.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('AUTH_001: Invalid email format'),
  password: z.string().min(8, 'AUTH_002: Password too short')
});

export type LoginRequest = z.infer<typeof loginSchema>;
types/
Tất cả TypeScript interfaces đặt ở đây.

typescript
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

typescript
// utils/errors.ts
export class AppError extends Error {
  public statusCode: number;
  public errorCode?: string;
  
  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
🌐 FRONTEND ARCHITECTURE
⚙️ Tech Stack
NextJS 16+ (App Router)
TailwindCSS
shadcn/ui (custom)
Zustand
Axios
Recharts
TypeScript

🎨 Design System
Color	Hex	Usage
Cream Canvas	#faf9f5	Nền chính
Coral	#cc785c	Primary CTA, accent
Dark Navy	#181715	Sidebar, dark surfaces
Ink	#141413	Text chính
Body	#3d3d3a	Body text
Muted	#6c6a64	Muted text
Success	#5db872	Success states
Error	#c64545	Error states
📂 FRONTEND STRUCTURE
text
frontend/
│
├── public/
│   ├── images/
│   └── icons/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/
│   │   ├── admin/              # Admin only routes
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── memberships/
│   │   │       └── page.tsx
│   │   │
│   │   ├── member/             # Member only routes
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── ai-chat/
│   │   │   │   └── page.tsx
│   │   │   └── progress/
│   │   │       ├── page.tsx
│   │   │       └── components/
│   │   │           ├── ProgressStats.tsx
│   │   │           ├── ProgressChart.tsx
│   │   │           ├── ProgressForm.tsx
│   │   │           └── ProgressHistory.tsx
│   │   │
│   │   ├── pt/                 # PT only routes (planned)
│   │   │   └── page.tsx
│   │   │
│   │   └── layout.tsx
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── common/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
│
├── lib/
│   └── api.ts                  # Axios client with interceptors
│
├── store/
│   └── auth.store.ts           # Zustand auth store
│
├── services/
│   ├── bodyProgress.service.ts
│   └── auth.service.ts
│
├── types/
│   └── index.ts
│
├── Dockerfile
├── Dockerfile.dev
├── .dockerignore
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
📂 FRONTEND RULES
1. API calls phải qua service layer
typescript
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
PostgreSQL 16
pgvector extension
Prisma ORM

📊 DATABASE SCHEMA
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
  isActive  Boolean   @default(true)
  isDeleted Boolean   @default(false)
  
  userMembership    UserMembership?
  paymentHistory    Payment[]
  chatHistory       ChatHistory[]
  notifications     Notification[]
  bodyProgress      BodyProgress[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@index([email])
  @@index([role])
  @@index([isActive])
  @@index([createdAt])
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
  aiDailyLimit Int      // Daily AI usage limit
  description String?
  isActive    Boolean   @default(true)
  
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
  aiDailyCount    Int       @default(0)
  aiUsageReset    DateTime  @default(now())
  aiDailyReset    DateTime  @default(now())
  status          MembershipStatus @default(ACTIVE)
  
  user            User            @relation(fields: [userId], references: [id])
  plan            MembershipPlan  @relation(fields: [planId], references: [id])
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([expiryDate])
  @@index([userId, status])
}

enum MembershipStatus {
  ACTIVE
  EXPIRED
  SUSPENDED
}

// AI Chat
model ChatHistory {
  id        String    @id @default(cuid())
  userId    String
  sessionId String
  role      ChatRole  // "user" or "assistant"
  content   String    @db.Text
  tokens    Int?
  
  user      User      @relation(fields: [userId], references: [id])
  
  createdAt DateTime  @default(now())
  
  @@index([userId, sessionId])
  @@index([userId, createdAt])
  @@index([sessionId])
}

enum ChatRole {
  user
  assistant
}

// Knowledge Base (RAG)
model KnowledgeBase {
  id        String   @id @default(cuid())
  category  String   // "workout", "nutrition", "general"
  title     String
  content   String   @db.Text
  embedding Unsupported("vector(3072)")?
  
  createdAt DateTime @default(now())
  
  @@index([category])
  @@index([createdAt])
}

// Body Progress Tracking
model BodyProgress {
  id         String   @id @default(cuid())
  userId     String
  weight     Float    // kg
  height     Float?   // cm
  bodyFat    Float?   // percentage
  muscleMass Float?   // kg
  bmi        Float?   // auto-calculated
  notes      String?  @db.Text
  recordedAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([recordedAt])
  @@index([userId, recordedAt])
}

// Payment
model Payment {
  id               String        @id @default(cuid())
  userId           String
  membershipPlanId String
  amount           Float
  currency         String        @default("VND")
  status           PaymentStatus @default(PENDING)
  paymentMethod    PaymentMethod
  transactionId    String?       @unique
  description      String?
  metadata         Json?
  
  user User @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@index([userId, status])
  @@index([transactionId])
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

enum PaymentMethod {
  VNPAY
  MOMO
  CASH
}

// Notification
model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  isRead    Boolean          @default(false)
  metadata  Json?
  
  user User @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@index([userId, isRead])
}

enum NotificationType {
  MEMBERSHIP_ACTIVATED
  MEMBERSHIP_EXPIRING
  MEMBERSHIP_EXPIRED
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  SYSTEM
}
📊 DATABASE RULES
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
typescript
// Access Token
{
  userId: string,
  email: string,
  role: Role,
  exp: timestamp  // 15 minutes
}

// Refresh Token
{
  userId: string,
  exp: timestamp  // 7 days
}
Roles & Permissions
Role	Permissions
ADMIN	Quản lý toàn bộ hệ thống (users, PT, memberships, payments, settings)
PT	Xem học viên, quản lý lịch, tạo workout plan, theo dõi tiến độ
MEMBER	Đăng ký gói tập, đặt lịch với PT, chat AI, track progress, check-in
🤖 AI SYSTEM ARCHITECTURE
AI Provider
Ban đầu hệ thống hỗ trợ 2 provider chuyển đổi qua biến `AI_PROVIDER` (Gemini 2.0 Flash + gemini-embedding-001, hoặc self-trained Qwen). Kể từ v1.0.0, Gemini đã bị loại bỏ hoàn toàn — provider duy nhất là:
- **Qwen 2.5 1.5B** (LoRA fine-tuned), phục vụ qua FastAPI (`serve.py`), chạy local trên máy developer, expose ra ngoài qua ngrok tunnel tĩnh
- Embeddings: `paraphrase-multilingual-MiniLM-L12-v2` (384 chiều), sinh trong `serve.py`; cột `KnowledgeBase.embedding` đã migrate tay từ `vector(3072)` (Gemini) sang `vector(384)`

RAG + Streaming + Multi-session Pipeline
```
1. User gửi tin nhắn chat (POST /ai/chat hoặc /ai/chat/stream)
   ↓
2. Validate request
   ↓
3. Check membership limit (AI usage count < plan limit)
   ↓
4. Nếu hết lượt → trả về error
   ↓
5. Embed user query → Qwen embedding endpoint (/embed, 384 chiều)
   ↓
6. Cosine similarity search trên pgvector (embedding <=> $1::vector)
   ↓
7. Lấy top 3 relevant documents
   ↓
8. Scope-limiting: nếu similarity score thấp VÀ không khớp từ khoá gym
   → trả lời từ chối lịch sự (không tốn thêm lượt gọi model)
   ↓
9. Build prompt với context + user query
   ↓
10. Gọi Qwen FastAPI — /chat (non-stream) hoặc /chat/stream (SSE, proxy qua Express)
   ↓
11. Tạo/cập nhật ChatSession (chỉ tạo session thật khi tin nhắn đầu tiên được gửi)
   ↓
12. Lưu chat history (user message + AI response)
   ↓
13. Increment AI usage count
   ↓
14. Trả response (hoặc stream) về client
```

> Lưu ý vận hành: chatbot chỉ hoạt động khi máy developer đang bật `serve.py` + tunnel ngrok. Xem PROJECT_STATUS.md để biết kế hoạch chuyển sang GPU cloud.

AI Limits by Plan
Plan	Monthly Limit	Daily Limit
BASIC	10	1
PREMIUM	100	10
ELITE	Unlimited	Unlimited
💪 BODY PROGRESS TRACKING
API Endpoints
Method	Endpoint	Description
POST	/api/body-progress	Create new record (auto BMI)
GET	/api/body-progress	Get all records
GET	/api/body-progress/latest	Get latest record
GET	/api/body-progress/chart	Get chart data (last N days)
GET	/api/body-progress/stats	Get statistics summary
PUT	/api/body-progress/:id	Update record
DELETE	/api/body-progress/:id	Delete record
BMI Calculation
typescript
// Auto-calculated from weight and height
const bmi = weight / ((height / 100) ** 2);
// Rounded to 1 decimal place
return Math.round(bmi * 10) / 10;
Business Rules
Only active members can track progress

BMI auto-calculated when height and weight provided

Records sorted by recordedAt (newest first)

Stats include: total records, first/latest, progress, average

💳 PAYMENT ARCHITECTURE
Payment Providers
VNPay (Vietnam) — HMAC-SHA512
MoMo (Vietnam) — HMAC-SHA256

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

typescript
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
🐳 DOCKER SUPPORT
Services
Service	Port	Image	Status
Backend API	5000	Node.js 20	✅
Frontend	3000	Next.js 16	✅
PostgreSQL	5432	PostgreSQL 16	✅
Redis	6379	Redis 7	✅
Dockerfile (Backend)
dockerfile
FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npm", "start"]
Docker Compose Commands
bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose logs -f backend

# Stop all
docker-compose down
🚀 DEPLOYMENT
Production URLs
Service	Platform	URL
Frontend	Vercel/Render	https://gym-management-five-gules.vercel.app (verify current domain)
Backend	Render (migrated from Railway)	https://gym-management-dwvx.onrender.com
Database	Neon	PostgreSQL + pgvector (Singapore)
API Docs	Swagger	https://gym-management-dwvx.onrender.com/api/docs
CI/CD (GitHub Actions)
yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd backend && npm ci
      - run: cd backend && npx prisma generate
      - run: cd backend && npm run lint
      - run: cd backend && npx tsc --noEmit
      - run: cd backend && npm test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run build

  deploy:
    needs: [backend, frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
🔗 API STANDARDS
Response Format
typescript
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
  errorCode: "AUTH_001",
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
429	Too Many Requests
500	Internal Server Error
Error Codes
typescript
// AUTH Errors
AUTH_001: "Invalid email format"
AUTH_002: "Password too short"
AUTH_003: "User not found"
AUTH_004: "Invalid password"
AUTH_005: "Email already exists"
AUTH_006: "Invalid or expired token"
AUTH_007: "Refresh token required"
AUTH_008: "Too many login attempts"

// MEMBERSHIP Errors
MEMBERSHIP_001: "Plan ID is required"
MEMBERSHIP_002: "Plan not found or inactive"
MEMBERSHIP_003: "User already has an active membership"
MEMBERSHIP_004: "User not found"
MEMBERSHIP_005: "Active membership required"

// PROGRESS Errors
PROGRESS_001: "Progress record not found"
PROGRESS_002: "Invalid progress data"
PROGRESS_003: "Active membership required to track progress"

// PAYMENT Errors
PAYMENT_001: "Plan not found"
PAYMENT_002: "User already has active membership"
PAYMENT_003: "Plan ID is required"
PAYMENT_004: "Basic plan is free"

// RATE LIMIT Errors
RATE_001: "Too many requests, please slow down"
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
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AI (self-trained Qwen — Gemini removed in v1.0.0)
QWEN_API_URL=http://localhost:5000

# Email verification
MAILJET_API_KEY=your-mailjet-api-key
MAILJET_API_SECRET=your-mailjet-api-secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# Payment (VNPay)
VNPAY_TMN_CODE=your-merchant-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5000/api/payments/vnpay-return

# Payment (MoMo)
MOMO_PARTNER_CODE=your-momo-partner-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret-key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_RETURN_URL=http://localhost:5000/api/payments/momo-return
MOMO_IPN_URL=http://localhost:5000/api/payments/momo-webhook
Frontend (.env.local)
bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
⚠️ CRITICAL RULES SUMMARY
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

✅ Rate limiting

✅ CORS configuration

✅ HTTPS in production

🎯 FINAL CHECKLIST
Before committing code:

Read ROADMAP.md & ARCHITECTURE.md

Follow folder structure exactly

No any types in TypeScript

All secrets in .env

Service → Controller flow

Standardized API response

Error handling with proper codes

Swagger/API docs updated

Unit tests written (if critical path)

No duplicate code

Run linter & formatter

Last Updated: 02/08/2026
Version: 1.0.0

