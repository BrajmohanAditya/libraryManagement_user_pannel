import { Module } from '@nestjs/common';
import { LibrarysService } from './librarys.service';
import { LibrarysController } from './librarys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library])],
  controllers: [LibrarysController],
  providers: [LibrarysService],
})
export class LibrarysModule {}
