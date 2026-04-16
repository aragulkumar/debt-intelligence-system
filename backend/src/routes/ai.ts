import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
router.use(authMiddleware);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /ai/chat
router.post('/chat', async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user!.sub;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const debts = await prisma.debt.findMany({ where: { userId, isActive: true } });

    const totalDebt = debts.reduce((s, d) => s + d.outstanding, 0);
    const totalEmi = debts.reduce((s, d) => s + (d.emiAmount || 0), 0);
    const income = user?.monthlyIncome || 0;

    const context = `You are a friendly financial coach helping an Indian user manage debt.
User's financial profile:
- Total outstanding debt: ₹${totalDebt.toFixed(0)}
- Monthly EMI load: ₹${totalEmi.toFixed(0)}
- Monthly income: ₹${income}
- Active debts: ${debts.length} (types: ${debts.map(d => d.type).join(', ') || 'none'})
Give practical, empathetic advice in simple language. Keep responses concise and actionable.`;

    let reply = '';
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: context,
        messages: [{ role: 'user', content: message }],
      });
      reply = (response.content[0] as any).text;
    } else {
      // Fallback if no API key
      reply = `Based on your profile (₹${totalDebt.toFixed(0)} outstanding, ₹${totalEmi.toFixed(0)}/month EMI), I suggest: focus on your highest-interest debt first using the Avalanche strategy to save the most on interest.`;
    }

    res.json({ reply });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
