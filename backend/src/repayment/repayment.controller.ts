import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { RepaymentService } from './repayment.service';
import { CalculatePlanDto } from './strategy.service';

@Controller('repayment')
export class RepaymentController {
  constructor(private readonly repaymentService: RepaymentService) {}

  private getUserId(req: any) {
    return req.headers['x-user-id'] || 'dummy-user-id';
  }

  @Get('strategies')
  getStrategies() {
    return ['snowball', 'avalanche', 'hybrid', 'custom'];
  }

  @Post('calculate')
  calculatePlan(@Req() req: any, @Body() dto: CalculatePlanDto) {
    return this.repaymentService.calculatePlan(this.getUserId(req), dto);
  }

  @Post('simulate')
  simulate(@Req() req: any, @Body() body: { debt_id: string, extra_amount: number }) {
    return this.repaymentService.simulate(this.getUserId(req), body.debt_id, body.extra_amount);
  }
}
