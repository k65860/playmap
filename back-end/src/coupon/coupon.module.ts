import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponDao } from './coupon.dao';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [CouponController],
  providers: [CouponService, CouponDao],
  exports: [CouponService, CouponDao],
})
export class CouponModule {}
