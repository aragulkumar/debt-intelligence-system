import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RuleEngineService } from './rule-engine.service';

@Controller('rules')
export class RulesController {
  constructor(
    private readonly rulesService: RulesService,
    private readonly ruleEngineService: RuleEngineService
  ) {}

  private getUserId(req: any) {
    return req.headers['x-user-id'] || 'dummy-user-id';
  }

  @Get()
  findAll(@Req() req: any) {
    return this.rulesService.findAll(this.getUserId(req));
  }

  @Post()
  create(@Req() req: any, @Body() data: any) {
    return this.rulesService.create(this.getUserId(req), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.rulesService.remove(id, this.getUserId(req));
  }

  @Post('evaluate')
  evaluate(@Req() req: any) {
    return this.ruleEngineService.evaluateRules(this.getUserId(req));
  }
}
