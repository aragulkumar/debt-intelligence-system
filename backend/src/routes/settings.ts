import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// GET /settings
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const settings = await prisma.dangerZoneSettings.findUnique({ where: { userId: req.user!.sub } });
    res.json(settings);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// POST /settings (upsert)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const settings = await prisma.dangerZoneSettings.upsert({
      where: { userId: req.user!.sub },
      update: req.body,
      create: { userId: req.user!.sub, ...req.body },
    });
    res.json(settings);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// PUT /settings/profile
router.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const { name, monthlyIncome, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: { name, monthlyIncome, phone },
      select: { id: true, name: true, email: true, monthlyIncome: true, phone: true },
    });
    res.json(user);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
