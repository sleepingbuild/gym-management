# 🏋️ Gym Management System

A comprehensive fitness gym management platform with AI coaching, membership management, and real-time analytics.

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%3E%3D18.0.0-blue.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/sleepingbuild/gym-management.git
cd gym-management

# Backend setup
cd backend && cp .env.example .env
npm install
npx prisma migrate dev
npm run dev

# Frontend setup (new terminal)
cd frontend && cp .env.example .env
npm install
npm start

# Mobile setup (new terminal)
cd mobile && cp .env.example .env
npm install
npx expo start
```

---

## ✨ Features

### User Features
- ✅ User authentication (JWT)
- ✅ Membership packages (Basic, Premium, Elite)
- ✅ AI fitness coach with personalized recommendations
- ✅ Workout planning and progress tracking
- ✅ Secure online payments (VNPay, MoMo, Stripe)
- ✅ Push notifications
- ✅ Mobile app (React Native)

### Admin Features
- ✅ User management dashboard
- ✅ Revenue analytics
- ✅ Membership control
- ✅ AI usage analytics
- ✅ System monitoring

### AI Capabilities
- 🎯 Workout recommendations
- 💪 Muscle gain guidance
- 🔥 Weight loss plans
- 🥗 Nutrition advice
- 📚 Exercise form explanation

📊 Calorie calculation

🛠️ Tech Stack
Component	Technology	Version
Backend	Node.js + Express	18+
Frontend	Next.js + TailwindCSS	14+
Database	PostgreSQL	14+
ORM	Prisma	6+
Auth	JWT	Standard
AI	Gemini / Claude API	Latest
Payment	VNPay, MoMo	-
Styling	TailwindCSS + shadcn/ui	3+
Language	TypeScript	5+
📁 Project Structure
text
gym-management/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/          # JWT, logger, prisma config
│   │   ├── controllers/     # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── routes/          # Route definitions
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Helpers, token utils
│   │   └── validators/      # Zod schemas
│   ├── prisma/              # Database schema & migrations
│   └── README.md
├── frontend/                # Next.js admin dashboard
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   └── hooks/           # Custom hooks
│   └── README.md
├── ROADMAP.md               # Development roadmap
├── ARCHITECTURE.md          # Architecture design
├── PROJECT_STATUS.md        # Current progress
└── README.md                # This file
👥 User Roles
Role	Permissions
Admin	Full system access: manage users, PTs, memberships, payments, settings
PT	View assigned students, manage schedules, track progress
Member	Register memberships, book PT sessions, AI chat, track progress, QR check-in
🚀 Development Roadmap
Phase	Milestone	Status
1	Project Initialization	✅ Completed
2	Authentication & Database	🔄 In Progress
3	Membership & AI Core	⏳ Pending
4	Frontend Admin Dashboard	⏳ Pending
5	Payment & Notification	⏳ Pending
6	Testing & Deployment	⏳ Pending
Chi tiết: Xem ROADMAP.md

📚 API Overview
Authentication
text
POST   /api/auth/register       - Register user
POST   /api/auth/login          - Login user
POST   /api/auth/refresh        - Refresh token
POST   /api/auth/logout         - Logout
Membership
text
GET    /api/memberships/plans   - Get all packages
POST   /api/memberships/buy     - Purchase/Upgrade package
GET    /api/memberships/current - Get current membership
PT Management
text
GET    /api/pts                 - Get all PTs
GET    /api/pts/:id             - Get PT details
POST   /api/pts/assign          - Assign PT to member (Admin)
GET    /api/pts/my-students     - Get PT's students
Schedule
text
GET    /api/schedules           - Get schedules
POST   /api/schedules           - Create schedule
DELETE /api/schedules/:id       - Cancel schedule
AI Chat
text
POST   /api/ai/chat             - Send message to AI
GET    /api/ai/history          - Get chat history
GET    /api/ai/usage            - Get AI usage count
Payment
text
POST   /api/payments/create     - Create payment
GET    /api/payments/history    - Payment history
POST   /api/payments/webhook    - Payment callback
Attendance (QR Check-in)
text
GET    /api/attendance/qr       - Generate QR code
POST   /api/attendance/checkin  - Check-in
GET    /api/attendance/history  - Check-in history
Progress Tracking
text
GET    /api/progress            - Get progress data
POST   /api/progress            - Update progress
GET    /api/progress/chart      - Get progress chart
Admin
text
GET    /api/admin/stats         - System statistics
GET    /api/admin/revenue       - Revenue analytics
GET    /api/admin/ai-usage      - AI usage analytics
🔧 Environment Variables
Backend (.env)

env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/gym_management
JWT_SECRET=your_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
GEMINI_API_KEY=your_gemini_key
VNPAY_CODE=your_code
Frontend (.env.local)

env
NEXT_PUBLIC_API_URL=http://localhost:5000
💳 Membership Plans
Plan	Price	Duration	AI Messages	Daily Limit
Basic	Free	30 days	10/month	1/day
Premium	$9.99/mo	30 days	100/month	10/day
Elite	$29.99/mo	30 days	Unlimited	Unlimited
🔒 Security
✅ JWT token authentication

✅ Password hashing with bcrypt

✅ Input validation & sanitization (Zod)

✅ CORS configuration

✅ Rate limiting

✅ HTTPS in production

✅ Environment variables for secrets

✅ Role-based access control (Admin, PT, Member)

🤖 AI Features
Supported Provider
Gemini API (Google) - Recommended (free tier available)

Alternative: Claude API (Anthropic)

Capabilities
Personalized workout recommendations

Muscle gain (bulking) guidance

Weight loss (cutting) programs

Nutrition and diet planning

Exercise form explanation

Calorie calculation

Fitness Q&A support

📦 Deployment
Hosting Platforms
Backend: Railway / Render / VPS

Frontend: Vercel

Database: PostgreSQL Cloud (Supabase/Railway)

🤝 Contributing
Create feature branch: git checkout -b feature/your-feature

Commit changes: git commit -m '[type] description'

Push branch: git push origin feature/your-feature

Create Pull Request

Commit Format
text
[feat] Add new feature
[fix] Fix bug
[docs] Update documentation
[test] Add tests
[style] Format code
🚨 Important Rules
Before Coding
✅ Read project structure & architecture

✅ Review database schema

✅ Check existing implementations

✅ Follow established patterns

Code Standards
✅ Use TypeScript (no any types)

✅ Follow ESLint + Prettier

✅ Write meaningful comments

✅ Handle all error cases

✅ Validate all inputs

Avoid
❌ Hardcoding URLs/credentials

❌ Duplicate code/components

❌ Business logic in frontend

❌ Unvalidated user input

❌ Committing .env files

---

## 📞 Support

- 📖 [Documentation](./docs)
- 🔍 [Issues](https://github.com/sleepingbuild/gym-management/issues)
- 💬 [Discussions](https://github.com/sleepingbuild/gym-management/discussions)
- 📋 [Project Board](https://github.com/sleepingbuild/gym-management/projects)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

---


