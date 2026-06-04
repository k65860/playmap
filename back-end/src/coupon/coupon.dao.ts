import { db } from 'asset/functions';
import { UserCoupon } from './coupon.interface';
import { UserJoinHistory } from 'src/auth/auth.interface';

export class CouponDao {
  public getAllUserCoupon(USR_SQ: number) {
    const query = `
      SELECT a.*, b.USE_CPN_SQ, 
        b.TEST_SQ, b.CRT_DT AS USE_CPN_DT,
        d.PRF_SQ, d.PRF_NM
      FROM TB_USER_COUPON a
      LEFT JOIN TB_USE_COUPON b
        ON b.USR_CPN_SQ = a.USR_CPN_SQ
      LEFT JOIN TB_TEST c
        ON c.TEST_SQ = b.TEST_SQ
      LEFT JOIN TB_PROFILE d
        ON d.PRF_SQ = c.PRF_SQ
      WHERE a.DEL_DT IS NULL
        AND a.USR_SQ = ?
      ORDER BY a.USR_CPN_SQ DESC
    `;
    return db<UserCoupon[]>(query, [USR_SQ]);
  }

  /** CPN_GET_TP (1 - 구매 / 2 - 추천인 / 3 - 무료) */
  public createUserCoupon(
    CPN_GET_TP: number,
    USR_SQ: number,
    JOIN_USR_SQ: number,
  ) {
    const query = `
      INSERT INTO TB_USER_COUPON (
        CPN_GET_TP, USR_SQ, JOIN_USR_SQ
      ) VALUES (
        ?, ?, ?
      )
    `;
    return db(query, [CPN_GET_TP, USR_SQ, JOIN_USR_SQ]);
  }

  getUserCouponJoinHistory(USR_SQ: number) {
    const query = `
      SELECT *
      FROM TB_JOIN_CODE_HISTORY
      WHERE GET_USR_SQ = ?
        AND DEL_DT IS NULL
      ORDER BY JOIN_CD_HIS_SQ DESC
    `;
    return db<UserJoinHistory[]>(query, [USR_SQ]);
  }

  createUserCouponJoinHistory(JOIN_USR_SQ: number, GET_USR_SQ: number) {
    const query = `
      INSERT INTO TB_JOIN_CODE_HISTORY (
        JOIN_USR_SQ, GET_USR_SQ
      ) VALUES (?, ?);

      UPDATE TB_USER
      SET USR_JOIN_CNT = USR_JOIN_CNT + 1
      WHERE USR_SQ = ?;
    `;
    return db(query, [JOIN_USR_SQ, GET_USR_SQ, GET_USR_SQ]);
  }

  createUseCoupon(USR_CPN_SQ: number, TEST_SQ: number) {
    const query = `
      INSERT INTO TB_USE_COUPON (
        USR_CPN_SQ, TEST_SQ
      ) VALUES (
        ?, ?
      )
    `;
    return db(query, [USR_CPN_SQ, TEST_SQ]);
  }

  giveCoupon(USR_SQ: number, USR_CPN_SQ_LIST: number[]) {
    const query = `
      UPDATE TB_USER_COUPON
      SET CPN_GET_TP = 4,
          USR_SQ = ?,
          JOIN_USR_SQ = 0
      WHERE USR_CPN_SQ IN (${USR_CPN_SQ_LIST});
    `;
    return db(query, [USR_SQ]);
  }
}
