import { db } from 'asset/functions';
import { ExchangeHistory, ExchangeItem } from './exchange.interface';
import { ExecExchangeDto } from './exchange.dto';

export class ExchangeDao {
  public getAllExchangeItem(ECITM_SQ: number = 0) {
    const query = `
      SELECT *
      FROM TB_EXCHANGE_ITEM
      WHERE DEL_DT IS NULL
        AND (0 = ? OR ECITM_SQ = ?)
      ORDER BY ECITM_JOIN_CNT;
    `;
    return db<ExchangeItem[]>(query, [ECITM_SQ, ECITM_SQ]);
  }

  public getAllExchange(USR_SQ: number = 0) {
    const query = `
      SELECT a.*, b.USR_NM, c.ECITM_NM
      FROM TB_EXCHANGE_HISTORY a
      LEFT JOIN TB_USER b 
        ON a.USR_SQ = b.USR_SQ
      LEFT JOIN TB_EXCHANGE_ITEM c
        ON a.ECITM_SQ = c.ECITM_SQ
      WHERE a.DEL_DT IS NULL
        AND (0 = ? OR a.USR_SQ = ?)
      ORDER BY a.ECHIS_SQ DESC;
    `;
    return db<ExchangeHistory[]>(query, [USR_SQ, USR_SQ]);
  }

  public execExchange(
    { USR_SQ, ECITM_SQ }: ExecExchangeDto,
    ECITM_JOIN_CNT: number,
  ) {
    const query = `
      INSERT INTO TB_EXCHANGE_HISTORY (
        USR_SQ, ECITM_SQ, 
        USR_BFR_JOIN_CNT, USR_AFT_JOIN_CNT
      ) SELECT 
        USR_SQ, ?, 
        USR_JOIN_CNT, USR_JOIN_CNT - ? 
        FROM TB_USER
        WHERE USR_SQ = ?;

      UPDATE TB_USER
      SET USR_JOIN_CNT = USR_JOIN_CNT - ?
      WHERE USR_SQ = ?;
    `;
    return db(query, [
      ECITM_SQ,
      ECITM_JOIN_CNT,
      USR_SQ,
      ECITM_JOIN_CNT,
      USR_SQ,
    ]);
  }

  public execExchangeHistoryCheck(ECHIS_SQ: number) {
    const query = `
      UPDATE TB_EXCHANGE_HISTORY
      SET EC_DONE = IF(EC_DONE = 1, 0, 1)
      WHERE ECHIS_SQ = ?;
    `;
    return db(query, [ECHIS_SQ]);
  }
}
