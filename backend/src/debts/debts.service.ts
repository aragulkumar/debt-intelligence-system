import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DebtsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    return this.prisma.debt.findMany({
      where: { userId, isActive: true },
    });
  }

  async create(userId: string, data: any) {
    return this.prisma.debt.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    return this.prisma.debt.update({
      where: { id, userId },
      data,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.debt.update({
      where: { id, userId },
      data: { isActive: false },
    });
  }

  async getSummary(userId: string) {
    const debts = await this.findAllForUser(userId);
    const totalOwed = debts.reduce((acc, d) => acc + d.outstanding, 0);
    const totalMonthlyEmi = debts.reduce((acc, d) => acc + (d.emiAmount || 0), 0);
    return {
      totalOwed,
      totalMonthlyEmi,
      debtCount: debts.length,
    };
  }
}
