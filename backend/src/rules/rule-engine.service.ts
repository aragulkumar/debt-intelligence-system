import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

type RuleTrigger = 'salary_above' | 'salary_below' | 'debt_overdue' | 'utilisation_above' | 'emi_load_above';
type RuleAction = 'allocate_extra' | 'send_alert' | 'pause_strategy';

@Injectable()
export class RuleEngineService {
  constructor(private prisma: PrismaService) {}

  async evaluateRules(userId: string) {
    const rules = await this.prisma.rule.findMany({ where: { userId, isActive: true } });
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { debts: true } });
    
    if (!user) return;

    const triggeredRules = [];

    for (const rule of rules) {
      const isTriggered = await this.checkTrigger(rule, user);
      if (isTriggered) {
        triggeredRules.push(rule);
        await this.executeAction(rule, user);
      }
    }

    return { evaluated: rules.length, triggered: triggeredRules.length, rules: triggeredRules };
  }

  private async checkTrigger(rule: any, user: any): Promise<boolean> {
    switch (rule.trigger) {
      case 'salary_above':
        return user.monthlyIncome ? user.monthlyIncome > rule.threshold : false;
      case 'salary_below':
        return user.monthlyIncome ? user.monthlyIncome < rule.threshold : false;
      case 'emi_load_above': {
        const totalEmi = user.debts.reduce((sum: number, d: any) => sum + (d.emiAmount || 0), 0);
        const emiPercent = user.monthlyIncome ? (totalEmi / user.monthlyIncome) * 100 : 0;
        return emiPercent > rule.threshold;
      }
      case 'debt_overdue': {
        const now = new Date();
        const overdue = user.debts.some((d: any) => new Date(d.dueDate) < now && d.outstanding > 0);
        return overdue; // Simplified rule evaluation
      }
      case 'utilisation_above': {
        const creditCards = user.debts.filter((d: any) => d.type === 'CREDIT_CARD');
        const utilized = creditCards.reduce((sum: number, d: any) => sum + d.outstanding, 0);
        const limit = creditCards.reduce((sum: number, d: any) => sum + d.principal, 0); // Simplified context assuming principal = max limit
        const limitPercent = limit > 0 ? (utilized / limit) * 100 : 0;
        return limitPercent > rule.threshold;
      }
      default:
        return false;
    }
  }

  private async executeAction(rule: any, user: any) {
    // In actual implementation, this would enqueue to BullMQ or trigger Repayment calculations
    console.log(`Executing action ${rule.action} for user ${user.id} due to rule ${rule.id}`);
    
    switch (rule.action) {
      case 'allocate_extra':
        console.log(`Allocating ${rule.amount} to debt ${rule.targetDebt}`);
        break;
      case 'send_alert':
        console.log(`Sending alert for rule ${rule.id}`);
        break;
      case 'pause_strategy':
        console.log(`Pausing strategy for user ${user.id}`);
        break;
    }
  }
}
