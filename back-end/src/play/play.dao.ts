import { db } from 'asset/functions';
import { Play, PlayStandard } from './play.interface';

export class PlayDao {
  public getAllPlay(PLAY_SQ: number = 0) {
    const query = `
      SELECT * FROM DTB_PLAY
      WHERE DEL_DT IS NULL
        AND (0 = ? OR PLAY_SQ = ?)
    `;
    return db<Play[]>(query, [PLAY_SQ, PLAY_SQ]);
  }

  public getAllPlayStandard() {
    const query = `
      SELECT * FROM DTB_PLAY_STANDARD
      WHERE DEL_DT IS NULL
    `;
    return db<PlayStandard[]>(query, []);
  }
}
