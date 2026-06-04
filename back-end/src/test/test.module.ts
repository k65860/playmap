import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TestDao } from './test.dao';
import { WsModule } from 'src/ws/ws.module';
import { ProfileModule } from 'src/profile/profile.module';
import { CouponModule } from 'src/coupon/coupon.module';
import { CharacterModule } from 'src/character/character.module';
import { PlayModule } from 'src/play/play.module';

@Module({
  imports: [WsModule, ProfileModule, CouponModule, CharacterModule, PlayModule],
  controllers: [TestController],
  providers: [TestService, TestDao],
  exports: [TestService, TestDao],
})
export class TestModule {}
