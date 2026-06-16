import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { LibrarysModule } from './librarys/librarys.module';
import { SheetsModule } from './sheets/sheets.module';
import { BookingsModule } from './bookings/bookings.module';
import { LibraryPriceModule } from './library_price/library_price.module';
import { LibraryFeatureModule } from './library-feature/library-feature.module';
import { FeedbackModule } from './feedback/feedback.module';
import { BannerModule } from './banner/banner.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    UsersModule,
    LibrarysModule,
    SheetsModule,
    BookingsModule,
    LibraryPriceModule,
    LibraryFeatureModule,
    FeedbackModule,
    BannerModule,
    SettingsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'users/login',
          method: RequestMethod.POST,
        },
        {
          path: 'users/signup',
          method: RequestMethod.POST,
        },
        {
          path: '/',
          method: RequestMethod.GET,
        },
        {
          path: 'banner',
          method: RequestMethod.GET,
        },
        {
          path: 'dashboard',
          method: RequestMethod.GET,
        },
        {
          path: 'librarys',
          method: RequestMethod.GET,
        },
        {
          path: 'librarys/(.*)',
          method: RequestMethod.GET,
        },
        {
          path: '/feedback/(.*)',
          method: RequestMethod.GET,
        },
        {
          path: '/sheets/(.*)',
          method: RequestMethod.GET,
        }
      )
      .forRoutes('*');
  }
}
