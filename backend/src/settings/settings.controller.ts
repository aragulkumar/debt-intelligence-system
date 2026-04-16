import { Controller, Get, Patch, Body, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  private getUserId(req: any) {
    return req.headers['x-user-id'] || 'dummy-user-id';
  }

  @Get('danger-zone')
  getDangerZone(@Req() req: any) {
    return this.settingsService.getDangerZone(this.getUserId(req));
  }

  @Patch('danger-zone')
  updateDangerZone(@Req() req: any, @Body() data: any) {
    return this.settingsService.updateDangerZone(this.getUserId(req), data);
  }
}
