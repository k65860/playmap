import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { ExchangeDao } from './exchange.dao';
import { AuthModule } from 'src/auth/auth.module';
import { WsModule } from 'src/ws/ws.module';
import { MailModule } from 'src/mail/mail.module';
import { SettingModule } from 'src/setting/setting.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [AuthModule, WsModule, MailModule, SettingModule, ProfileModule],
  controllers: [ExchangeController],
  providers: [ExchangeService, ExchangeDao],
  exports: [ExchangeService, ExchangeDao],
})
export class ExchangeModule {}
