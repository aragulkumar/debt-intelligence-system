# 🧠 Debt Intelligence System

> A full-stack, AI + ML-powered debt management platform engineered for lower and middle-class households in India — transforming debt from a passive burden into a proactively managed strategy.

---

## 📌 Problem Statement

India's consumer debt landscape — dominated by **BNPL (Buy Now Pay Later)**, **EMIs**, and **revolving credit card balances** — traps millions of users in a cycle they cannot analytically understand or escape.

Existing finance apps either track expenses **passively** or offer **generic advice** disconnected from real user numbers. There is no tool that combines privacy-first data entry with machine learning-powered predictive analytics, tailored for everyday Indian households.

---

## 💡 Proposed Solution

The **Debt Intelligence System** is a full-stack, AI + ML-powered debt management platform specifically engineered for **lower and middle-class households**. It empowers users to take control of their financial health through a **manual data-entry model**, ensuring privacy while providing high-level analytics.

The platform is designed to:

- 📊 Give users a **real-time, data-driven view** of all their debts (entered manually by the user) in one place.
- 🔮 **Predict default risk** before it happens using machine learning based on user-provided financial signals.
- ♟️ **Recommend the optimal repayment strategy** using hybrid and custom approaches to clear debt faster.
- 🏛️ Provide an **admin dashboard** with risk heatmaps and compliance analytics for institutional oversight.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 + React 19 |
| **Backend** | NestJS + Node.js 20 |
| **Database** | PostgreSQL 15 |
| **ML Service** | FastAPI (Python 3.11) |
| **ML Models** | XGBoost, scikit-learn |
| **ORM** | Prisma |
| **Containerization** | Docker + Docker Compose |

---

## 🏗️ Architecture & Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 Frontend                   │
│          (Dashboard · Debt Entry · Coach · Admin)        │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────┐
│                  NestJS Backend (Node.js 20)             │
│  Auth · Debts · Repayment · Rules · Notifications        │
│  Health Score · AI Coach · ML Bridge · Admin · Settings  │
└────────────┬─────────────────────────────┬──────────────┘
             │ Prisma ORM                  │ HTTP
