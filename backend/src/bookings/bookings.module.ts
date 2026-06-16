import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { LibraryPrice } from 'src/library_price/entities/library_price.entity';
import { Sheet } from 'src/sheets/entities/sheet.entity';
import { Library } from 'src/librarys/entities/library.entity';
import { User } from 'src/users/entities/user.entity';
import { LibraryFeature } from 'src/library-feature/entities/library-feature.entity';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from 'src/settings/entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking , LibraryPrice , Sheet , Library , User , LibraryFeature ,Setting])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
