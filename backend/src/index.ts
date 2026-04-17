import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import debtRoutes from './routes/debts';
import repaymentRoutes from './routes/repayment';
import healthScoreRoutes from './routes/health-score';
import mlRoutes from './routes/ml';
import triggersRoutes from './routes/triggers';

// Start cron jobs
import './scheduler';

import settingsRoutes from './routes/settings';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4000',
  credentials: true,
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/repayment', repaymentRoutes);
app.use('/api/health-score', healthScoreRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/triggers', triggersRoutes);

app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// ── Health check ───────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Debt Intelligence API running on http://localhost:${PORT}`);
  console.log(`   → Auth:         /api/auth`);
  console.log(`   → Debts:        /api/debts`);
  console.log(`   → Health Score: /api/health-score`);
  console.log(`   → Repayment:    /api/repayment`);
  console.log(`   → Triggers:     /api/triggers`);

  console.log(`   → ML Service:   /api/ml`);
  console.log(`   → Settings:     /api/settings`);
  console.log(`   → Admin:        /api/admin\n`);
});

export default app;
