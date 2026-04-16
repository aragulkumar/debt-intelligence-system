import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RulesService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.rule.findMany({ where: { userId, isActive: true } });
  }

  create(userId: string, data: any) {
    return this.prisma.rule.create({
      data: { ...data, userId }
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.rule.update({
      where: { id, userId },
      data: { isActive: false }
    });
  }
}
