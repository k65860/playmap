import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { GptDao } from './gpt.dao';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [GptController],
  providers: [GptService, GptDao],
  exports: [GptService, GptDao],
})
export class GptModule {}
