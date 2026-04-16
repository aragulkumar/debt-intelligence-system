import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import axios from 'axios';

const router = Router();
router.use(authMiddleware);
const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// GET /ml/default-risk
router.get('/default-risk', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.sub;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const debts = await prisma.debt.findMany({ where: { userId, isActive: true } });

    const income = user?.monthlyIncome || 1;
    const totalDebt = debts.reduce((s, d) => s + d.outstanding, 0);
    const totalEmi = debts.reduce((s, d) => s + (d.emiAmount || 0), 0);
    const bnplCount = debts.filter(d => d.type === 'BNPL').length;
    const creditUtil = Math.min(totalEmi / (income + 1), 1);

    const payload = {
      user_id: userId,
      debt_to_income_ratio: Math.min(totalDebt / (income * 12), 1),
      missed_payments_last_6m: 0,
      bnpl_account_count: bnplCount,
      credit_utilisation: creditUtil,
      avg_days_overdue: 0,
    };

    const mlRes = await axios.post(`${ML_URL}/default-risk`, payload);
    res.json(mlRes.data);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// GET /ml/bnpl-cluster
router.get('/bnpl-cluster', async (req: AuthRequest, res: Response) => {
  try {
    const debts = await prisma.debt.findMany({ where: { userId: req.user!.sub, isActive: true } });
    const bnpl = debts.filter(d => d.type === 'BNPL');
    const totalDebt = debts.reduce((s, d) => s + d.outstanding, 0);
    const bnplTotal = bnpl.reduce((s, d) => s + d.outstanding, 0);

    const payload = {
      bnpl_count: bnpl.length,
      bnpl_total_outstanding: bnplTotal,
      bnpl_to_total_debt_ratio: totalDebt > 0 ? bnplTotal / totalDebt : 0,
      avg_bnpl_tenure_days: 30,
    };

    const mlRes = await axios.post(`${ML_URL}/bnpl-cluster`, payload);
    res.json(mlRes.data);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
