import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// GET /rules
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const rules = await prisma.rule.findMany({ where: { userId: req.user!.sub } });
    res.json(rules);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// POST /rules
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const rule = await prisma.rule.create({ data: { ...req.body, userId: req.user!.sub } });
    res.status(201).json(rule);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// PUT /rules/:id
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const rule = await prisma.rule.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: req.body,
    });
    res.json(rule);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// DELETE /rules/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.rule.deleteMany({ where: { id: req.params.id, userId: req.user!.sub } });
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// POST /rules/evaluate — run the rule engine
router.post('/evaluate', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.sub;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const debts = await prisma.debt.findMany({ where: { userId, isActive: true } });
    const rules = await prisma.rule.findMany({ where: { userId, isActive: true } });

    const income = user?.monthlyIncome || 1;
    const totalEmi = debts.reduce((s, d) => s + (d.emiAmount || 0), 0);
    const dtiRatio = (totalEmi / income) * 100;
    const now = new Date();

    const triggeredAlerts: any[] = [];
    for (const rule of rules) {
      let triggered = false;
      if (rule.trigger === 'dti_above' && dtiRatio > rule.threshold) triggered = true;
      if (rule.trigger === 'emi_due_in_days') {
        const soon = debts.some(d => {
          const diff = (new Date(d.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return diff <= rule.threshold && diff >= 0;
        });
        if (soon) triggered = true;
      }
      if (triggered) triggeredAlerts.push({ rule, message: `Rule "${rule.trigger}" triggered at threshold ${rule.threshold}` });
    }

    res.json({ evaluated: rules.length, triggered: triggeredAlerts });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
