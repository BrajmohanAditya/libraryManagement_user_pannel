import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post('create-order')
  createOrder(
    @Body()
    createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.createOrder(createBookingDto);
  }

  @Post('verify-payment')
  verifyPayment(
    @Body()
    verifyPaymentDto: VerifyPaymentDto,
  ) {
    return this.bookingsService.verifyPayment(verifyPaymentDto);
  }

  @Get()
  finall() {
    return this.bookingsService.findAll()
  }

  @Get('user')
  findUserBookings(
    @Req() req: any
  ) {

    const id = req.user.id;
    return this.bookingsService.findUserById(id);
  }
}
