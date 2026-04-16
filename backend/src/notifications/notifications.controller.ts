import { Controller, Get, Patch, Body, Req, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  private getUserId(req: any) {
    return req.headers['x-user-id'] || 'dummy-user-id';
  }

  @Get()
  getPreferences(@Req() req: any) {
    return this.notificationsService.getPreferences(this.getUserId(req));
  }

  @Patch('preferences')
  updatePreferences(@Req() req: any, @Body() data: any) {
    return this.notificationsService.updatePreferences(this.getUserId(req), data);
  }

  @Post('test')
  sendTest(@Req() req: any) {
    return this.notificationsService.sendTest(this.getUserId(req));
  }
}
