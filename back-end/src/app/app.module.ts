import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import config from 'asset/config';
import { AuthModule } from '../auth/auth.module';
import { WsModule } from 'src/ws/ws.module';
import { SettingModule } from 'src/setting/setting.module';
import { ProfileModule } from 'src/profile/profile.module';
import { CharacterModule } from 'src/character/character.module';
import { TestModule } from 'src/test/test.module';
import { CouponModule } from 'src/coupon/coupon.module';
import { PlayModule } from 'src/play/play.module';
import { DevModule } from 'src/dev/dev.module';
import { MailModule } from 'src/mail/mail.module';
import { BillModule } from 'src/bill/bill.module';
import { GptModule } from 'src/gpt/gpt.module';
import { MusicModule } from 'src/music/music.module';
import { ExchangeModule } from 'src/exchange/exchange.module';

const imports = [
  ServeStaticModule.forRoot(...config.STATIC_PATH),
  AuthModule,
  CommonModule,
  MailModule,
  CharacterModule,
  PlayModule,
  CouponModule,
  TestModule,
  ProfileModule,
  SettingModule,
  BillModule,
  GptModule,
  MusicModule,
  ExchangeModule,
  DevModule,
];

if (config.SERVER.USE_WS) {
  imports.push(WsModule);
}

@Module({ imports })
export class AppModule {}
