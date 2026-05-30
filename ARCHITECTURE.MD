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

## 📋 Table of Contents

1. [Global Development Rules](#global-development-rules)
2. [Root Project Structure](#root-project-structure)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Mobile Architecture](#mobile-architecture)
6. [Database Architecture](#database-architecture)
7. [API Standards](#api-standards)
8. [System Flows](#system-flows)
9. [Environment Variables](#environment-variables)
10. [Critical Rules Summary](#critical-rules-summary)

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

* validation (Zod/Joi)
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
├── mobile/                     # React Native + Expo
│
├── ROADMAP.md                  # Development timeline
├── ARCHITECTURE.md             # This file
├── CURRENT_STATUS.md           # Current progress tracking
├── .gitignore
└── README.md
```

---

# 🖥️ BACKEND ARCHITECTURE

## ⚙️ Tech Stack

* NodeJS (v18+)
* ExpressJS
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* OpenAI / Gemini SDK
* VNPay / MoMo SDK

---

## 📂 BACKEND STRUCTURE

```text
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
│   ├── repositories/           # Database access layer (optional, if using Repository pattern)
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
│   │   ├── swagger.ts          # Swagger/OpenAPI config
│   │   └── endpoints/          # Endpoint documentation
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
├── .env.example                # Environment variables template
├── .env                        # Environment variables (gitignored)
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

---

## 📌 FOLDER RESPONSIBILITIES

### config/
Chứa toàn bộ cấu hình ứng dụng. Không logic gì ở đây, chỉ là biến config.

```ts
// config/jwt.ts
export const JWT_CONFIG = {
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  secret: process.env.JWT_SECRET || 'your-secret'
};
```

### controllers/
Chỉ xử lý request/response, gọi service duy nhất. Không query DB, không logic.

```ts
// Sai ❌
async login(req, res) {
  const user = await db.user.findUnique(...);  // DB query trong controller
  res.json(user);
}

// Đúng ✅
async login(req, res) {
  const result = await authService.login(req.body);
  res.json(result);
}
```

### services/
Toàn bộ business logic nằm đây. Service được phép:
- Query database qua Prisma
- Gọi AI API
- Gọi Payment API
- Xử lý business rules
- Gọi service khác

```ts
// auth.service.ts
async login(credentials: LoginDTO): Promise<LoginResponse> {
  const user = await prisma.user.findUnique(...);
  if (!user) throw new Error('User not found');
  
  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) throw new Error('Invalid password');
  
  const tokens = generateTokens(user);
  return tokens;
}
```

### middlewares/
- **auth.middleware.ts**: Verify JWT token
- **role.middleware.ts**: Check user role (ADMIN, STAFF, MEMBER, PT)
- **error.middleware.ts**: Centralized error handling
- **rateLimit.middleware.ts**: Rate limiting (anti-spam)
- **validation.middleware.ts**: Validate request schema

### validators/
Dùng **Zod** để định nghĩa schema validation.

```ts
// auth.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short')
});

export type LoginRequest = z.infer<typeof loginSchema>;
```

### types/
Tất cả TypeScript interfaces đặt ở đây, không đặt lẻ trong file khác.

```ts
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
  STAFF = 'STAFF',
  MEMBER = 'MEMBER',
  PT = 'PT'
}
```

### utils/
Helper functions không liên quan đến business logic.

```ts
// utils/errors.ts
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// utils/logger.ts
export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`)
};
```

### constants/
Các hằng số của hệ thống.

```ts
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
```

### docs/
Swagger/OpenAPI configuration để generate API documentation.

```ts
// docs/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Gym API', version: '1.0.0' },
    servers: [{ url: process.env.API_URL }]
  },
  apis: ['./src/routes/*.ts']
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

# 🌐 FRONTEND ARCHITECTURE

## ⚙️ Tech Stack

* NextJS 14+ (App Router)
* TailwindCSS
* shadcn/ui
* Axios
* TypeScript
* React Query / SWR (for data fetching)

---

## 📂 FRONTEND STRUCTURE

```text
frontend/
│
├── public/                     # Static assets
│   ├── images/
│   └── icons/
│
├── src/
│   ├── app/                    # NextJS App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/        # Protected routes
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── memberships/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── attendance/
│   │   │   │   └── page.tsx
│   │   │   ├── payments/
│   │   │   │   └── page.tsx
│   │   │   ├── pts/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── layout.tsx       # Dashboard layout with sidebar
│   │   │
│   │   ├── api/                 # API route handlers (if needed)
│   │   │   └── auth/
│   │   │
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   │
│   ├── components/              # Reusable components
│   │   ├── common/              # Common UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Form.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── auth/                # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   │
│   │   ├── membership/          # Membership components
│   │   │   ├── MembershipCard.tsx
│   │   │   ├── PlanSelector.tsx
│   │   │   └── MembershipTable.tsx
│   │   │
│   │   ├── attendance/          # Attendance components
│   │   │   ├── AttendanceChart.tsx
│   │   │   └── CheckinHistory.tsx
│   │   │
│   │   ├── payment/             # Payment components
│   │   │   ├── PaymentForm.tsx
│   │   │   └── TransactionTable.tsx
│   │   │
│   │   └── pt/                  # PT components
│   │       ├── PTCard.tsx
│   │       └── PTAssignment.tsx
│   │
│   ├── services/                # API service layer
│   │   ├── api.client.ts        # Axios instance
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── membership.service.ts
│   │   ├── attendance.service.ts
│   │   ├── payment.service.ts
│   │   └── pt.service.ts
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── usePagination.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── context/                 # React Context
│   │   ├── AuthContext.tsx
│   │   └── AppProvider.tsx
│   │
│   ├── types/                   # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── membership.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   ├── styles/                  # Global styles
│   │   └── globals.css
│   │
│   └── lib/                     # Library configurations
│       └── axios.config.ts
│
├── .env.example
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

---

## 📌 FRONTEND RULES

### 1. API calls phải qua service layer

```ts
// ❌ WRONG - Direct API call in component
export function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get('/api/users').then(res => setUsers(res.data));
  }, []);
}

// ✅ CORRECT - Use service layer
export function UserList() {
  const { data: users } = useFetch(() => userService.getUsers());
}
```

### 2. Reusable components
Tất cả UI components được dùng 2+ lần phải được tách ra thành reusable.

```ts
// ✅ CORRECT - Reusable Button
export function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

### 3. Type safety
Luôn sử dụng TypeScript types cho props và data.

```ts
// ✅ CORRECT
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return <div onClick={() => onEdit(user.id)}>{user.name}</div>;
}
```

### 4. Error handling
Tất cả API calls phải có error handling.

```ts
// ✅ CORRECT
try {
  const result = await userService.createUser(data);
  toast.success('User created');
} catch (error) {
  toast.error(error.message);
}
```

---

# 📱 MOBILE ARCHITECTURE

## ⚙️ Tech Stack

* React Native
* Expo
* TypeScript
* Expo SecureStore (JWT storage)
* React Navigation
* Axios

---

## 📂 MOBILE STRUCTURE

```text
mobile/
│
├── assets/                     # Images, fonts, icons
│   ├── images/
│   └── icons/
│
├── src/
│   ├── screens/                # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   │
│   │   ├── membership/
│   │   │   ├── MembershipScreen.tsx
│   │   │   ├── UpgradeScreen.tsx
│   │   │   └── HistoryScreen.tsx
│   │   │
│   │   ├── checkin/
│   │   │   ├── CheckinScreen.tsx      # Display user's QR code
│   │   │   ├── ScanQRScreen.tsx       # For staff to scan QR
│   │   │   └── AttendanceScreen.tsx
│   │   │
│   │   ├── ai/
│   │   │   ├── ChatScreen.tsx
│   │   │   └── FitnessCoachScreen.tsx
│   │   │
│   │   ├── progress/
│   │   │   ├── ProgressScreen.tsx     # BMI, weight, body fat tracking
│   │   │   └── ChartScreen.tsx
│   │   │
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   │
│   ├── navigation/              # React Navigation setup
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── RootNavigator.tsx
│   │
│   ├── components/              # Reusable components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── membership/
│   │   │   └── MembershipCard.tsx
│   │   │
│   │   ├── ai/
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   │
│   │   └── progress/
│   │       ├── ProgressChart.tsx
│   │       └── BodyMetricInput.tsx
│   │
│   ├── services/                # API service layer
│   │   ├── api.client.ts        # Axios instance with interceptors
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── membership.service.ts
│   │   ├── attendance.service.ts
│   │   ├── ai.service.ts
│   │   └── payment.service.ts
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts           # Auth state management
│   │   ├── useFetch.ts          # Data fetching
│   │   ├── useLocalStorage.ts   # Local data storage
│   │   └── useNotification.ts
│   │
│   ├── context/                 # Context API
│   │   ├── AuthContext.tsx
│   │   ├── NotificationContext.tsx
│   │   └── AppProvider.tsx
│   │
│   ├── types/                   # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── membership.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── storage.ts           # SecureStore wrapper
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   ├── qrGenerator.ts       # QR code generation
│   │   └── validation.ts
│   │
│   ├── styles/                  # Style constants
│   │   ├── theme.ts
│   │   ├── colors.ts
│   │   └── spacing.ts
│   │
│   ├── App.tsx                  # Root component
│   └── app.json                 # Expo config
│
├── .env.example
├── .env.local
├── app.json
├── eas.json                     # Expo EAS build config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📌 MOBILE RULES

### 1. Không lưu JWT trong AsyncStorage

```ts
// ❌ WRONG - AsyncStorage is not secure
AsyncStorage.setItem('token', token);

// ✅ CORRECT - Use SecureStore
import * as SecureStore from 'expo-secure-store';
SecureStore.setItemAsync('token', token);
```

### 2. Không hardcode API URL

```ts
// .env.local
EXPO_PUBLIC_API_URL=http://localhost:3000

// ✅ CORRECT
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

### 3. Offline support
Implement local caching khi offline.

```ts
// ✅ CORRECT - Cache responses
const cacheData = async (key: string, data: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};
```

---

# 🗄️ DATABASE ARCHITECTURE

## ⚙️ Tech Stack
* PostgreSQL
* Prisma ORM

---

## 📌 DATABASE SCHEMA OVERVIEW

```prisma
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
  ptAssignments     PTAssignment[]  // PT học viên hoặc học viên của PT
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  isDeleted Boolean   @default(false)
}

enum Role {
  ADMIN
  STAFF
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
  aiUsageReset    DateTime  @default(now())  // Reset monthly
  status          String    @default("ACTIVE")  // ACTIVE, EXPIRED, SUSPENDED
  
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan            MembershipPlan @relation(fields: [planId], references: [id])
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// Check-in / Attendance
model Attendance {
  id          String    @id @default(cuid())
  userId      String
  checkInTime DateTime
  checkOutTime DateTime?
  qrCode      String    @unique  // QR code generated for user
  qrExpiry    DateTime   // QR expires after 5 minutes
  
  user        User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// AI Chat
model ChatHistory {
  id        String    @id @default(cuid())
  userId    String
  role      String    // "user" or "assistant"
  content   String    @db.Text
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime  @default(now())
}

// Payment
model Payment {
  id              String    @id @default(cuid())
  userId          String
  membershipPlanId String
  amount          Float
  status          PaymentStatus  @default(PENDING)  // PENDING, SUCCESS, FAILED
  paymentMethod   String    // "VNPAY", "MOMO"
  transactionId   String?   @unique  // Payment gateway transaction ID
  description     String?
  
  user            User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

// Personal Trainer (PT)
model PTProfile {
  id            String    @id @default(cuid())
  userId        String    @unique
  specialization String  // e.g., "Strength Training", "Weight Loss"
  bio           String?
  experience    Int       // years
  rate          Float     // per session
  availability  Json      // { "Monday": ["09:00-12:00", "14:00-18:00"], ... }
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
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
  
  pt          User      @relation("PTAssignments", fields: [ptId], references: [id], onDelete: Cascade)
  student     User      @relation("StudentAssignments", fields: [studentId], references: [id], onDelete: Cascade)
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model PTSchedule {
  id        String    @id @default(cuid())
  ptId      String
  date      DateTime
  startTime String    // "09:00"
  endTime   String    // "12:00"
  isBooked  Boolean   @default(false)
  
  pt        PTProfile @relation(fields: [ptId], references: [id], onDelete: Cascade)
  
  createdAt DateTime  @default(now())
}

// Body Progress Tracking (Mobile)
model BodyProgress {
  id        String    @id @default(cuid())
  userId    String
  weight    Float     // kg
  bodyFat   Float     // percentage
  bmi       Float
  notes     String?
  
  user      User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  
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
```

---

## 📌 DATABASE RULES

### 1. Migrations
Mọi thay đổi DB phải qua migrations, không sửa trực tiếp.

```bash
npx prisma migrate dev --name add_new_field
```

### 2. Soft Delete
Ưu tiên soft delete thay vì hard delete.

```prisma
model User {
  isDeleted Boolean @default(false)
  // Query: where: { isDeleted: false }
}
```

### 3. Naming Convention
- **Table/Model:** PascalCase (`User`, `MembershipPlan`)
- **Column/Field:** camelCase (`createdAt`, `userMembership`)
- **Enum:** UPPERCASE (`ACTIVE`, `PENDING`)

### 4. Timestamps
Tất cả table phải có `createdAt` và `updatedAt`.

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

### 5. Relations
Luôn define cả chiều của relation.

```prisma
model User {
  memberships UserMembership[]
}

model UserMembership {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

# 🔐 AUTHENTICATION ARCHITECTURE

## Authentication Flow

```
1. Client gửi credentials (email + password)
   ↓
2. Server verify (bcrypt password)
   ↓
3. Generate JWT tokens (Access + Refresh)
   ↓
4. Client lưu tokens (SecureStore - mobile, Memory/Cookie - web)
   ↓
5. Client gửi Access Token trong mỗi request header: "Authorization: Bearer {token}"
   ↓
6. Server verify token → attach user info vào request
   ↓
7. Route handler xử lý logic
```

## JWT Structure

```
Access Token:
- Expires: 15 minutes
- Contains: userId, email, role

Refresh Token:
- Expires: 7 days
- Contains: userId (dùng để lấy access token mới khi hết hạn)
```

## Roles & Permissions

| Role   | Permissions |
|--------|------------|
| ADMIN  | Quản lý toàn bộ hệ thống (users, payments, settings) |
| STAFF  | Quản lý membership, check-in, PT assignment |
| MEMBER | Sử dụng app, xem membership, chat AI, track progress |
| PT     | Xem học viên, quản lý lịch, tạo workout plan |

---

# 🤖 AI SYSTEM ARCHITECTURE

## AI Provider
Giai đoạn đầu: **CHỌN 1 PROVIDER DUY NHẤT**
- **Gemini API** (recommended - free tier tốt)
- hoặc
- **OpenAI API**

## AI Flow

```
1. User gửi tin nhắn chat
   ↓
2. Validate request (user ID, message content)
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
```

## AI Limits by Plan

| Plan    | Monthly Limit | Reset | Notes |
|---------|---------------|-------|-------|
| BASIC   | 10            | 1st of month | 1 message per day max |
| PREMIUM | 100           | 1st of month | 10 messages per day max |
| ELITE   | Unlimited     | N/A   | No limit |

---

# 💳 PAYMENT ARCHITECTURE

## Payment Providers
- **VNPay** (Vietnam)
- **MoMo** (Vietnam)

## Payment Flow

```
1. User click "Upgrade Plan"
   ↓
2. Create Payment record in DB (status = PENDING)
   ↓
3. Redirect to VNPay/MoMo payment page
   ↓
4. User completes payment
   ↓
5. Payment gateway sends Webhook/IPN callback
   ↓
6. Server receives callback → verify signature
   ↓
7. Update Payment status (SUCCESS or FAILED)
   ↓
8. If SUCCESS:
     - Update UserMembership (new expiry date)
     - Send notification
     - Redirect to success page
   ↓
9. If FAILED:
     - Send error notification
     - Redirect to retry page
```

## Payment Status Flow

```
PENDING → SUCCESS → (Membership activated)
       → FAILED  → (Stay on current plan)
```

---

## 📌 PAYMENT RULES

### ⚠️ CRITICAL
**KHÔNG activate membership trước khi nhận webhook xác nhận từ payment gateway.**

```ts
// ❌ WRONG
async buyMembership(userId, planId) {
  // Activate immediately
  await userMembershipService.upgrade(userId, planId);
  // Then create payment
  const payment = await paymentService.create(...);
}

// ✅ CORRECT
async buyMembership(userId, planId) {
  // Only create PENDING payment
  const payment = await paymentService.create(userId, planId, { status: 'PENDING' });
  // Redirect to payment page
  return payment;
}

// In webhook handler:
async handlePaymentCallback(webhookData) {
  const payment = await paymentService.findByTransactionId(webhookData.transactionId);
  
  if (webhookData.resultCode === 0) { // Success from VNPay
    payment.status = 'SUCCESS';
    await userMembershipService.upgrade(payment.userId, payment.membershipPlanId);
  } else {
    payment.status = 'FAILED';
  }
  
  await payment.save();
}
```

---

# 🔔 NOTIFICATION SYSTEM

## Notification Types

| Type | Trigger | Message |
|------|---------|---------|
| MEMBERSHIP_EXPIRY | 7 days before expiry | "Your membership expires in 7 days" |
| PAYMENT_SUCCESS | Payment completed | "Payment successful, membership upgraded" |
| CHECKIN_SUCCESS | After check-in | "Welcome! You checked in at {time}" |
| AI_LIMIT_WARNING | 80% usage reached | "You've used 80% of your monthly AI limit" |

## Notification Flow

```
1. Event triggered (e.g., payment success)
   ↓
2. Create Notification record in DB
   ↓
3. Send push notification (FCM / Expo Push)
   ↓
4. If offline: store in queue, resend when online
   ↓
5. User receives notification
```

---

# 🔐 QR CHECK-IN SYSTEM

## QR Generation & Validation Flow

```
CLIENT (Mobile App):
1. User opens "Check-in" screen
2. Request GET /api/attendance/qr (generates new QR)
3. Server creates Attendance record with:
   - qrCode (unique random string)
   - qrExpiry (now + 5 minutes)
4. Server returns QR code as image
5. Mobile displays QR code
   ↓
STAFF (Mobile/Web):
1. Staff opens "Scan QR" screen
2. Scan member's QR code
3. Send POST /api/attendance/checkin with qrCode
4. Server verifies:
   - QR exists?
   - QR not expired (< 5 min)?
   - User membership valid?
5. If valid: update checkInTime, return success
6. If invalid: return error
```

## QR Code Format
```
gym_checkin_{attendanceId}_{timestamp}_{signature}
```

## Security Rules
- **Expiry:** 5 minutes (anti-replay)
- **One-time use:** Delete after first successful check-in
- **Signature:** HMAC-SHA256 to prevent tampering

---

# 🔗 API STANDARDS

## Response Format

Tất cả responses phải theo format này:

```ts
// Success Response (200, 201)
{
  success: true,
  statusCode: 200,
  message: "Operation successful",
  data: { /* actual data */ }
}

// Error Response (4xx, 5xx)
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
```

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200  | Successful GET/PUT/DELETE |
| 201  | Successful POST (created) |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (no permission) |
| 404  | Not Found |
| 409  | Conflict (e.g., duplicate email) |
| 500  | Internal Server Error |

## Error Code System

Mỗi error phải có error code duy nhất:

```ts
// AUTH Errors
AUTH_001: "Invalid email format"
AUTH_002: "Password too short"
AUTH_003: "User not found"
AUTH_004: "Invalid password"
AUTH_005: "Email already exists"
AUTH_006: "Invalid token"
AUTH_007: "Token expired"

// MEMBERSHIP Errors
MEMBERSHIP_001: "Membership plan not found"
MEMBERSHIP_002: "Membership already active"
MEMBERSHIP_003: "AI limit exceeded"

// PAYMENT Errors
PAYMENT_001: "Payment failed"
PAYMENT_002: "Invalid amount"
PAYMENT_003: "Duplicate transaction"

// ATTENDANCE Errors
ATTENDANCE_001: "Invalid QR code"
ATTENDANCE_002: "QR code expired"
ATTENDANCE_003: "Membership not active"
ATTENDANCE_004: "Already checked in today"
```

## Request/Response Examples

### Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "email": "...", "role": "MEMBER" },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### Get Membership Plans
```
GET /api/memberships/plans
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Plans retrieved",
  "data": [
    {
      "id": "plan_1",
      "name": "Basic",
      "price": 199000,
      "duration": 30,
      "aiLimit": 10
    },
    ...
  ]
}
```

### Buy Membership
```
POST /api/memberships/buy
Authorization: Bearer {accessToken}
Body: {
  "membershipPlanId": "plan_2"
}

