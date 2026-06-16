import { CreateBookingDto } from './create-booking.dto';

export class VerifyPaymentDto {

  razorpay_order_id!: string;

  razorpay_payment_id!: string;

  razorpay_signature!: string;

  bookingData!: CreateBookingDto;
}