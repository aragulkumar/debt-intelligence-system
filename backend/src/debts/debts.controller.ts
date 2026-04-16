import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { DebtsService } from './debts.service';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  // Mocking userId for now since Auth is not fully implemented
  private getUserId(req: any) {
    // Return a dummy ID or extract from header in real implementation
    return req.headers['x-user-id'] || 'dummy-user-id';
  }

  @Post()
  create(@Req() req: any, @Body() createDebtDto: any) {
    return this.debtsService.create(this.getUserId(req), createDebtDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.debtsService.findAllForUser(this.getUserId(req));
  }

  @Get('summary')
  getSummary(@Req() req: any) {
    return this.debtsService.getSummary(this.getUserId(req));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() updateDebtDto: any) {
    return this.debtsService.update(id, this.getUserId(req), updateDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.debtsService.remove(id, this.getUserId(req));
  }
}
