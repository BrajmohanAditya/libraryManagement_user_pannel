import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  async getDashboard(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.dashboardService.getDashboard(
      Number(lat),
      Number(lng),
      Number(page),
      Number(limit),
    );
  }
}