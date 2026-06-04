import { db } from 'asset/functions';
import { Profile } from './profile.interface';

export class ProfileDao {
  public getAllProfile(USR_SQ: number = 0) {
    const query = `
      SELECT a.*, b.USR_NO 
      FROM TB_PROFILE a
      LEFT JOIN TB_USER b
        ON b.USR_SQ = a.USR_SQ
      WHERE (0 = ? OR a.USR_SQ = ?)
        AND a.DEL_DT IS NULL
        AND b.USR_SQ IS NOT NULL
      ORDER BY a.PRF_SQ DESC
    `;
    return db<Profile[]>(query, [USR_SQ, USR_SQ]);
  }

  public getOneProfile(PRF_SQ: number) {
    const query = `
      SELECT a.* FROM TB_PROFILE a
      WHERE a.PRF_SQ = ?
        AND a.DEL_DT IS NULL
      LIMIT 1;
    `;
    return db<Profile[]>(query, [PRF_SQ]);
  }

  public createProfile(USR_SQ: number, PRF_NM: string) {
    const query = `
      INSERT INTO TB_PROFILE (
        USR_SQ, PRF_NM
      ) VALUES (
        ?, ?
      )
    `;
    return db(query, [USR_SQ, PRF_NM]);
  }

  public updateProfile(USR_SQ: number, PRF_SQ: number, PRF_NM: string) {
    const query = `
      UPDATE TB_PROFILE SET
        PRF_NM = ?
      WHERE USR_SQ = ? AND PRF_SQ = ?
    `;
    return db(query, [PRF_NM, USR_SQ, PRF_SQ]);
  }

  public deleteProfile(USR_SQ: number, PRF_SQ: number) {
    const query = `
      UPDATE TB_PROFILE SET
        DEL_DT = NOW()
      WHERE USR_SQ = ? AND PRF_SQ = ?
    `;
    return db(query, [USR_SQ, PRF_SQ]);
  }
}
