import { db } from 'asset/functions';
import { Character, CharacterStandard } from './character.interface';

export class CharacterDao {
  public getAllCharacter(CHAR_SQ: number = 0) {
    const query = `
      SELECT * FROM DTB_CHARACTER
      WHERE DEL_DT IS NULL
        AND (0 = ? OR CHAR_SQ = ?)
      ORDER BY CHAR_SQ DESC
    `;
    return db<Character[]>(query, [CHAR_SQ, CHAR_SQ]);
  }

  public getAllCharacterStandard() {
    const query = `
      SELECT * FROM DTB_CHARACTER_STANDARD
      WHERE DEL_DT IS NULL
      ORDER BY CHAR_STDD_SQ DESC
    `;
    return db<CharacterStandard[]>(query, []);
  }
}
