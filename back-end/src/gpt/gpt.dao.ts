import { db } from 'asset/functions';
import { GptConfig, Gpt, GptKeyword } from './gpt.interface';

export class GptDao {
  public getGptToken() {
    const sql = `
      SELECT SET_VAL
      FROM DTB_SETTING
      WHERE SET_GRP = ?
        OR SET_GRP = ?
      ORDER BY SET_SQ
    `;
    return db<GptConfig[]>(sql, ['GPT_KEY', 'GPT_ORGANIZATION']);
  }

  public getAllGpt(PRF_SQ: number) {
    const sql = `
      SELECT * FROM TB_GPT
      WHERE PRF_SQ = ?
        AND DEL_DT IS NULL
      ORDER BY GPT_SQ
    `;
    return db<Gpt[]>(sql, [PRF_SQ]);
  }

  public getAllGptKeyword() {
    const sql = `
      SELECT * FROM DTB_GPT_KEYWORD
      WHERE DEL_DT IS NULL
      ORDER BY GPT_KWD_ODR, GPT_KWD_SQ
    `;
    return db<GptKeyword[]>(sql);
  }

  public createGpt(PRF_SQ: number, GPT_TP: 1 | 2, GPT_CN: string) {
    const sql = `
      INSERT INTO TB_GPT (
        PRF_SQ, GPT_TP, GPT_CN
      ) VALUES (?, ?, ?);
    `;
    return db(sql, [PRF_SQ, GPT_TP, GPT_CN]);
  }

  public deleteGpt(GPT_SQ: number) {
    const sql = `
      UPDATE TB_GPT SET
      DEL_DT = NOW()
      WHERE GPT_SQ = ?
    `;
    return db(sql, [GPT_SQ]);
  }
}
