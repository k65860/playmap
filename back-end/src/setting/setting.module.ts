import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SettingDao } from './setting.dao';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [SettingController],
  providers: [SettingService, SettingDao],
  exports: [SettingService, SettingDao],
})
export class SettingModule {}
