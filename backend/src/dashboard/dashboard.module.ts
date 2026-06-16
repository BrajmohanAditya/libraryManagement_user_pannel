import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from 'src/librarys/entities/library.entity';
import { Banner } from 'src/banner/entities/banner.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';

@Module({
  imports :[TypeOrmModule.forFeature([Library , Banner , Feedback])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
