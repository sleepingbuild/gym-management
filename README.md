# 🏋️ Gym Management System Platform
Early-stage full-stack gym management platform focused on membership operations, trainer coordination, AI-assisted fitness workflows, and scalable service architecture.

A comprehensive gym management platform featuring membership management, personal trainer scheduling, AI-powered fitness coaching, online payments, and real-time analytics.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6)
![License](https://img.shields.io/badge/License-MIT-blue)

---

# ✨ Features

## 👤 Member Features

* JWT Authentication
* Membership registration and renewal
* Personal Trainer booking
* AI Fitness Coach
* Progress tracking
* QR Check-in
* Online payments (VNPay, MoMo)

## 🧑‍💼 Admin Features

* User management
* Personal Trainer management
* Membership management
* Revenue analytics
* AI usage analytics
* System monitoring dashboard

## 🤖 AI Features

* Workout recommendations
* Muscle gain guidance
* Weight loss planning
* Nutrition suggestions
* Exercise explanations
* Calorie calculation
* Fitness Q&A

---

# 🛠️ Tech Stack

| Component      | Technology              |
| -------------- | ----------------------- |
| Backend        | Node.js + Express       |
| Frontend       | Next.js                 |
| Database       | PostgreSQL              |
| ORM            | Prisma                  |
| Authentication | JWT                     |
| AI Integration | Gemini API / Claude API |
| Payment        | VNPay, MoMo             |
| Styling        | TailwindCSS + shadcn/ui |
| Language       | TypeScript              |

---

# 🏗️ Architecture Overview

The system follows a modular full-stack architecture:

* Frontend: Next.js application layer
* Backend: Express.js REST API services
* Database: PostgreSQL + Prisma ORM
* AI Layer: Gemini API integration
* Authentication: JWT-based security model

For detailed architecture documentation, see:

* `ARCHITECTURE.md`

---

# 📁 Project Structure

```text
gym-management/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── prisma/
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   │
│   └── README.md
│
├── ARCHITECTURE.md
├── ROADMAP.md
├── PROJECT_STATUS.md
└── README.md
```

---

# 👥 User Roles

| Role   | Permissions                                         |
| ------ | --------------------------------------------------- |
| Admin  | Full system management                              |
| PT     | Manage assigned students and schedules              |
| Member | Memberships, PT booking, AI chat, progress tracking |

---

# 🚀 Quick Start

## Prerequisites

* Node.js 18+
* PostgreSQL 14+
* npm

## Backend Setup

```bash
git clone https://github.com/sleepingbuild/gym-management.git

cd gym-management/backend

cp .env.example .env

npm install

npx prisma migrate dev

npm run dev
```

## Frontend Setup

```bash
cd frontend

cp .env.example .env.local

npm install

npm run dev
```

---

# 📚 Main API Modules

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

## Membership

```http
GET  /api/memberships/plans
POST /api/memberships/buy
GET  /api/memberships/current
```

## PT Management

```http
GET  /api/pts
GET  /api/pts/:id
POST /api/pts/assign
GET  /api/pts/my-students
```

## AI Chat

```http
POST /api/ai/chat
GET  /api/ai/history
GET  /api/ai/usage
```

## Payment

```http
POST /api/payments/create
GET  /api/payments/history
POST /api/payments/webhook
```

---

# 🔒 Security

* JWT Authentication
* Password Hashing (bcrypt)
* Role-Based Access Control (RBAC)
* Input Validation (Zod)
* Rate Limiting
* Secure Environment Variables
* HTTPS Ready

---

# 📦 Deployment

| Service  | Platform               |
| -------- | ---------------------- |
| Frontend | Vercel                 |
| Backend  | Railway / Render / VPS |
| Database | PostgreSQL Cloud       |

---
# 🐳 Docker Support

## Backend Container

Build Docker image:

```bash
cd backend
docker build -t gym-management-backend .
```

Run container:

```bash
docker run -p 5000:5000 gym-management-backend
```

The Docker setup provides a reproducible backend runtime environment for development and deployment workflows.

---

# 📖 Documentation

| File              | Description              |
| ----------------- | ------------------------ |
| ARCHITECTURE.md   | System architecture      |
| ROADMAP.md        | Development roadmap      |
| PROJECT_STATUS.md | Current project progress |

---

# 🤝 Contributing

```bash
git checkout -b feature/your-feature

git commit -m "[feat] add new feature"

git push origin feature/your-feature
```
---
# 🚀 Releases

The project follows semantic versioning.

Current release:

* `v0.1.0` — Initial Public Release

GitHub Releases:

* https://github.com/sleepingbuild/gym-management/releases

Then create a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.
