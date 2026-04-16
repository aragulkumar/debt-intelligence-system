import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getPreferences(userId: string) {
    const settings = await this.prisma.dangerZoneSettings.findUnique({ where: { userId } });
    if (!settings) return { fcmEnabled: true, smsEnabled: false };
    return { fcmEnabled: settings.fcmEnabled, smsEnabled: settings.smsEnabled };
  }

  async updatePreferences(userId: string, data: { fcmEnabled?: boolean; smsEnabled?: boolean }) {
    return this.prisma.dangerZoneSettings.update({
      where: { userId },
      data
    });
  }

  async sendTest(userId: string) {
    console.log(`Sending test notification to user ${userId}...`);
    // BullMQ enqueue would go here
    return { success: true, message: 'Test notification queued.' };
  }
}
