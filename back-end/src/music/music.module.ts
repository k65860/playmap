import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicDao } from './music.dao';
import { MusicController } from './music.controller';
import { CharacterModule } from 'src/character/character.module';

@Module({
  imports: [CharacterModule],
  controllers: [MusicController],
  providers: [MusicService, MusicDao],
  exports: [MusicService, MusicDao],
})
export class MusicModule {}
