import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(clerkId: string, email: string) {
    let user = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { clerkId, email }
      });
    }
    return user;
  }

  async logout(userId: string) {
    return { success: true };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
      }
    });
  }
}
