import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('risk-heatmap')
  getRiskHeatmap() {
    return this.adminService.getRiskHeatmap();
  }

  @Get('bnpl-analytics')
  getBnplAnalytics() {
    return this.adminService.getBnplAnalytics();
  }
}
