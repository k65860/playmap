import { Module } from '@nestjs/common';
import { CharacterDao } from './character.dao';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [],
  providers: [CharacterDao],
  exports: [CharacterDao],
})
export class CharacterModule {}
