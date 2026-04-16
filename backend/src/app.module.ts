import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { DebtsModule } from './debts/debts.module';
import { RepaymentModule } from './repayment/repayment.module';
import { RulesModule } from './rules/rules.module';
import { HealthScoreModule } from './health-score/health-score.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { MlModule } from './ml/ml.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    DebtsModule,
    RepaymentModule,
    RulesModule,
    HealthScoreModule,
    NotificationsModule,
    AdminModule,
    AiModule,
    MlModule,
    SettingsModule,
  ],
})
export class AppModule {}
