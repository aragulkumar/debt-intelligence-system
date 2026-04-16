import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DebtsService } from '../debts/debts.service';

@Injectable()
export class HealthScoreService {
  constructor(
    private prisma: PrismaService,
    private debtsService: DebtsService
  ) {}

  async calculateScore(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { debts: { where: { isActive: true } } } });
    if (!user) throw new Error('User not found');

    const totalDebts = user.debts.length;
    let score = 100;

    const summary = await this.debtsService.getSummary(userId);
    const emiLoad = user.monthlyIncome ? (summary.totalMonthlyEmi / user.monthlyIncome) * 100 : 0;

    // Penalty for high EMI load
    if (emiLoad > 40) score -= 20;
    else if (emiLoad > 30) score -= 10;

    // Penalty for overdue (mock check based on dueDate < now)
    const now = new Date();
    const overdues = user.debts.filter(d => new Date(d.dueDate) < now && d.outstanding > 0);
    score -= overdues.length * 15;

    // High interest penalty
    const highInterestDebts = user.debts.filter(d => d.interestRate > 20);
    score -= highInterestDebts.length * 5;

    score = Math.max(0, Math.min(100, score)); // Clamp between 0-100

    let band = 'fair';
    if (score >= 80) band = 'excellent';
    else if (score >= 60) band = 'good';
    else if (score < 40) band = 'poor';

    // Log history
    await this.prisma.healthScoreHistory.create({
      data: { userId, score, band }
    });

    return { score, band, breakdown: { emiLoad, overdues: overdues.length, highInterestCount: highInterestDebts.length } };
  }

  getHistory(userId: string) {
    return this.prisma.healthScoreHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 12
    });
  }
}
