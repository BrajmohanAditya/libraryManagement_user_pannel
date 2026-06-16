import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sheet } from './entities/sheet.entity';
import { Library } from 'src/librarys/entities/library.entity';

@Module({
  imports :[TypeOrmModule.forFeature([Sheet , Library])],
  controllers: [SheetsController],
  providers: [SheetsService],
})
export class SheetsModule {}
