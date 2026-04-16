# Debt Helper Dashboard — Backend & ML

> Full-stack debt management platform helping users escape BNPL, EMI, and credit debt traps.  
> This document covers the **backend, ML microservice, database, and deployment**. Frontend is maintained in a separate branch — see `FRONTEND.md`.

---

## Repository Structure

```
debt-helper/
├── backend/                  # NestJS API server
│   ├── src/
│   │   ├── auth/             # Clerk auth integration
│   │   ├── debts/            # Debt CRUD, tags, due dates
│   │   ├── repayment/        # Strategy engine (snowball, avalanche, hybrid)
│   │   ├── rules/            # Custom rule engine (salary-based triggers)
│   │   ├── health-score/     # Debt health score calculator
│   │   ├── notifications/    # Bull queues, FCM, Twilio
│   │   ├── admin/            # Risk heatmaps, analytics, compliance
│   │   ├── ai/               # Claude API debt coach integration
│   │   └── ml/               # HTTP client calls to Python ML service
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   └── package.json
│
├── ml-service/               # Python FastAPI ML microservice
│   ├── app/
│   │   ├── main.py
│   │   ├── models/           # Trained model files (.pkl, .onnx)
│   │   ├── routes/
│   │   │   ├── default_risk.py
│   │   │   ├── bnpl_cluster.py
│   │   │   └── health_score.py
│   │   └── schemas.py        # Pydantic request/response schemas
│   ├── training/             # Jupyter notebooks + training scripts
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml
└── .env.example
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| API Server | Node.js 20 + NestJS + TypeScript |
| ML Service | Python 3.11 + FastAPI |
| ORM | Prisma |
| Primary DB | PostgreSQL 15 |
| Cache + Queues | Redis 7 + BullMQ |
| Time-series | TimescaleDB (PostgreSQL extension) |
| Auth | Clerk (OTP + OAuth) |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| SMS Alerts | Twilio |
| AI Debt Coach | Anthropic Claude API |
| ML Models | scikit-learn, XGBoost, pandas |
| Containerisation | Docker + docker-compose |
| CI/CD | GitHub Actions |

---

## Prerequisites

- Node.js >= 20
- Python >= 3.11
- Docker + Docker Compose
- PostgreSQL 15 (or use Docker)
- Redis 7 (or use Docker)

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-org/debt-helper.git
cd debt-helper

# Backend dependencies
cd backend && npm install

# ML service dependencies
cd ../ml-service && pip install -r requirements.txt
```

### 2. Environment variables

Copy `.env.example` to `.env` in both `backend/` and `ml-service/` and fill in values:

```bash
cp .env.example backend/.env
cp .env.example ml-service/.env
```

**backend/.env**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/debthelper
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=sk_test_...
ANTHROPIC_API_KEY=sk-ant-...
FCM_SERVER_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
ML_SERVICE_URL=http://ml-service:8000
```

**ml-service/.env**
```env
MODEL_DIR=./app/models
LOG_LEVEL=info
```

### 3. Run with Docker Compose (recommended)

```bash
docker-compose up --build
```

This starts:
- NestJS backend on `http://localhost:3000`
- FastAPI ML service on `http://localhost:8000`
- PostgreSQL on port `5432`
- Redis on port `6379`

### 4. Run locally without Docker

```bash
# Terminal 1 — Backend
cd backend
npx prisma migrate dev
npm run start:dev

# Terminal 2 — ML Service
cd ml-service
uvicorn app.main:app --reload --port 8000
```

---

## Backend — NestJS

### API Endpoints

#### Auth
```
POST   /auth/login           Clerk-based login (OTP/OAuth)
POST   /auth/logout
GET    /auth/me              Get current user profile
```

#### Debts
```
GET    /debts                List all debts for current user
POST   /debts                Add a new debt
PATCH  /debts/:id            Update debt (due date, tag, amount)
DELETE /debts/:id            Remove a debt
GET    /debts/summary        Unified overview (total owed, monthly load)
```

#### Repayment Strategy
```
GET    /repayment/strategies            List available strategies
POST   /repayment/calculate             Calculate repayment plan
Body: { strategy: "snowball" | "avalanche" | "hybrid" | "custom", extra_payment: number }

POST   /repayment/simulate              What-if simulation
Body: { debt_id: string, extra_amount: number }
Returns: { months_saved, interest_saved, new_payoff_date }
```

#### Rules Engine
```
GET    /rules                List user's custom rules
POST   /rules                Create a rule
Body: { trigger: "salary_above", threshold: 25000, action: "allocate_extra", amount: 500, target: "highest_interest" }
DELETE /rules/:id
POST   /rules/evaluate       Manually trigger rule evaluation
```

#### Health Score
```
GET    /health-score              Get current debt health score (0–100)
GET    /health-score/history      Score over time (TimescaleDB)
GET    /health-score/suggestions  Personalised improvement tips
```

