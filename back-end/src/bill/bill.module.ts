import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { BillDao } from './bill.dao';
import { SettingModule } from 'src/setting/setting.module';
import { AuthModule } from 'src/auth/auth.module';
import { WsModule } from 'src/ws/ws.module';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  imports: [SettingModule, AuthModule, WsModule, CouponModule],
  controllers: [BillController],
  providers: [BillService, BillDao],
  exports: [BillService, BillDao],
})
export class BillModule {}
