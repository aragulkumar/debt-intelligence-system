import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getDangerZone(userId: string) {
    let settings = await this.prisma.dangerZoneSettings.findUnique({
      where: { userId }
    });

    if (!settings) {
      settings = await this.prisma.dangerZoneSettings.create({
        data: { userId }
      });
    }

    return settings;
  }

  async updateDangerZone(userId: string, data: any) {
    return this.prisma.dangerZoneSettings.update({
      where: { userId },
      data
    });
  }
}
