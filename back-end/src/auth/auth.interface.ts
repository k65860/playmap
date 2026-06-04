export class User {
  USR_SQ: number;
  USR_TP: number;
  USR_NM: string;
  USR_ID: string;
  USR_PW: string;
  USR_NO: string;
  USR_MAIL: string;
  USR_JOIN_CD: string;
  USR_JOIN_CNT: number;
  USR_ADDR: string;
  USR_ADDR_DTL: string;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
  USR_JOIN_HISTORY: UserJoinHistory[];
}

export class UserJoinHistory {
  JOIN_CD_HIS_SQ: number;
  JOIN_USR_SQ: number;
  GET_USR_SQ: number;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
}
