import { Injectable } from '@nestjs/common';
import { Debt } from '@prisma/client';

export type RepaymentStrategy = 'snowball' | 'avalanche' | 'hybrid' | 'custom';

export interface StrategyWeight {
  debt_id: string;
  weight: number;
}

export interface CalculatePlanDto {
  strategy: RepaymentStrategy;
  extra_payment: number;
  weights?: StrategyWeight[];
}

@Injectable()
export class StrategyService {
  calculateSnowball(debts: Debt[], extraPayment: number) {
    const sorted = [...debts].sort((a, b) => a.outstanding - b.outstanding);
    return this.allocateExtraPayment(sorted, extraPayment);
  }

  calculateAvalanche(debts: Debt[], extraPayment: number) {
    const sorted = [...debts].sort((a, b) => b.interestRate - a.interestRate);
    return this.allocateExtraPayment(sorted, extraPayment);
  }

  calculateHybrid(debts: Debt[], extraPayment: number) {
    // 60% to highest interest, 40% to lowest balance
    const highestInterest = [...debts].sort((a, b) => b.interestRate - a.interestRate);
    const lowestBalance = [...debts].sort((a, b) => a.outstanding - b.outstanding);

    const allocations = debts.map(d => ({ debtId: d.id, customAmount: 0 }));

    if (highestInterest.length > 0) {
      const topInterestId = highestInterest[0].id;
      const alloc = allocations.find(a => a.debtId === topInterestId);
      if (alloc) alloc.customAmount += extraPayment * 0.6;
    }

    if (lowestBalance.length > 0) {
      const bottomBalanceId = lowestBalance[0].id;
      const alloc = allocations.find(a => a.debtId === bottomBalanceId);
      if (alloc) alloc.customAmount += extraPayment * 0.4;
    }

    return allocations;
  }

  calculateCustom(debts: Debt[], extraPayment: number, weights: StrategyWeight[]) {
    return requests.map(weight => ({
      debtId: weight.debt_id,
      customAmount: extraPayment * weight.weight
    }));
  }

  private allocateExtraPayment(debts: Debt[], extraPayment: number) {
    return debts.map((d, index) => ({
      debtId: d.id,
      customAmount: index === 0 ? extraPayment : 0
    }));
  }
}
