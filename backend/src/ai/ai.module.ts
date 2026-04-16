import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { AiController } from './ai.controller';
import { PrismaModule } from '../prisma.module';
import { DebtsModule } from '../debts/debts.module';
import { HealthScoreModule } from '../health-score/health-score.module';

@Module({
  imports: [PrismaModule, DebtsModule, HealthScoreModule],
  controllers: [AiController],
  providers: [CoachService],
})
export class AiModule {}
