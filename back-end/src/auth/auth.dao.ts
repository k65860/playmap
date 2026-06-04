import { db } from 'asset/functions';
import { GetAllMemberDto, SignupDto, UpdateUserDto } from './auth.dto';
import { generateCode } from 'asset/utils';
import { User } from './auth.interface';
import config from 'asset/config';

export class AuthDao {
  public getAllMember(
    USR_SQ: number = 0,
    { USR_JOIN_CD = '' }: GetAllMemberDto = { USR_JOIN_CD: '' },
  ) {
    const query = `
      SELECT * 
      FROM TB_USER
      WHERE DEL_DT IS NULL
        AND (0 = ? OR USR_SQ = ?)
        AND (? > 0 OR USR_TP = 2)
        AND ('' = ? OR USR_JOIN_CD = ?)
      ORDER BY USR_SQ DESC
    `;
    return db<User[]>(query, [
      USR_SQ,
      USR_SQ,
      USR_SQ,
      USR_JOIN_CD,
      USR_JOIN_CD,
    ]);
  }

  public signin(USR_ID: string, USR_PW: string) {
    const query = `
      SELECT * 
      FROM TB_USER
      WHERE USR_ID = ?
        AND USR_PW = SHA(?)
        AND DEL_DT IS NULL
      LIMIT 1
    `;
    return db<User[]>(query, [USR_ID, USR_PW]);
  }

  public signup(body: SignupDto) {
    const query = `
      INSERT INTO TB_USER (
        USR_TP, USR_NM, USR_ID, USR_PW, 
        USR_NO, USR_MAIL, USR_JOIN_CD, 
        USR_ADDR, USR_ADDR_DTL
      ) VALUES (
        ?, ?, ?, SHA(?), 
        ?, ?, ?, 
        ?, ?
      );

      SET @USR_SQ = LAST_INSERT_ID();

      SELECT @USR_SQ AS USR_SQ;

      # 테스트 기간 동안만 적용 (회원가입 시 쿠폰 1장 발급)
      # INSERT INTO TB_USER_COUPON (
      #   CPN_GET_TP, USR_SQ, JOIN_USR_SQ
      # ) VALUES (3, @USR_SQ, 0);
    `;
    return db(query, [
      body?.USR_TP,
      body?.USR_NM,
      body?.USR_ID,
      body?.USR_PW,
      body?.USR_NO,
      body?.USR_MAIL,
      body?.USR_TP === 1 ? null : generateCode(12),
      body?.USR_ADDR,
      body?.USR_ADDR_DTL,
    ]);
  }

  public updateUser(USR_SQ: number, body: UpdateUserDto) {
    const keys = Object.keys(body);
    if (!keys?.length) return;

    const query = `
      UPDATE TB_USER
      SET ${keys.map((k) => `${k} = ?`).join(', ')}
      WHERE USR_SQ = ?
    `;
    return db(query, [...keys?.map((k) => body[k]), USR_SQ]);
  }

  public signout(USR_SQ: number) {
    const query = `
      UPDATE TB_USER
      SET DEL_DT = NOW()
      WHERE USR_SQ = ?
    `;
    return db(query, [USR_SQ]);
  }

  public findByUserJoinCode(USR_JOIN_CD: string) {
    const query = `
      SELECT *
      FROM TB_USER
      WHERE USR_JOIN_CD = ?
        AND USR_TP = 2
        AND DEL_DT IS NULL
      LIMIT 1
    `;
    return db<User[]>(query, [USR_JOIN_CD]);
  }

  public successSignin(USR_SQ: number) {
    const query = `
      UPDATE TB_USER
      SET USR_LAST_DT = NOW()
      WHERE USR_SQ = ?
    `;
    return db(query, [USR_SQ]);
  }

  public findId(USR_MAIL: string, USR_NO: string) {
    const query = `
      SELECT *,
        IF(
          USR_PW = SHA('${config.SNS_LOGIN_TYPE[0]}'), 
          1, 0
        ) AS IS_SNS_KAKAO
      FROM TB_USER
      WHERE DEL_DT IS NULL
        AND USR_MAIL = ?
        AND USR_NO = ?
      ORDER BY USR_SQ DESC
    `;
    return db<(User & { IS_SNS_KAKAO: 0 | 1 })[]>(query, [USR_MAIL, USR_NO]);
  }

  public updatePassword(USR_SQ: number, USR_PW: string) {
    const query = `
      UPDATE TB_USER
      SET USR_PW = SHA(?)
      WHERE USR_SQ = ?
    `;
    return db(query, [USR_PW, USR_SQ]);
  }

  public pwCheck(USR_SQ: number, USR_PW: string) {
    const query = `
      SELECT *
      FROM TB_USER
      WHERE USR_SQ = ?
        AND USR_PW = SHA(?)
        AND DEL_DT IS NULL
      LIMIT 1
    `;
    return db<User[]>(query, [USR_SQ, USR_PW]);
  }

  public getDuplicateId(USR_ID: string) {
    const query = `
      SELECT COUNT(*) AS CNT FROM TB_USER 
      WHERE USR_ID = ? AND DEL_DT IS NULL
    `;
    return db<[{ CNT: number }]>(query, [USR_ID]);
  }
}
