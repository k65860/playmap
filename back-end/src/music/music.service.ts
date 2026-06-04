import { Injectable } from '@nestjs/common';
import { send } from 'asset/functions';
import { MusicDao } from './music.dao';
import { CharacterDao } from 'src/character/character.dao';
import { Character } from 'src/character/character.interface';

@Injectable()
export class MusicService {
  constructor(
    private readonly musicDao: MusicDao,
    private readonly charDao: CharacterDao,
  ) {}

  public async getAllMusic(CHAR_SQ_LIST: number[]) {
    const chars: Character[] = [];

    if (CHAR_SQ_LIST && !Array.isArray(CHAR_SQ_LIST)) {
      CHAR_SQ_LIST = [CHAR_SQ_LIST];
    }
    for (const CHAR_SQ of CHAR_SQ_LIST) {
      const { data: _chars } = await this.charDao.getAllCharacter(CHAR_SQ);
      if (_chars?.[0]) chars.push(_chars[0]);
    }

    const { data: musics = [] } = await this.musicDao.getAllMusic(CHAR_SQ_LIST);

    const result = {
      CHARACTER: chars ?? [],
      MUSIC: musics ?? [],
    };

    return send.success(result);
  }
}
