import { Module } from '@nestjs/common';
import { PlayDao } from './play.dao';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [],
  providers: [PlayDao],
  exports: [PlayDao],
})
export class PlayModule {}
