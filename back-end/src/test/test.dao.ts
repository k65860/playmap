import { db } from 'asset/functions';
import { TestCategory, TestResult, TestType, UserTest } from './test.interface';

export class TestDao {
  public getAllTestType(TEST_TP_SQ: number = 0) {
    const query = `
      SELECT * FROM DTB_TEST_TYPE
      WHERE DEL_DT IS NULL
        AND (0 = ? OR TEST_TP_SQ = ?)
      ORDER BY TEST_TP_SQ;
    `;
    return db<TestType[]>(query, [TEST_TP_SQ, TEST_TP_SQ]);
  }

  public getAllTestCategory(TEST_TP_SQ: number) {
    const query = `
      SELECT * FROM DTB_TEST_CATEGORY
      WHERE DEL_DT IS NULL
        AND TEST_TP_SQ = ?
      ORDER BY TEST_CTGR_SQ;
    `;
    return db<TestCategory[]>(query, [TEST_TP_SQ]);
  }

  public getAllUserTest(TEST_SQ: number = 0) {
    const query = `
      SELECT a.*, c.USR_SQ 
      FROM TB_TEST a
      LEFT JOIN TB_PROFILE b
        ON b.PRF_SQ = a.PRF_SQ
      LEFT JOIN TB_USER c
        ON c.USR_SQ = b.USR_SQ
      WHERE a.DEL_DT IS NULL
        AND (0 = ? OR a.TEST_SQ = ?)
      ORDER BY a.TEST_SQ DESC
    `;
    return db<UserTest[]>(query, [TEST_SQ, TEST_SQ]);
  }

  public getAllUserTestByProfile(PRF_SQ: number) {
    const query = `
      SELECT * FROM TB_TEST
      WHERE DEL_DT IS NULL
        AND PRF_SQ = ?
      ORDER BY TEST_SQ DESC
    `;
    return db<UserTest[]>(query, [PRF_SQ]);
  }

  public getAllUserTestResult(TEST_SQ: number) {
    const query = `
      SELECT b.TEST_CTGR_SQ, d.TEST_CTGR_NM, 
        SUM(c.TEST_QSTN_ITM_PNT) AS TEST_CTGR_PNT
      FROM TB_TEST_RESPONSE a
      LEFT JOIN DTB_TEST_QUESTION b
        ON b.TEST_QSTN_SQ = a.TEST_QSTN_SQ
      LEFT JOIN DTB_TEST_QUESTION_ITEM c
        ON c.TEST_QSTN_ITM_SQ = a.TEST_QSTN_ITM_SQ
      LEFT JOIN DTB_TEST_CATEGORY d
        ON d.TEST_CTGR_SQ = b.TEST_CTGR_SQ
      WHERE a.DEL_DT IS NULL
        AND a.TEST_SQ = ?
      GROUP BY b.TEST_CTGR_SQ
    `;
    return db<TestResult[]>(query, [TEST_SQ]);
  }

  public createUserTestReview(TEST_SQ: number, TEST_RVW: string) {
    const query = `
      UPDATE TB_TEST
      SET TEST_RVW = ?
      WHERE TEST_SQ = ?
    `;
    return db(query, [TEST_RVW, TEST_SQ]);
  }

  public updateTestCharactor(TEST_SQ: number, CHAR_SQ: number) {
    const query = `
      UPDATE TB_TEST SET CHAR_SQ = ? WHERE TEST_SQ = ?;
    `;
    return db(query, [CHAR_SQ, TEST_SQ]);
  }
}
