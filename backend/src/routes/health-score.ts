import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import axios from 'axios';

const router = Router();
router.use(authMiddleware);
const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// GET /health-score
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.sub;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const debts = await prisma.debt.findMany({ where: { userId, isActive: true } });

    const income = user?.monthlyIncome || 1;
    const totalDebt = debts.reduce((s, d) => s + d.outstanding, 0);
    const totalEmi = debts.reduce((s, d) => s + (d.emiAmount || 0), 0);
    const avgRate = debts.length ? debts.reduce((s, d) => s + d.interestRate, 0) / debts.length : 0;

    const payload = {
      debt_to_income_ratio: Math.min(totalDebt / (income * 12), 1),
      missed_payments: 0,
      credit_utilisation: Math.min(totalEmi / (income + 1), 1),
      active_debt_count: debts.length,
      emi_to_income_ratio: Math.min(totalEmi / (income + 1), 1),
      avg_interest_rate: avgRate,
    };

    const mlRes = await axios.post(`${ML_URL}/health-score`, payload);

    // Save to history
    await prisma.healthScoreHistory.create({
      data: { userId, score: mlRes.data.score, band: mlRes.data.band },
    });

    res.json(mlRes.data);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// GET /health-score/history
router.get('/history', async (req: AuthRequest, res: Response) => {
  try {
    const history = await prisma.healthScoreHistory.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    res.json(history);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
