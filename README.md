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
```

---

## ✨ Features

### User Features
- ✅ User authentication (JWT)
- ✅ Membership packages (Basic, Premium, Elite)
- ✅ AI fitness coach with personalized recommendations
- ✅ Workout planning and progress tracking
- ✅ Secure online payments (VNPay, MoMo)

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

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Node.js + Express | 18+ |
| Frontend | React / Next.js | 18+ |
| Database | PostgreSQL | 14+ |
| ORM | Prisma | 6+ |
| Auth | JWT | Standard |
| AI | OpenAI / Gemini | Latest API |
| Styling | TailwindCSS | 3+ |
| Language | TypeScript | 5+ |

---

## 📁 Project Structure

```
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
├── frontend/                # React/Next.js admin dashboard
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── hooks/           # Custom hooks
│   └── README.md
├── docs/                    # Documentation
│   ├── API.md               # API endpoints
│   ├── ARCHITECTURE.md      # Architecture design
│   ├── DATABASE.md          # Database schema
│   └── SECURITY.md          # Security guidelines
├── ROADMAP.md               # Development roadmap
├── CONTRIBUTING.md          # Contributing guidelines
└── README.md                # This file
```

---

## 🚀 Development Roadmap

Toàn bộ quá trình phát triển được tổ chức thành **6 Phases với 26 Issues**:

| Phase | Milestone Title | Linked Issues | Duration | Status |
|-------|-----------------|---------------|----------|--------|
| 1 | Project Initialization | #1 - #3 | 2-3 days | ✅ Completed |
| 2 | Authentication & Database | #4 - #8 | 4-5 days | 🔄 In Progress |
| 3 | Membership & AI Core | #9 - #13 | 3-4 days | ⏳ Pending |
| 4 | Frontend Admin Dashboard | #14 - #17 | 5-6 days | ⏳ Pending |
| 5 | Payment & Notification System | #18 - #20 | 4-5 days | ⏳ Pending |
| 6 | Testing & Deployment | #21 - #26 | 4-5 days | ⏳ Pending |

**Chi tiết kỹ thuật từng task:** Xem tại [ROADMAP.md](./ROADMAP.md)

---

## 👥 Team Roles

### Backend Developer (Member 1)
- Database design & migrations
- API development & optimization
- Authentication system
- AI integration
- Payment processing
- Backend testing

### Frontend Developer (Member 2)
- Admin dashboard (React/Next.js)
- UI/UX implementation
- Component development
- Frontend testing

### Shared Tasks
- Code reviews
- Testing & QA
- Deployment
- Documentation

---

## 📚 API Overview

### Authentication
```
POST   /api/auth/register              - Register user
POST   /api/auth/login                 - Login user
POST   /api/auth/refresh               - Refresh token
POST   /api/auth/forgot-password       - Request password reset
POST   /api/auth/reset-password        - Reset password
```

### Membership
```
GET    /api/packages                   - Get all packages
POST   /api/packages/buy               - Purchase package
POST   /api/packages/upgrade           - Upgrade package
GET    /api/packages/current           - Get current membership
```

### AI Chat
```
POST   /api/ai/chat                    - Send message to AI
GET    /api/ai/history                 - Get chat history
```

### Payment
```
POST   /api/payments/create            - Create payment
POST   /api/payments/callback          - Payment callback
GET    /api/payments/history           - Payment history
```

### Admin
```
GET    /api/admin/users                - List users
GET    /api/admin/stats                - System statistics
GET    /api/admin/analytics            - Analytics data
```

**Full API docs:** [docs/API.md](./docs/API.md)

---

## 🔧 Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/gym_management
JWT_SECRET=your_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
OPENAI_API_KEY=sk-...
VNPAY_CODE=your_code
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 💳 Membership Plans

| Plan | Price | Duration | AI Messages | Features |
|------|-------|----------|------------|----------|
| **Basic** | Free | 30 days | 10/day | Core features |
| **Premium** | $9.99/mo | 30 days | 100/day | Advanced features |
| **Elite** | $29.99/mo | 30 days | Unlimited | All features |

---

## 🔒 Security

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation & sanitization (Zod)
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ HTTPS in production
- ✅ Environment variables for secrets

**Security guide:** [docs/SECURITY.md](./docs/SECURITY.md)

---

## 🤖 AI Features

### Supported Providers
- OpenAI GPT-4 (Recommended)
- Google Gemini (Alternative)

### Capabilities
- Personalized workout recommendations
- Muscle gain (bulking) guidance
- Weight loss (cutting) programs
- Nutrition and diet planning
- Exercise form explanation
- Fitness Q&A support

---

## 📦 Deployment

### Hosting Platforms
- **Backend:** Railway / Render / VPS
- **Frontend:** Vercel
- **Database:** PostgreSQL Cloud

**Deployment guide:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m '[type] description'`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request

**Guidelines:** [CONTRIBUTING.md](./CONTRIBUTING.md)

### Commit Format
```
[feat] Add new feature
[fix] Fix bug
[docs] Update documentation
[test] Add tests
[style] Format code
```

---

## 🚨 Important Rules

### Before Coding
- ✅ Read project structure & architecture
- ✅ Review database schema
- ✅ Check existing implementations
- ✅ Follow established patterns

### Code Standards
- ✅ Use TypeScript (no `any` types)
- ✅ Follow ESLint + Prettier
- ✅ Write meaningful comments
- ✅ Handle all error cases
- ✅ Validate all inputs

### Avoid
- ❌ Hardcoding URLs/credentials
- ❌ Duplicate code/components
- ❌ Business logic in frontend
- ❌ Unvalidated user input
- ❌ Committing .env files

---

## 📞 Support

- 📖 [Documentation](./docs)
- 🔍 [Issues](https://github.com/sleepingbuild/gym-management/issues)
- 💬 [Discussions](https://github.com/sleepingbuild/gym-management/discussions)
- 📋 [Project Board](https://github.com/sleepingbuild/gym-management/projects)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file
