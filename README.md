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

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Node.js + Express/NestJS | 18+ / Latest |
| Frontend | React / Next.js | 18+ |
| Mobile | React Native + Expo | 0.73+ |
| Database | PostgreSQL | 14+ |
| ORM | Prisma | 5+ |
| Auth | JWT | Standard |
| AI | OpenAI / Gemini | Latest API |
| Styling | TailwindCSS | 3+ |
| Language | TypeScript | 5+ |

---

## 📁 Project Structure

```
gym-management/
├── backend/                 # Node.js + Express/NestJS API
│   ├── src/
│   │   ├── controllers/     # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── routes/          # Route definitions
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   └── prisma/          # Database schema & migrations
│   └── README.md
├── frontend/                # React/Next.js admin dashboard
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── hooks/           # Custom hooks
│   └── README.md
├── mobile/                  # React Native mobile app
│   ├── src/
│   │   ├── screens/         # Screen components
│   │   ├── components/      # Shared components
│   │   ├── navigation/      # Navigation setup
│   │   └── services/        # API services
│   └── README.md
├── docs/                    # Documentation
│   ├── API.md               # API endpoints
│   ├── ARCHITECTURE.md      # Architecture design
│   ├── DATABASE.md          # Database schema
│   └── SECURITY.md          # Security guidelines
├── ROADMAP.md               # 10-phase development roadmap
├── CONTRIBUTING.md          # Contributing guidelines
└── README.md                # This file
```

---

## 🚀 Development Roadmap

Complete development organized into **10 phases**:

| Phase | Title | Duration | Status |
|-------|-------|----------|--------|
| 1 | Project Initialization | 2-3 days | 🔴 Planned |
| 2 | Database & Authentication | 4-5 days | 🔴 Planned |
| 3 | Membership System | 3-4 days | 🔴 Planned |
| 4 | AI Chatbot | 5-7 days | 🔴 Planned |
| 5 | Admin Dashboard | 5-6 days | 🔴 Planned |
| 6 | Mobile Application | 7-10 days | 🔴 Planned |
| 7 | Payment System | 3-4 days | 🔴 Planned |
| 8 | Notification System | 2-3 days | 🔴 Planned |
| 9 | Testing & Optimization | 4-5 days | 🔴 Planned |
| 10 | Deployment | 2-3 days | 🔴 Planned |

**Total Timeline:** 8-9 weeks | **With 2-person team:** 5-6 weeks  
**Details:** See [ROADMAP.md](./ROADMAP.md)

---

## 👥 Team Roles

### Backend Developer (Member 1)
- Database design & migrations
- API development & optimization
- Authentication system
- AI integration
- Payment processing
- Backend testing

### Frontend/Mobile Developer (Member 2)
- Admin dashboard
- Mobile app (React Native)
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
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/gym_management
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-...
VNPAY_CODE=your_code
SENTRY_DSN=your_dsn
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3000/api
```

**Mobile (.env)**
```env
API_BASE_URL=http://localhost:3000/api
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
- ✅ Input validation & sanitization
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
- **Mobile:** App Store / Google Play

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

---

## 📊 Project Status

```
Progress: ███████░░░░░░░░░░░░  30%
Status: 🔴 In Planning
Next: Phase 1 - Project Initialization
```

**Last Updated:** May 27, 2026  
**Repository:** [sleepingbuild/gym-management](https://github.com/sleepingbuild/gym-management)
