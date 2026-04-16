import { Controller, Post, Body, Req } from '@nestjs/common';
import { CoachService } from './coach.service';

@Controller('ai')
export class AiController {
  constructor(private readonly coachService: CoachService) {}

  private getUserId(req: any) {
    return req.headers['x-user-id'] || 'dummy-user-id';
  }

  @Post('chat')
  chat(@Req() req: any, @Body() body: { message: string, conversation_history: any[] }) {
    return this.coachService.getAdvice(this.getUserId(req), body.message, body.conversation_history || []);
  }
}