#### Danger Zone Settings
```
GET    /settings/danger-zone
PATCH  /settings/danger-zone
Body: {
  overdue_warning_days: number,
  max_emi_load_percent: number,
  interest_rate_alert_threshold: number,
  credit_utilisation_warning: number
}
```

#### Notifications
```
GET    /notifications               List notification preferences
PATCH  /notifications/preferences   Update preferences
POST   /notifications/test          Send a test notification
```

#### AI Debt Coach
```
POST   /ai/chat
Body: { message: string, conversation_history: Message[] }
Returns: { reply: string }
```

#### Admin (protected — admin role only)
```
GET    /admin/users                  All users with debt load summary
GET    /admin/risk-heatmap           Risk level distribution data
GET    /admin/bnpl-analytics         BNPL dependency stats
GET    /admin/repayment-success      Repayment success rates
GET    /admin/high-debt-users        Users above EMI load threshold
GET    /admin/compliance             Regulatory compliance report
```

#### ML Proxy (internal — called by Node, not exposed to client)
```
POST   /ml/default-risk       Proxy to Python service
POST   /ml/bnpl-cluster       Proxy to Python service
POST   /ml/health-score-ml    Proxy to Python service
```

---

### Repayment Strategy Engine

Located in `backend/src/repayment/strategy.service.ts`.

**Snowball** — pays off lowest balance first (psychological wins).  
**Avalanche** — pays off highest interest rate first (saves most money).  
**Hybrid** — splits extra payment 60% to highest interest, 40% to lowest balance.  
**Custom** — user-defined weights per debt (e.g. "40% to Debt A, 60% to Debt B").

```typescript
// Example custom strategy input
{
  strategy: "custom",
  weights: [
    { debt_id: "abc123", weight: 0.6 },
    { debt_id: "def456", weight: 0.4 }
  ],
  extra_payment: 1500
}
```

---

### Rule Engine

Located in `backend/src/rules/rule-engine.service.ts`.

Rules are evaluated every time a user updates their income, adds a debt, or manually triggers evaluation.

```typescript
// Supported trigger types
type RuleTrigger =
  | "salary_above"       // if monthly income > threshold
  | "salary_below"
  | "debt_overdue"       // if any debt is N days overdue
  | "utilisation_above"  // if credit card utilisation > %
  | "emi_load_above";    // if EMI/income ratio > %

// Supported action types
type RuleAction =
  | "allocate_extra"     // send extra amount to a specific debt
  | "send_alert"         // trigger a notification
  | "pause_strategy";    // freeze repayment strategy
```

---

### AI Debt Coach

Located in `backend/src/ai/coach.service.ts`.

The coach is scoped to the user's real debt data — not generic advice. On each request, the service fetches the user's debt summary and injects it as system context into the Claude API call.

```typescript
const systemPrompt = `
You are a personal debt advisor for this user.
Their current debt summary: ${JSON.stringify(debtSummary)}
Their health score: ${healthScore}/100
Their monthly EMI load: ₹${totalEmi} (${emiPercent}% of income)

Give specific, actionable advice. Keep responses under 150 words.
Do not give generic finance tips — always refer to their actual numbers.
`;
```

---

### Notification Queue

Built with BullMQ + Redis. Jobs are added to queues and processed by workers.

**Queue types:**
- `due-date-reminder` — fires 3 days before a debt due date
- `overdue-alert` — fires when payment is N days late (configured in danger zone settings)
- `interest-change-alert` — fires when a floating-rate debt's rate changes
- `over-limit-warning` — fires when credit utilisation crosses threshold
- `weekly-summary` — digest of upcoming dues vs salary credit date

Workers send via FCM (push) and Twilio (SMS) based on user preferences.

---

## ML Service — Python FastAPI

### Architecture

```
Node.js Backend  ──HTTP POST──▶  FastAPI ML Service
                                   ├── /predict/default-risk   (XGBoost)
                                   ├── /predict/bnpl-cluster   (K-Means)
                                   └── /predict/health-score   (Regression)
```

### Endpoints

#### Default Risk Prediction
```
POST /predict/default-risk

Request:
{
  "user_id": "string",
  "debt_to_income_ratio": 0.45,
  "missed_payments_last_6m": 2,
  "bnpl_account_count": 4,
  "credit_utilisation": 0.78,
  "avg_days_overdue": 12.5
}

Response:
{
  "risk_score": 0.823,
  "label": "high",       // "low" | "medium" | "high"
  "contributing_factors": ["high_utilisation", "multiple_bnpl"]
}
```

#### BNPL Dependency Clustering
```
POST /predict/bnpl-cluster

Request:
{
  "bnpl_count": 5,
  "bnpl_total_outstanding": 12000,
  "bnpl_to_total_debt_ratio": 0.65,
  "avg_bnpl_tenure_days": 45
}

Response:
{
  "cluster": 2,
  "label": "heavy_dependent",   // "light" | "moderate" | "heavy_dependent"
  "recommendation": "Consolidate BNPL dues before adding new credit."
}
```

