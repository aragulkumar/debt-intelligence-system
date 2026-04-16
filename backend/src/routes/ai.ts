import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
router.use(authMiddleware);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// POST /ai/chat
router.post('/chat', async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user!.sub;

    const user  = await prisma.user.findUnique({ where: { id: userId } });
    const debts = await prisma.debt.findMany({ where: { userId, isActive: true } });

    const totalDebt = debts.reduce((s, d) => s + d.outstanding, 0);
    const totalEmi  = debts.reduce((s, d) => s + (d.emiAmount || 0), 0);
    const income    = user?.monthlyIncome || 0;

    const systemContext = `You are a friendly and empathetic AI financial coach helping an Indian user manage and reduce their debt.

User's financial profile:
- Name: ${user?.name || 'User'}
- Monthly income: ₹${income.toLocaleString()}
- Total outstanding debt: ₹${totalDebt.toLocaleString()}
- Monthly EMI load: ₹${totalEmi.toLocaleString()} (${income ? Math.round((totalEmi / income) * 100) : 0}% of income)
- Active debts: ${debts.length} accounts
- Debt types: ${debts.map(d => `${d.name} (${d.type}, ₹${d.outstanding.toLocaleString()}, ${d.interestRate}% p.a.)`).join('; ') || 'none added yet'}

Guidelines:
- Give practical, empathetic, actionable advice in simple language
- Use Indian financial context (₹, EMI, CIBIL score, etc.)
- Keep responses concise (3-5 sentences max unless complex question)
- Suggest specific strategies (avalanche/snowball) when relevant
- Be encouraging and non-judgmental`;

    let reply = '';

    if (process.env.GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat  = model.startChat({
        history: [{
          role: 'user',
          parts: [{ text: systemContext }],
        }, {
          role: 'model',
          parts: [{ text: "Understood! I'm ready to help with personalised debt advice." }],
        }],
      });
      const result = await chat.sendMessage(message);
      reply = result.response.text();
    } else {
      reply = `Based on your profile (₹${totalDebt.toLocaleString()} outstanding, ₹${totalEmi.toLocaleString()}/month EMI), I recommend the Avalanche strategy — pay minimums on all debts and put any extra money towards the highest interest rate debt first. This saves the most on interest over time. Set your Gemini API key in backend/.env to enable full AI-powered coaching.`;
    }

    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
