import { Controller, Post, Body } from '@nestjs/common';
import { MlService } from './ml.service';

@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Post('default-risk')
  predictDefaultRisk(@Body() body: any) {
    return this.mlService.predictDefaultRisk(body);
  }

  @Post('bnpl-cluster')
  analyzeBnplCluster(@Body() body: any) {
    return this.mlService.analyzeBnplCluster(body);
  }

  @Post('health-score-ml')
  getHealthScoreMl(@Body() body: any) {
    return this.mlService.getHealthScoreMl(body);
  }
}
