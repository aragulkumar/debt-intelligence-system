import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// GET /debts
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const debts = await prisma.debt.findMany({
      where: { userId: req.user!.sub, isActive: true },
      orderBy: { dueDate: 'asc' },
    });
    res.json(debts);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// POST /debts
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const debt = await prisma.debt.create({
      data: { ...req.body, userId: req.user!.sub },
    });
    res.status(201).json(debt);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// PUT /debts/:id
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const debt = await prisma.debt.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: req.body,
    });
    res.json(debt);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// DELETE /debts/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.debt.updateMany({
      where: { id: req.params.id, userId: req.user!.sub },
      data: { isActive: false },
    });
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// GET /debts/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const debt = await prisma.debt.findFirst({
      where: { id: req.params.id, userId: req.user!.sub },
    });
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json(debt);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// POST /debts/:id/pay
router.post('/:id/pay', async (req: AuthRequest, res: Response) => {
  try {
    const debt = await prisma.debt.findFirst({
      where: { id: req.params.id, userId: req.user!.sub },
    });
    
    if (!debt) return res.status(404).json({ message: 'Debt not found' });

    // Deduct EMI from outstanding. If balance goes negative, set it to 0.
    const newOutstanding = Math.max(0, debt.outstanding - (debt.emiAmount || 0));
    
    // Advance due date by 1 month to naturally mute alerts
    const newDueDate = new Date(debt.dueDate);
    newDueDate.setMonth(newDueDate.getMonth() + 1);

    const updated = await prisma.debt.update({
      where: { id: debt.id },
      data: {
        outstanding: newOutstanding,
        dueDate: newDueDate,
        isActive: newOutstanding > 0, // Auto-close debt if paid off
      }
    });

    res.json(updated);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
