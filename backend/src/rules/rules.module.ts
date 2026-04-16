import { Module } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RulesController],
  providers: [RuleEngineService, RulesService],
  exports: [RuleEngineService]
})
export class RulesModule {}
