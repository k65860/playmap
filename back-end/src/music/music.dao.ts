import { db } from 'asset/functions';
import { Music } from './music.interface';

export class MusicDao {
  public getAllMusic(CHAR_SQ_LIST: number[] = []) {
    if (CHAR_SQ_LIST && !Array.isArray(CHAR_SQ_LIST)) {
      CHAR_SQ_LIST = [CHAR_SQ_LIST];
    }
    const query = `
      SELECT a.*, b.CHAR_NM
      FROM DTB_MUSIC a
      LEFT JOIN DTB_CHARACTER b 
        ON a.CHAR_SQ = b.CHAR_SQ
      WHERE a.DEL_DT IS NULL
        AND a.CHAR_SQ IN (${CHAR_SQ_LIST?.length ? CHAR_SQ_LIST : -1})
      ORDER BY a.CHAR_SQ
    `;
    return db<Music[]>(query);
  }
}
