import { Controller, Get, Req } from '@nestjs/common';
import { HealthScoreService } from './health-score.service';

@Controller('health-score')
export class HealthScoreController {
  constructor(private readonly healthScoreService: HealthScoreService) {}

  private getUserId(req: any) {
    return req.headers['x-user-id'] || 'dummy-user-id';
  }

  @Get()
  getScore(@Req() req: any) {
    return this.healthScoreService.calculateScore(this.getUserId(req));
  }

  @Get('history')
  getHistory(@Req() req: any) {
    return this.healthScoreService.getHistory(this.getUserId(req));
  }
}
