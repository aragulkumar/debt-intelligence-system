import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { DebtsService } from '../debts/debts.service';
import { HealthScoreService } from '../health-score/health-score.service';
// import Anthropic from '@anthropic-ai/sdk'; // Mocking Anthropic to avoid actual API calls in tests

@Injectable()
export class CoachService {
  // private anthropic: Anthropic;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private debtsService: DebtsService,
    private healthScoreService: HealthScoreService
  ) {
    // this.anthropic = new Anthropic({
    //  apiKey: this.configService.get('ANTHROPIC_API_KEY'),
    // });
  }

  async getAdvice(userId: string, message: string, history: any[]) {
    const summary = await this.debtsService.getSummary(userId);
    const health = await this.healthScoreService.calculateScore(userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const totalEmi = summary.totalMonthlyEmi;
    const emiPercent = user?.monthlyIncome ? ((totalEmi / user.monthlyIncome) * 100).toFixed(1) : 0;

    const systemPrompt = `
You are a personal debt advisor for this user.
Their current debt summary: ${JSON.stringify(summary)}
Their health score: ${health.score}/100
Their monthly EMI load: ₹${totalEmi} (${emiPercent}% of income)

Give specific, actionable advice. Keep responses under 150 words.
Do not give generic finance tips — always refer to their actual numbers.
`;

    /* Mock API call to Anthropic for the sake of the repo scaffolding */
    return { 
      reply: `I see your EMI load is at ${emiPercent}%. With your health score of ${health.score}, you should focus on paying off your high-interest cards first. Can I help organize a snowball strategy?` 
    };

    /* Real implementation snippet:
    const msg = await this.anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        ...history,
        { role: "user", content: message }
      ]
    });
    return { reply: msg.content[0].text };
    */
  }
}
