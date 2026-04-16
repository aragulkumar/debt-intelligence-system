import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      include: { debts: true }
    });
  }

  async getRiskHeatmap() {
    return { data: 'MOCK_RISK_HEATMAP' };
  }

  async getBnplAnalytics() {
    return { data: 'MOCK_BNPL_STATS' };
  }
}
