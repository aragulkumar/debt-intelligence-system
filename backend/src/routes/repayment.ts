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
    
    if (debts.length === 0) return res.json({ strategy, order: [], projection: [] });

    // 1. Calculate sorting order
    let order;
    if (strategy === 'avalanche') order = calcAvalanche(debts, extraMonthlyPayment);
    else if (strategy === 'snowball') order = calcSnowball(debts, extraMonthlyPayment);
    else order = calcHybrid(debts, extraMonthlyPayment);

    // 2. 60-month Projection Simulation Loop
    const projection = [];
    
    // Deep clone state buffers
    let baseDebts = debts.map(d => ({ ...d, emiAmount: d.emiAmount || (d.outstanding * 0.05) }));
    let optDebts = order.map(d => ({ ...d, emiAmount: d.emiAmount || (d.outstanding * 0.05) }));
    
    for (let month = 0; month <= 60; month++) {
      let baseTotal = 0;
      let optTotal = 0;

      // Base: Just minimum payments
      baseDebts.forEach(d => {
        if (d.outstanding > 0) {
          const interest = d.outstanding * (d.interestRate / 100 / 12);
          d.outstanding = Math.max(0, d.outstanding + interest - d.emiAmount);
        }
        baseTotal += d.outstanding;
      });

      // Optimized: Minimums + Extra directed at #1 priority
      let extraAvailable = extraMonthlyPayment;
      optDebts.forEach(d => {
        if (d.outstanding > 0) {
          const interest = d.outstanding * (d.interestRate / 100 / 12);
          
          let payment = d.emiAmount;
          // Apply extra to highest priority that isn't paid off yet
          if (extraAvailable > 0) {
            payment += extraAvailable;
            extraAvailable = 0; 
          }
          
          const prePaymentBal = d.outstanding + interest;
          d.outstanding = Math.max(0, prePaymentBal - payment);
          
          // If we overpaid, roll the extra forward to the next priority debt
          if (payment > prePaymentBal) {
            extraAvailable = payment - prePaymentBal;
          }
        }
        optTotal += d.outstanding;
      });

      projection.push({
        month: \`Month \${month}\`,
        baseBalance: Math.round(baseTotal),
        optimizedBalance: Math.round(optTotal)
      });

      // Break early if both are zero
      if (baseTotal === 0 && optTotal === 0) break;
    }

    res.json({ strategy, order, projection });
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
