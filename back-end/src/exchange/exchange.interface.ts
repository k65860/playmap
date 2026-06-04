export class ExchangeItem {
  ECITM_SQ: number;
  ECITM_NM: string;
  ECITM_CN: string;
  ECITM_JOIN_CNT: number;
  ECITM_STOP: number;
  DEL_DT: string;
  MOD_DT: string;
  CRT_DT: string;
}

export class ExchangeHistory {
  ECHIS_SQ: number;
  USR_SQ: number;
  USR_NM: string;
  ECITM_SQ: number;
  ECITM_NM: string;
  USR_BFR_JOIN_CNT: number;
  USR_AFT_JOIN_CNT: number;
  DEL_DT: string;
  MOD_DT: string;
  CRT_DT: string;
}
