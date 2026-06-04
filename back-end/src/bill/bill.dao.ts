import { db } from 'asset/functions';
import { Bill, BillResult, Payment } from './bill.interface';

export class BillDao {
  public getAllBill(
    USR_SQ: number = 0,
    BILL_SQ: number = 0,
    BILL_ID: string = '',
  ) {
    const query = `
      SELECT
        a.BILL_SQ, a.USR_SQ, c.USR_ID, c.USR_NO,
        a.BILL_ID, a.BILL_NM, a.BILL_PRC,
        a.BILL_MEMBER, a.BILL_MERCHANT,
        a.BILL_EXPR_DT, a.BILL_URL, a.BILL_CPN_CNT,
        b.PYMT_SQ, b.PYMT_TP,
        b.PYMT_CRD_TP, b.PYMT_CRD_NM, b.PYMT_CRD_NO,
        a.CRT_DT AS BILL_CRT_DT, b.CRT_DT AS PYMT_CRT_DT,
        a.DEL_DT AS BILL_DEL_DT, b.DEL_DT AS PYMT_DEL_DT,
        a.JOIN_GET_USR_SQ
      FROM TB_BILL a
      LEFT JOIN TB_PAYMENT b
        ON b.BILL_SQ = a.BILL_SQ
      LEFT JOIN TB_USER c
        ON c.USR_SQ = a.USR_SQ
      WHERE (0 = ? OR a.USR_SQ = ?)
        AND (0 = ? OR a.BILL_SQ = ?)
        AND ('' = ? OR a.BILL_ID = ?)
      ORDER BY a.BILL_SQ DESC
    `;
    return db<BillResult[]>(query, [
      USR_SQ,
      USR_SQ,
      BILL_SQ,
      BILL_SQ,
      BILL_ID,
      BILL_ID,
    ]);
  }

  public createBill(body: Partial<Bill>) {
    const keys = Object.keys(body);
    if (!keys?.length) return;

    const query = `
      INSERT INTO TB_BILL (
        ${keys}
      ) VALUES (${keys.map(() => '?')})
    `;
    return db(query, [...keys?.map((k) => body[k])]);
  }

  public deleteBill(BILL_SQ: number) {
    const query = `
      UPDATE TB_BILL
      SET DEL_DT = NOW()
      WHERE BILL_SQ = ?
    `;
    return db(query, [BILL_SQ]);
  }

  public createPayment(body: Partial<Payment>) {
    const keys = Object.keys(body);
    if (!keys?.length) return;

    const query = `
      INSERT INTO TB_PAYMENT (
        ${keys}
      ) VALUES (${keys.map(() => '?')})
    `;
    return db(query, [...keys?.map((k) => body[k])]);
  }

  public getAllPayment(BILL_SQ: number = 0, PYMT_SQ: number = 0) {
    const query = `
      SELECT a.*
      FROM TB_PAYMENT a
      WHERE (0 = ? OR a.PYMT_SQ = ?)
        AND (0 = ? OR a.BILL_SQ = ?)
      ORDER BY a.PYMT_SQ DESC
    `;
    return db<Payment[]>(query, [PYMT_SQ, PYMT_SQ, BILL_SQ, BILL_SQ]);
  }

  public deletePayment(PYMT_SQ: number) {
    const query = `
      UPDATE TB_PAYMENT
      SET DEL_DT = NOW()
      WHERE PYMT_SQ = ?
    `;
    return db(query, [PYMT_SQ]);
  }
}
