import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { Booking } from './entities/booking.entity';
import { LibraryPrice } from 'src/library_price/entities/library_price.entity';
import { Sheet } from 'src/sheets/entities/sheet.entity';
import { Library } from 'src/librarys/entities/library.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { LibraryFeature } from 'src/library-feature/entities/library-feature.entity';
import { Setting } from 'src/settings/entities/setting.entity';

@Injectable()
export class BookingsService {
  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(LibraryPrice)
    private readonly planRepo: Repository<LibraryPrice>,
    @InjectRepository(Sheet)
    private readonly sheetRepo: Repository<Sheet>,
    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(LibraryFeature)
    private readonly featureRepo: Repository<LibraryFeature>,
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }


  private async getLibraryPaymentConfig(libraryId: string) {
    const setting = await this.settingRepo.findOne({
      where: {
        libraryId,
      },
    });

    if (!setting) {
      throw new NotFoundException(
        'Payment configuration not found for this library',
      );
    }

    return setting;
  }

  private async getRazorpayInstance(
    libraryId: string,
  ): Promise<Razorpay> {
    const setting =
      await this.getLibraryPaymentConfig(
        libraryId,
      );

    return new Razorpay({
      key_id: setting.razorpayKeyId,
      key_secret: setting.razorpayKeySecret,
    });
  }

  async createOrder(dto: CreateBookingDto) {
    const plan = await this.planRepo.findOne({
      where: {
        id: dto.planId,
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const library = await this.libraryRepo.findOne({
      where: {
        id: dto.libraryId,
      },
    });

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    const sheet = await this.sheetRepo.findOne({
      where: {
        id: dto.sheetId,
      },
    });

    if (!sheet) {
      throw new NotFoundException('Sheet not found');
    }

    if (!sheet.isAvailable) {
      throw new BadRequestException(
        'Sheet already booked',
      );
    }

    const setting =
      await this.getLibraryPaymentConfig(
        dto.libraryId,
      );

    const razorpay =
      await this.getRazorpayInstance(
        dto.libraryId,
      );

    const order = await razorpay.orders.create({
      amount: Number(plan.price) * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    return {
      message: 'Order created successfully',
      order,
      razorpayKeyId: setting.razorpayKeyId,
      bookingData: dto,
    };
  }


  async verifyPayment(dto: VerifyPaymentDto) {
    const setting =
      await this.getLibraryPaymentConfig(
        dto.bookingData.libraryId,
      );

    const body =
      dto.razorpay_order_id +
      '|' +
      dto.razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        setting.razorpayKeySecret,
      )
      .update(body)
      .digest('hex');

    const isAuthentic =
      expectedSignature ===
      dto.razorpay_signature;

    if (!isAuthentic) {
      throw new BadRequestException(
        'Payment verification failed',
      );
    }

    const booking =
      await this.createBookingAfterPayment(
        dto.bookingData,
        dto.razorpay_payment_id,
      );

    return {
      message:
        'Payment verified successfully',
      data: booking,
    };
  }

  async createBookingAfterPayment(
    dto: CreateBookingDto,
    paymentId: string,
  ) {
    return await this.dataSource.transaction(async (manager) => {

      // PLAN
      const plan = await manager.findOne(LibraryPrice, {
        where: {
          id: dto.planId,
        },
      });

      if (!plan) {
        throw new NotFoundException('Plan not found');
      }

      // LOCK SHEET
      const sheet = await manager.findOne(Sheet, {
        where: {
          id: dto.sheetId,
        },

        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!sheet) {
        throw new NotFoundException('Sheet not found');
      }

      // CHECK AGAIN AFTER LOCK
      if (!sheet.isAvailable) {
        throw new BadRequestException('Sheet already booked');
      }

      // TIME
      const startTime = new Date();

      const endTime = new Date(startTime);

      if (plan.type === 'HOURS') {
        endTime.setHours(endTime.getHours() + plan.durationValue);
      }

      if (plan.type === 'DAYS') {
        endTime.setDate(endTime.getDate() + plan.durationValue);
      }

      if (plan.type === 'MONTH') {
        endTime.setMonth(endTime.getMonth() + plan.durationValue);
      }

      // CREATE BOOKING
      const booking = manager.create(Booking, {
        ...dto,


        status: 'ACTIVE',
        paymentStatus: 'SUCCESS',
        paymentId,
        bookingType: 'ONLINE',
      });

      const savedBooking = await manager.save(Booking, booking);

      // UPDATE SHEET
      sheet.isAvailable = false;

      await manager.save(Sheet, sheet);

      return savedBooking;
    });
  }


  async findAll() {
    const bookings = await this.bookingRepository.find()
    return {
      message: 'Bookings retrieved successfully',
      data: bookings,
    };
  }

  async findUserById(userId: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bookings = await this.bookingRepository.find({
      where: {
        userId,
      },
    });

    const formattedData = await Promise.all(
      bookings.map(async (booking) => {
        const sheet = await this.sheetRepo.findOne({
          where: {
            id: booking.sheetId,
          },
        });

        const plan = await this.planRepo.findOne({
          where: {
            id: booking.planId,
          },
        });

        const library = await this.libraryRepo.findOne({
          where: {
            id: booking.libraryId,
          },
        });

        const features = await this.featureRepo.find({
          where: {
            libraryId: booking.libraryId,
          },
        });

        return {
          booking: {
            bookingId: booking.id,
            bookingType: booking.bookingType,
            paymentId: booking.paymentId,
            status: booking.status,
            paymentStatus: booking.paymentStatus,

          },

          user: {
            userId: user.id,
            name: user.name,
            email: user.email,
            mobile: user.number,
          },

          library: library
            ? {
              libraryId: library.id,
              libraryName: library.name,
              address: library.address,
              city: library.city,
              state: library.state,
            }
            : null,

          sheet: sheet
            ? {
              sheetId: sheet.id,
              sheetNumber: sheet.sheetNumber,
              isAvailable: sheet.isAvailable,

            }
            : null,

          plan: plan
            ? {
              planId: plan.id,
              planName: plan.planName,
              type: plan.type,
              durationValue: plan.durationValue,
              price: plan.price,
              startTime: plan.startTime,
              endTime: plan.endTime
            }
            : null,

          features: features.map((item) => item.features),
          receipt: {
            receiptNumber: `RCPT-${booking.id.slice(0, 8)}`,
            bookingId: booking.id,
            bookingType: booking.bookingType,
            paymentId: booking.paymentId,
            userName: user.name,
            userEmail: user.email,
            userMobile: user.number,
            libraryName: library?.name,
            libraryAddress: library?.address,
            sheetNumber: sheet?.sheetNumber,
            planName: plan?.planName,
            duration: `${plan?.durationValue} ${plan?.type}`,
            amount: plan?.price,
            paymentStatus: booking.paymentStatus,
            bookingStatus: booking.status,

            generatedAt: new Date(),
          },
        };
      }),
    );

    return {
      message: 'User bookings retrieved successfully',
      totalBookings: formattedData.length,
      data: formattedData,
    };
  }

  async extendBooking(bookingId: string, planId: string, adminId: string) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('libraries', 'library', 'library.id = booking.libraryId')
      .where('booking.id = :bookingId AND library.adminId = :adminId', {
        bookingId,
        adminId,
      })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        'Booking not found or you do not have permission',
      );
    }

    const plan = await this.planRepo.findOne({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    if (booking.status !== 'ACTIVE') {
      throw new BadRequestException('Cannot extend inactive booking');
    }




    const updatedBooking = await this.bookingRepository.save(booking);

    return {
      message: 'Booking extended successfully',

      data: updatedBooking,
    };
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    adminId: string,
  ) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('libraries', 'library', 'library.id = booking.libraryId')
      .where('booking.id = :id AND library.adminId = :adminId', { id, adminId })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        'Booking not found or you do not have permission',
      );
    }

    await this.bookingRepository.update(id, updateBookingDto);

    return {
      message: 'Booking updated successfully',
    };
  }

  async remove(id: string, adminId: string) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('libraries', 'library', 'library.id = booking.libraryId')
      .where('booking.id = :id AND library.adminId = :adminId', { id, adminId })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        'Booking not found or you do not have permission',
      );
    }

    const sheet = await this.sheetRepo.findOne({
      where: {
        id: booking.sheetId,
      },
    });

    if (sheet) {
      sheet.isAvailable = true;

      await this.sheetRepo.save(sheet);
    }

    await this.bookingRepository.delete(id);

    return {
      message: 'Booking removed successfully',
    };
  }
}
