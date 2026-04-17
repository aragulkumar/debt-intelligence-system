# 💰 Debt Intelligence System

> An AI-powered personal debt management platform that helps users track, analyse, and systematically eliminate their debt using Google Gemini AI, smart repayment strategies, and an automated rules engine.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Account](#demo-account)
- [Pages & Functionality](#pages--functionality)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)

---

## Overview

The **Debt Intelligence System** is a full-stack web application designed for users who want to take control of their debt. It consolidates all your credit cards, loans, and BNPL accounts in one place, calculates a real-time financial health score using **Google Gemini AI**, and recommends the most optimal repayment strategy (Avalanche, Snowball, or AI Hybrid).

Key differentiators:
- 🤖 **Gemini-powered health score** — not a simple formula, but real AI analysis of your debt portfolio
- 💬 **AI Financial Coach** — a context-aware chatbot that knows your exact debt profile
- 🔔 **Rules Engine** — automated alert system that flags high DTI, upcoming EMIs, and high-interest accounts
- 🌗 **Dark/Light Mode** — full theme support with persistent preference

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 **Local JWT Auth** | Register & login with email/password. Passwords hashed with bcrypt |
| 📊 **Dashboard** | Total debt, monthly EMI, health score, trend chart, and AI insights |
| 💳 **Debt Manager** | Add/delete credit cards, personal loans, BNPL, auto loans |
| 🧮 **Strategy Simulator** | Avalanche, Snowball, and AI Hybrid repayment calculators |
| 🤖 **AI Health Score** | Gemini AI analyses DTI, EMI ratio, interest rates → score 0–100 |
| 💬 **AI Coach** | Chat with Gemini about your specific debts and get actionable advice |
| ⚙️ **Rules Engine** | Automated financial alerts triggered by configurable thresholds |
| 👤 **Settings** | Update name, income, phone number |
| 🛡️ **Admin Dashboard** | Platform analytics — total users, debts, outstanding amounts |
| 🌗 **Dark/Light Theme** | Persistent theme toggle in sidebar |

---

## Tech Stack

### Frontend
| Library | Purpose |
|---------|---------|
| React 18 + Vite | Fast SPA framework |
| TypeScript | Type safety |
| shadcn/ui | Premium accessible UI components |
| Tailwind CSS v4 | Utility-first styling |
| TanStack React Query | Server state & caching |
| React Router v6 | Client-side routing |
| Recharts | Debt trend chart |
| Axios | HTTP client with JWT interceptor |
| Sonner | Toast notifications |
| Lucide React | Icons |

### Backend
| Library | Purpose |
|---------|---------|
| Express.js | REST API server |
| TypeScript + ts-node-dev | Type-safe backend dev server |
| Prisma ORM | Database access layer |
| PostgreSQL | Relational database |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation & verification |
| @google/generative-ai | Gemini AI integration |

---

## Architecture

```
Browser (http://localhost:4000)
        │
        │  /api/* → proxied by Vite dev server
        ▼
Express Backend (http://localhost:3000)
        │
        ├── JWT Auth Middleware
        ├── Prisma ORM
        │       └── PostgreSQL (port 5432)
        │
        └── Google Gemini AI (external API)
                ├── Health Score Analysis
                └── AI Coach Chat
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/download/) v14 or higher
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/aragulkumar/debt-intelligence-system.git
cd debt-intelligence-system
```

### 2. Set Up the Database

Open pgAdmin or psql and create the database:

```sql
CREATE DATABASE debtintelligence;
```

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create the `.env` file:

```bash
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/debtintelligence
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:4000
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

> 💡 Get a **free Gemini API key** at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Seed Demo Data (Optional but Recommended)

This creates a realistic demo account with 5 debt accounts, rules, and 6 months of history:

```bash
npx ts-node src/seed.ts
```

### 6. Start the Backend

```bash
npm run dev
```

You should see:
```
🚀 Debt Intelligence API running on http://localhost:3000
   → Auth:         /api/auth
   → Debts:        /api/debts
   → Health Score: /api/health-score
   ...
```

### 7. Configure and Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE v5.4.21  ready in 681 ms
➜  Local:   http://localhost:4000/
```

### 8. Open the App

Visit **[http://localhost:4000](http://localhost:4000)** in your browser.

---

## Environment Variables

### `backend/.env`

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | ✅ Yes |
| `PORT` | Backend server port (default: 3000) | Optional |
| `FRONTEND_URL` | Frontend origin for CORS | ✅ Yes |
| `NODE_ENV` | `development` or `production` | Optional |
| `GEMINI_API_KEY` | Google Gemini AI API key | Optional* |

> *Without `GEMINI_API_KEY`, the app falls back to a local formula for health score and generic AI coach responses. All other features work normally.

---

## Demo Account

After running the seed script, use these credentials:

| Field | Value |
|-------|-------|
| **Email** | `demo@debthelper.com` |
| **Password** | `Demo@1234` |
| **Name** | Arjun Sharma |
| **Monthly Income** | ₹75,000 |

### Seeded Debt Accounts

| Account | Type | Outstanding | Interest | EMI |
|---------|------|------------|----------|-----|
| HDFC Regalia Credit Card | Credit Card | ₹45,000 | 18.5% | ₹3,500 |
| SBI Personal Loan | Personal Loan | ₹1,20,000 | 14.5% | ₹5,800 |
| Bajaj Finserv BNPL | BNPL | ₹12,500 | 24.0% | ₹2,500 |
| ICICI Bank Car Loan | Other | ₹3,50,000 | 9.5% | ₹7,200 |
| Amazon Pay Later | BNPL | ₹8,000 | 26.0% | ₹2,000 |
| **Total** | | **₹5,35,500** | | **₹21,000/mo** |

---

## Pages & Functionality

### `/` — Dashboard
- Total outstanding debt, monthly EMI load, BNPL account count
- Gemini AI-powered financial health score (0–100) with band: Poor / Fair / Good / Excellent
- Progress bar visualising health score
- Line chart showing debt paydown trend over 4 months
- AI-generated insights from Gemini

### `/debts` — My Debts
- View all active debt accounts as cards
- Add new accounts via dialog — supports Credit Card, Personal Loan, BNPL, Mortgage, Auto Loan, Student Loan
- Delete accounts (hover to reveal delete button)
- Summary bar showing total outstanding by type

### `/strategy` — Repayment Strategy
- **Avalanche** — pay highest interest first (minimises total interest)
- **Snowball** — pay lowest balance first (builds momentum)
- **Hybrid AI** — ML-optimised combination
- Optionally specify extra monthly payment amount
- Returns an ordered payoff plan with suggested extra payment per account

### `/rules` — Rules Engine
- View configured financial alert rules
- Run the engine manually to see which rules are triggered
- Currently evaluates: DTI ratio threshold, EMI due date proximity

### `/coach` — AI Financial Coach
- Real-time chat with Google Gemini 1.5 Flash
- Full debt context injected automatically (income, all debts, totals)
- Starter prompt chips for common questions
- Smooth scrolling chat UI with typing indicator

### `/settings` — Settings
- Update name, phone number, monthly income
- Email is read-only (used for auth)

### `/admin` — Admin Dashboard
- Platform-wide stats: total users, active debts, total outstanding
- Debt breakdown by type
- Full user list with debt count and total

---

## API Reference

All routes except `/api/auth/*` require `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account → returns JWT |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get current user profile |

### Debts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/debts` | List all active debts |
| POST | `/api/debts` | Add new debt |
| PUT | `/api/debts/:id` | Update debt |
| DELETE | `/api/debts/:id` | Delete debt |

### Health Score
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health-score` | Gemini AI health score + insights |
| GET | `/api/health-score/history` | Last 30 score entries |

### AI Coach
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send message → Gemini response |

### Strategy
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/repayment/strategy` | Calculate repayment order |

### Rules
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rules` | List all rules |
| POST | `/api/rules` | Create rule |
| PUT | `/api/rules/:id` | Update rule |
| DELETE | `/api/rules/:id` | Delete rule |
| POST | `/api/rules/evaluate` | Run engine against debts |

---

## Project Structure

```
debt-intelligence-system/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database models
│   ├── src/
│   │   ├── db/
│   │   │   └── prisma.ts          # Prisma client singleton
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── auth.ts            # Register / Login / Me
│   │   │   ├── debts.ts           # CRUD for debt accounts
│   │   │   ├── health-score.ts    # Gemini AI health analysis
│   │   │   ├── ai.ts              # Gemini AI coach chat
│   │   │   ├── repayment.ts       # Strategy simulator
│   │   │   ├── rules.ts           # Rules engine
│   │   │   ├── settings.ts        # Profile update
│   │   │   └── admin.ts           # Admin analytics
│   │   ├── index.ts               # Express app entry point
│   │   └── seed.ts                # Demo data seed script
│   ├── .env                       # Environment variables (git-ignored)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx         # Sidebar + main wrapper
│   │   │   └── ui/                # shadcn/ui components
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # JWT auth state
│   │   │   └── ThemeContext.tsx   # Dark/light mode
│   │   ├── lib/
│   │   │   ├── api.ts             # Axios instance with JWT interceptor
│   │   │   └── utils.ts           # shadcn cn() utility
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Debts.tsx
│   │   │   ├── Strategy.tsx
│   │   │   ├── Rules.tsx
│   │   │   ├── Coach.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Admin.tsx
│   │   ├── main.tsx               # App entry, routing
│   │   └── index.css              # shadcn design tokens + globals
│   ├── components.json            # shadcn/ui config
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## Common Commands

```bash
# Re-seed demo data
cd backend && npx ts-node src/seed.ts

# Run database migrations after schema changes
cd backend && npx prisma migrate dev

# Open Prisma Studio (visual DB browser)
cd backend && npx prisma studio

# Build frontend for production
cd frontend && npm run build
```

---

## License

MIT — free to use and modify.