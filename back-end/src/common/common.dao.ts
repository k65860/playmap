import { db } from 'asset/functions';
import { Common, ProfileCharacter } from './common.interface';

export class CommonDao {
  public getAllCode(CC_GRP: string = '') {
    const query = `
      SELECT * FROM DTB_COMMON
      WHERE ('' = ? OR CC_GRP = ?)
        AND DEL_DT IS NULL
      ORDER BY CC_GRP, CC_CD;
    `;
    return db<Common[]>(query, [CC_GRP, CC_GRP]);
  }

  public getAllProfileCharacter() {
    const query = `
      SELECT * FROM DTB_PROFILE_CHARACTER
      WHERE DEL_DT IS NULL
      ORDER BY PRF_CHAR_SQ;
    `;
    return db<ProfileCharacter[]>(query, []);
  }

  public getAllReview() {
    const query = `
      SELECT a.TEST_SQ, 
        a.TEST_RVW, b.TEST_TP_NM, 
        c.PRF_NM, d.CHAR_IMG_PATH,
        a.CRT_DT, a.MOD_DT
      FROM TB_TEST a
      LEFT JOIN DTB_TEST_TYPE b
        ON b.TEST_TP_SQ = a.TEST_TP_SQ
      LEFT JOIN TB_PROFILE c
        ON c.PRF_SQ = a.PRF_SQ
      LEFT JOIN DTB_CHARACTER d
        ON d.CHAR_SQ = a.CHAR_SQ
      WHERE a.DEL_DT IS NULL
        AND a.TEST_RVW IS NOT NULL
        AND a.TEST_RVW <> ''
      ORDER BY a.TEST_SQ DESC;
    `;
    return db<ProfileCharacter[]>(query, []);
  }
}
