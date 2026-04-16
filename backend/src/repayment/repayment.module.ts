import { Module } from '@nestjs/common';
import { RepaymentService } from './repayment.service';
import { RepaymentController } from './repayment.controller';
import { StrategyService } from './strategy.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RepaymentController],
  providers: [RepaymentService, StrategyService],
})
export class RepaymentModule {}
