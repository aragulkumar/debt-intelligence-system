import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
router.use(authMiddleware);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ── Local fallback scoring formula ────────────────────────────
function localScore(dti: number, emiR: number, avgRate: number, debtCount: number) {
  const rateP = Math.min(avgRate / 40, 1);
  const raw   = Math.max(0, Math.round(100 - dti * 40 - emiR * 30 - rateP * 20 - Math.min(debtCount * 2, 10)));
  const band  = raw >= 80 ? 'Excellent' : raw >= 60 ? 'Good' : raw >= 40 ? 'Fair' : 'Poor';
  return { score: raw, band };
}

// GET /health-score
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.sub;
    const user   = await prisma.user.findUnique({ where: { id: userId } });
    const debts  = await prisma.debt.findMany({ where: { userId, isActive: true } });

    const income    = user?.monthlyIncome || 1;
    const totalDebt = debts.reduce((s, d) => s + d.outstanding, 0);
    const totalEmi  = debts.reduce((s, d) => s + (d.emiAmount || 0), 0);
    const avgRate   = debts.length ? debts.reduce((s, d) => s + d.interestRate, 0) / debts.length : 0;
    const dti       = Math.min(totalDebt / (income * 12), 1);
    const emiR      = Math.min(totalEmi / (income + 1), 1);

    let scoreData: any;

    if (process.env.GEMINI_API_KEY && debts.length > 0) {
      try {
        const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are a financial AI. Analyse the following debt profile and return a JSON object ONLY — no markdown, no explanation.

Debt profile:
- Monthly income: ₹${income.toLocaleString()}
- Total outstanding debt: ₹${totalDebt.toLocaleString()}
- Debt-to-annual-income ratio: ${(dti * 100).toFixed(1)}%
- Monthly EMI: ₹${totalEmi.toLocaleString()} (${(emiR * 100).toFixed(1)}% of income)
- Average interest rate: ${avgRate.toFixed(1)}% p.a.
- Number of active debts: ${debts.length}
- Debt breakdown: ${debts.map(d => `${d.name}: ₹${d.outstanding.toLocaleString()} at ${d.interestRate}%`).join(', ')}

Return exactly this JSON structure (no code block, just raw JSON):
{
  "score": <integer 0-100>,
  "band": <"Poor" | "Fair" | "Good" | "Excellent">,
  "insights": [<3 specific actionable insights as strings>]
}`;

        const result   = await model.generateContent(prompt);
        const text     = result.response.text().trim();
        const cleaned  = text.replace(/```json|```/g, '').trim();
        scoreData      = JSON.parse(cleaned);

        // Validate parsed output
        if (!scoreData.score || !scoreData.band || !Array.isArray(scoreData.insights)) {
          throw new Error('Invalid Gemini response shape');
        }
      } catch {
        // Fallback if Gemini fails or returns bad JSON
        const fb = localScore(dti, emiR, avgRate, debts.length);
        scoreData = {
          ...fb,
          insights: [
            totalEmi / income > 0.4 ? 'Your EMI is over 40% of income — try to consolidate loans.' : '',
            avgRate > 18 ? `High interest rate (avg ${avgRate.toFixed(1)}%) — consider balance transfer.` : '',
            debts.filter(d => d.type === 'BNPL').length > 1 ? 'Multiple BNPL accounts increase default risk.' : '',
          ].filter(Boolean),
        };
      }
    } else {
      // No Gemini key — use local formula with generic tips
      const fb = localScore(dti, emiR, avgRate, debts.length);
      scoreData = {
        ...fb,
        insights: debts.length === 0
          ? ['Add your debt accounts to receive a personalised AI-powered health score.']
          : [
              `Your EMI-to-income ratio is ${(emiR * 100).toFixed(0)}% — aim for below 35%.`,
              avgRate > 15 ? 'Consider refinancing high-interest debts.' : 'Interest rates look manageable.',
              'Set a GEMINI_API_KEY in backend/.env for full AI debt analysis.',
            ],
      };
    }

    // Save score to history
    try {
      await prisma.healthScoreHistory.create({
        data: { userId, score: scoreData.score, band: scoreData.band },
      });
    } catch { /* ignore history save errors */ }

    res.json(scoreData);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// GET /health-score/history
router.get('/history', async (req: AuthRequest, res: Response) => {
  try {
    const history = await prisma.healthScoreHistory.findMany({
      where:   { userId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
      take:    30,
    });
    res.json(history);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
