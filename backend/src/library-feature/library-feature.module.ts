import { Module } from '@nestjs/common';
import { LibraryFeatureService } from './library-feature.service';
import { LibraryFeatureController } from './library-feature.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryFeature } from './entities/library-feature.entity';

@Module({
  imports :[TypeOrmModule.forFeature([LibraryFeature])] ,
  controllers: [LibraryFeatureController],
  providers: [LibraryFeatureService],
})
export class LibraryFeatureModule {}
