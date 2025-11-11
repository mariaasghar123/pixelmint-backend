import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ Add this
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PixelsModule } from './pixels/pixels.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { AdsController } from './ads/ads.controller';
import { AdsService } from './ads/ads.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ so you don’t need to import in every module
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    PixelsModule,
  ],
  controllers: [AppController, UsersController, AdminController, PaymentsController, AdsController],
  providers: [AppService, UsersService, AdminService, PaymentsService, AdsService],
})
export class AppModule {}
