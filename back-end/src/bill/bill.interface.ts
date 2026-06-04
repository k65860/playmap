export class BillResult {
  BILL_SQ: number;
  USR_SQ: number;
  USR_ID: string;
  USR_NO: string;
  BILL_ID: string;
  BILL_NM: string;
  BILL_PRC: number;
  BILL_MEMBER: string;
  BILL_MERCHANT: string;
  BILL_EXPR_DT: string;
  BILL_URL: string;
  BILL_CPN_CNT: number;
  PYMT_SQ: number;
  PYMT_TP: string;
  PYMT_CRD_TP: string;
  PYMT_CRD_NM: string;
  PYMT_CRD_NO: string;
  BILL_CRT_DT: string;
  PYMT_CRT_DT: string;
  BILL_DEL_DT: string;
  PYMT_DEL_DT: string;
  JOIN_GET_USR_SQ: number;
}

export class Bill {
  BILL_SQ: number;
  USR_SQ: number;
  BILL_ID: string;
  BILL_MEMBER: string;
  BILL_MERCHANT: string;
  BILL_NM: string;
  BILL_MSG: string;
  BILL_MBR_NM: string;
  BILL_PHN_NO: string;
  BILL_PRC: number;
  BILL_CLBK_URL: string;
  BILL_EXPR_DT: string;
  BILL_URL: string;
  BILL_CPN_CNT: number;
  PYMT_SQ: number;
  JOIN_GET_USR_SQ: number;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
}

export class Payment {
  PYMT_SQ: number;
  BILL_SQ: number;
  PYMT_TP: string;
  PYMT_CRD_TP: string;
  PYMT_CRD_NM: string;
  PYMT_CRD_NO: string;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
}
