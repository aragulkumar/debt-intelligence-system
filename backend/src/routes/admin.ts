import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// GET /admin/stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalDebts = await prisma.debt.count({ where: { isActive: true } });
    const totalOutstanding = await prisma.debt.aggregate({ _sum: { outstanding: true } });
    const debtByType = await prisma.debt.groupBy({
      by: ['type'],
      _count: { id: true },
      _sum: { outstanding: true },
      where: { isActive: true },
    });

    res.json({
      totalUsers,
      totalActiveDebts: totalDebts,
      totalOutstanding: totalOutstanding._sum.outstanding || 0,
      debtByType,
    });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// GET /admin/users
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, monthlyIncome: true, createdAt: true,
        debts: { where: { isActive: true }, select: { outstanding: true, type: true } } },
    });
    res.json(users);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
