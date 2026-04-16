import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StrategyService, CalculatePlanDto } from './strategy.service';

@Injectable()
export class RepaymentService {
  constructor(
    private prisma: PrismaService,
    private strategy: StrategyService
  ) {}

  async calculatePlan(userId: string, dto: CalculatePlanDto) {
    const debts = await this.prisma.debt.findMany({ where: { userId, isActive: true } });

    let allocations;
    switch (dto.strategy) {
      case 'snowball':
        allocations = this.strategy.calculateSnowball(debts, dto.extra_payment);
        break;
      case 'avalanche':
        allocations = this.strategy.calculateAvalanche(debts, dto.extra_payment);
        break;
      case 'hybrid':
        allocations = this.strategy.calculateHybrid(debts, dto.extra_payment);
        break;
      case 'custom':
        allocations = this.strategy.calculateCustom(debts, dto.extra_payment, dto.weights || []);
        break;
      default:
        throw new Error('Unknown strategy');
    }

    return allocations;
  }

  async simulate(userId: string, debtId: string, extraAmount: number) {
    const debt = await this.prisma.debt.findUnique({ where: { id: debtId } });
    if (!debt || debt.userId !== userId) throw new Error('Debt not found');

    const monthlyInterestRate = debt.interestRate / 12 / 100;
    const currentEmi = debt.emiAmount || 0;
    const newEmi = currentEmi + extraAmount;

    // Simplified simulation formula for months required (ignores compounding complexities for MVP)
    const currentMonthsToPayoff = currentEmi > 0 ? debt.outstanding / (currentEmi - debt.outstanding * monthlyInterestRate) : 0;
    const newMonthsToPayoff = newEmi > 0 ? debt.outstanding / (newEmi - debt.outstanding * monthlyInterestRate) : 0;

    const savedMonths = Math.max(0, currentMonthsToPayoff - newMonthsToPayoff);

    return {
      months_saved: Math.floor(savedMonths),
      interest_saved: Math.floor(savedMonths * (debt.outstanding * monthlyInterestRate)), // Rough estimate
      new_payoff_date: new Date(new Date().setMonth(new Date().getMonth() + Math.ceil(newMonthsToPayoff)))
    };
  }
}
