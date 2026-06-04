import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDao } from './auth.dao';
import { WsModule } from 'src/ws/ws.module';
import { ProfileModule } from 'src/profile/profile.module';
import { CommonModule } from 'src/common/common.module';
import { SettingModule } from 'src/setting/setting.module';
import { CouponModule } from 'src/coupon/coupon.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    WsModule,
    ProfileModule,
    CommonModule,
    SettingModule,
    CouponModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthDao],
  exports: [AuthService, AuthDao],
})
export class AuthModule {}
