import { Module } from '@nestjs/common';
import { HealthScoreService } from './health-score.service';
import { HealthScoreController } from './health-score.controller';
import { PrismaModule } from '../prisma.module';
import { DebtsModule } from '../debts/debts.module';

@Module({
  imports: [PrismaModule, DebtsModule],
  controllers: [HealthScoreController],
  providers: [HealthScoreService],
  exports: [HealthScoreService]
})
export class HealthScoreModule {}
