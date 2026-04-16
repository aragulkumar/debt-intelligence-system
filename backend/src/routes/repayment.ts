import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

function calcAvalanche(debts: any[], extraPayment: number) {
  const sorted = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  return sorted.map((d, i) => ({
    ...d,
    priority: i + 1,
    strategy: 'avalanche',
    suggestedExtra: i === 0 ? extraPayment : 0,
  }));
}

function calcSnowball(debts: any[], extraPayment: number) {
  const sorted = [...debts].sort((a, b) => a.outstanding - b.outstanding);
  return sorted.map((d, i) => ({
    ...d,
    priority: i + 1,
    strategy: 'snowball',
    suggestedExtra: i === 0 ? extraPayment : 0,
  }));
}

function calcHybrid(debts: any[], extraPayment: number) {
  const scored = debts.map(d => ({
    ...d,
    score: d.interestRate * 0.6 + (1 / (d.outstanding + 1)) * 40,
  }));
  const sorted = scored.sort((a, b) => b.score - a.score);
  return sorted.map((d, i) => ({
    ...d,
    priority: i + 1,
    strategy: 'hybrid',
    suggestedExtra: i === 0 ? extraPayment : 0,
  }));
}

// POST /repayment/strategy
router.post('/strategy', async (req: AuthRequest, res: Response) => {
  try {
    const { strategy = 'hybrid', extraMonthlyPayment = 0 } = req.body;
    const debts = await prisma.debt.findMany({
      where: { userId: req.user!.sub, isActive: true },
    });
    let result;
    if (strategy === 'avalanche') result = calcAvalanche(debts, extraMonthlyPayment);
    else if (strategy === 'snowball') result = calcSnowball(debts, extraMonthlyPayment);
    else result = calcHybrid(debts, extraMonthlyPayment);
    res.json({ strategy, order: result });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// POST /repayment/simulate
router.post('/simulate', async (req: AuthRequest, res: Response) => {
  try {
    const { debtId, extraPayment = 0 } = req.body;
    const debt = await prisma.debt.findFirst({
      where: { id: debtId, userId: req.user!.sub },
    });
    if (!debt) return res.status(404).json({ message: 'Debt not found' });

    const monthlyRate = debt.interestRate / 100 / 12;
    const emi = debt.emiAmount || (debt.outstanding * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -24));
    const totalEmi = emi + extraPayment;
    const months = monthlyRate > 0
      ? Math.ceil(-Math.log(1 - (debt.outstanding * monthlyRate) / totalEmi) / Math.log(1 + monthlyRate))
      : Math.ceil(debt.outstanding / totalEmi);
    const totalInterest = (totalEmi * months) - debt.outstanding;

    res.json({ debtId, extraPayment, estimatedMonths: months, totalInterestPaid: Math.max(0, totalInterest).toFixed(2) });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