#### Health Score (ML-enhanced)
```
POST /predict/health-score

Request:
{
  "debt_to_income_ratio": 0.35,
  "missed_payments": 0,
  "credit_utilisation": 0.45,
  "active_debt_count": 3,
  "emi_to_income_ratio": 0.28,
  "avg_interest_rate": 14.5
}

Response:
{
  "score": 72,
  "band": "fair",     // "poor" | "fair" | "good" | "excellent"
  "breakdown": {
    "payment_behaviour": 85,
    "utilisation": 60,
    "debt_load": 68,
    "diversity": 75
  }
}
```

### Training Models

Training scripts are in `ml-service/training/`. Run them once to generate model files in `app/models/`.

```bash
cd ml-service

# Train default risk model
python training/train_default_risk.py

# Train BNPL clustering model
python training/train_bnpl_cluster.py

# Train health score regression
python training/train_health_score.py
```

Models are saved as `.pkl` files and loaded at FastAPI startup.

---

## Database Schema (Prisma)

```prisma
model User {
  id              String   @id @default(cuid())
  clerkId         String   @unique
  email           String   @unique
  monthlyIncome   Float?
  debts           Debt[]
  rules           Rule[]
  settings        DangerZoneSettings?
  createdAt       DateTime @default(now())
}

model Debt {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  name          String
  type          DebtType  // BNPL | EMI | CREDIT_CARD | PERSONAL_LOAN | OTHER
  principal     Float
  outstanding   Float
  interestRate  Float
  emiAmount     Float?
  dueDate       DateTime
  tag           String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Rule {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  trigger     String
  threshold   Float
  action      String
  amount      Float?
  targetDebt  String?
  isActive    Boolean  @default(true)
}

model DangerZoneSettings {
  id                        String  @id @default(cuid())
  userId                    String  @unique
  user                      User    @relation(fields: [userId], references: [id])
  overdueWarningDays        Int     @default(3)
  maxEmiLoadPercent         Float   @default(40)
  interestRateAlertThreshold Float  @default(24)
  creditUtilisationWarning  Float   @default(70)
}

model HealthScoreHistory {
  time    DateTime @default(now())
  userId  String
  score   Int

  @@index([userId, time])
}

enum DebtType {
  BNPL
  EMI
  CREDIT_CARD
  PERSONAL_LOAN
  OTHER
}
```

---

## Docker Compose

```yaml
version: '3.9'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/debthelper
      - REDIS_URL=redis://redis:6379
      - ML_SERVICE_URL=http://ml-service:8000
    env_file: ./backend/.env
    depends_on:
      - db
      - redis
      - ml-service

  ml-service:
    build: ./ml-service
    ports:
      - "8000:8000"
    volumes:
      - ./ml-service/app/models:/app/models

  db:
    image: timescale/timescaledb:latest-pg15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: debthelper
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

---

## Git Branching Strategy

```
main
├── backend/          ← your branch (this README)
│   ├── feature/debt-crud
│   ├── feature/repayment-engine
│   ├── feature/ml-integration
│   ├── feature/notifications
│   └── feature/admin-analytics
│
└── frontend/         ← frontend dev's branch (see FRONTEND.md)
    ├── feature/user-dashboard
    ├── feature/debt-forms
    └── feature/admin-panel
```

**API contract:** Backend exposes REST APIs documented above. Frontend consumes them. Any API changes must be communicated before merging into `main`.

---

## Environment Variables Reference

| Variable | Service | Description |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `REDIS_URL` | Backend | Redis connection string |
| `CLERK_SECRET_KEY` | Backend | Clerk server-side key |
| `ANTHROPIC_API_KEY` | Backend | Claude API key |
| `FCM_SERVER_KEY` | Backend | Firebase server key |
| `TWILIO_ACCOUNT_SID` | Backend | Twilio account ID |
| `TWILIO_AUTH_TOKEN` | Backend | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Backend | Sender phone number |
| `ML_SERVICE_URL` | Backend | Internal URL of Python service |
| `MODEL_DIR` | ML Service | Path to trained model files |

---

## Scripts

```bash
# Backend
npm run start:dev       # Development with hot reload
npm run start:prod      # Production
npm run build           # Compile TypeScript
npx prisma migrate dev  # Run DB migrations
npx prisma studio       # Open DB GUI

# ML Service
uvicorn app.main:app --reload   # Development
uvicorn app.main:app            # Production
pytest                          # Run tests

# Docker
docker-compose up --build       # Start all services
docker-compose down             # Stop all services
docker-compose logs backend     # View backend logs
docker-compose logs ml-service  # View ML service logs
```

---

## Contact & Contribution

- Backend branch: `backend/`
- ML branch: `backend/` (same branch, under `ml-service/`)
- Frontend branch: `frontend/` — maintained separately
- Raise PRs against `main` only after peer review