┌────────────▼────────────┐  ┌────────────▼──────────────┐
│    PostgreSQL 15 DB      │  │  FastAPI ML Microservice   │
│  (User · Debt · Rules)   │  │  XGBoost · scikit-learn   │
└─────────────────────────┘  └───────────────────────────┘
```

### Request Workflow (Example: User Opens Dashboard)

1. **Authentication** — User identity is verified to secure sensitive financial records.
2. **Debts Fetch** — The system retrieves the user's manually entered debt data, including outstanding balances and monthly EMI loads, from PostgreSQL 15.
3. **Health Score** — The NestJS backend calls the FastAPI ML Service to run regression models on the provided user data.
4. **Risk Score** — Financial ratios are proxied to XGBoost to return a risk label (`"high"` / `"low"`) and identify contributing factors.
5. **Rules Evaluation** — A rule engine scans for user-defined triggers; if a threshold (like a 40% debt-to-income ratio) is crossed, the system fires an alert.
6. **Notification** — Real-time alerts are sent to the user to prevent missed payments or over-leveraging.

---

## ✨ Core Features

### 🔐 Manual Data Entry Engine
A streamlined interface where users input their own loan details, interest rates, and EMI dates — ensuring full control over their data without linking bank accounts.

### 📈 Debt Health Score (0–100)
A regression model that analyzes payment behavior, credit utilization, and total debt load to generate a holistic financial health score.

### ♟️ Repayment Strategy Engine
Offers **Snowball**, **Avalanche**, and **Hybrid** strategies to help users clear debt efficiently based on their financial profile.

### 🔮 What-If Simulator
Allows users to visualize how extra payments toward specific debts impact their total interest paid and payoff timeline.

### ⚠️ Default Risk Prediction
An **XGBoost classifier** that predicts the probability of a user missing a payment based on the financial signals provided — before it happens.

### 🤖 AI Debt Coach
A conversational AI coach that provides personalized, context-aware advice based on a user's live debt profile.

### 🏛️ Admin Dashboard
Risk heatmaps, BNPL cluster analytics, and compliance-grade user risk tables for institutional and platform-level oversight.

### 🔔 Smart Rule Engine + Notifications
User-defined triggers (e.g., DTI > 40%, EMI due within 3 days) that automatically fire real-time alerts to keep users on track.

---

## 📁 Project Structure

```
debt-intelligence-system/
├── frontend/               # Next.js 16 + React 19 application
│   ├── app/                # App router pages (dashboard, admin, auth)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks (debts, health, rules)
│   ├── store/              # Zustand global state
│   └── lib/                # API client & utilities
│
├── backend/                # NestJS + Node.js 20 API server
│   ├── src/
│   │   ├── auth/           # JWT authentication
│   │   ├── debts/          # Debt CRUD & management
│   │   ├── repayment/      # Strategy engine (Snowball/Avalanche/Hybrid)
│   │   ├── health-score/   # ML-backed health scoring
│   │   ├── rules/          # Rule engine & alert triggers
│   │   ├── ai/             # AI Coach service
│   │   ├── ml/             # ML microservice bridge
│   │   ├── notifications/  # Alert & notification system
│   │   ├── admin/          # Admin analytics & risk management
│   │   └── settings/       # User settings & preferences
│   └── prisma/             # PostgreSQL schema (Prisma ORM)
│
├── ml-service/             # FastAPI Python ML microservice
│   ├── app/
│   │   ├── routes/         # health_score · default_risk · bnpl_cluster
│   │   └── schemas.py      # Pydantic request/response models
│   └── training/           # XGBoost & sklearn model training scripts
│
├── docker-compose.yml      # Full-stack orchestration
├── .env.example            # Environment variable template
└── Backend.md              # Detailed backend specification
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15
- Docker & Docker Compose (recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/aragulkumar/debt-intelligence-system.git
cd debt-intelligence-system
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials, JWT secret, and ML service URL
```

### 3. Run with Docker (Recommended)
```bash
docker-compose up --build
```

### 4. Run Manually

**Backend:**
```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

**ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 ML Models

| Model | Algorithm | Purpose |
|---|---|---|
| **Health Score** | Gradient Boosted Regressor (sklearn) | Outputs a 0–100 financial health score |
| **Default Risk** | XGBoost Classifier | Predicts `high` / `low` default risk |
| **BNPL Cluster** | K-Means Clustering | Segments BNPL users by behavior profile |

All models are trained on synthetic, India-specific financial data via the training scripts in `ml-service/training/`.

---

## ✅ Feasibility & Viability

### Technical Feasibility
- **Scalable Frontend**: Next.js 16 and React 19 provide the speed and accessibility required for a modern fintech dashboard.
- **Robust Backend**: NestJS ensures a modular, maintainable architecture that scales with complex business logic.
- **Model Accuracy**: XGBoost is an industry standard for tabular financial data, offering high precision for risk and health scoring.

### Market Viability & Social Impact
- **Target Demographic**: Specifically focused on lower and middle-class populations who often lack access to professional financial advisors and are most vulnerable to high-interest debt traps.
- **Competitive Gap**: Most apps require intrusive bank linking; this system builds trust by letting the user provide the data, then uses ML to predict where the user is headed.
- **Privacy-First**: By focusing entirely on user-provided data, the system bypasses the security risks and privacy hurdles associated with direct bank account scraping (Plaid/AA).

---

## 🎯 Summary

The **Debt Intelligence System** is a professional-grade fintech platform built on a modern stack including **Next.js 16**, **NestJS**, and **FastAPI**. It transforms debt management from a passive tracking exercise into a **proactive, AI-driven strategy** — helping lower and middle-class users achieve financial stability and freedom through their own data.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).