Response 201:
{
  "success": true,
  "statusCode": 201,
  "message": "Payment initiated",
  "data": {
    "paymentId": "payment_1",
    "amount": 399000,
    "paymentUrl": "https://vnpay.vn/pay?...",
    "status": "PENDING"
  }
}
```

---

# 🌍 ENVIRONMENT VARIABLES

## Backend (.env)

```bash
# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gym_management

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AI (Gemini or OpenAI)
AI_PROVIDER=GEMINI  # or OPENAI
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# Payment (VNPay)
VNPAY_TMN_CODE=your-merchant-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_RETURN_URL=http://localhost:3000/api/payment/vnpay-callback

# Payment (MoMo)
MOMO_PARTNER_CODE=your-momo-partner-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret-key

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Firebase / FCM (for push notifications)
FCM_SERVER_KEY=your-fcm-server-key
```

## Frontend (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Mobile (.env.local)

```bash
# API
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

# 🚫 CRITICAL RULES SUMMARY

## Code Structure
- ✅ Controller → Service → DB (strict separation)
- ✅ Business logic ONLY in Service
- ✅ No duplicate code
- ✅ No hardcode secrets

## TypeScript
- ✅ No `any` type
- ✅ Define interfaces for all types
- ✅ Use DTO pattern

## API Standards
- ✅ Standardized response format
- ✅ Error codes system
- ✅ Proper HTTP status codes
- ✅ Validation on all inputs

## Database
- ✅ Use migrations (never direct SQL)
- ✅ Soft delete preferred
- ✅ Timestamps on all tables
- ✅ Clear naming convention

## Authentication
- ✅ JWT with separate access/refresh tokens
- ✅ Secure token storage (SecureStore - mobile)
- ✅ Role-based access control

## Payment
- ✅ NEVER activate membership before webhook confirmation
- ✅ Handle all 3 states: PENDING, SUCCESS, FAILED
- ✅ Signature verification on webhooks

## Security
- ✅ All secrets in .env
- ✅ Password hashing (bcrypt)
- ✅ QR code expiry (5 minutes)
- ✅ Rate limiting on sensitive endpoints

---

## 🎯 FINAL CHECKLIST

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
