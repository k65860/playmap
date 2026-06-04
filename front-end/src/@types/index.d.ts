declare module "*.gif";
declare module "*.json";
declare module "*.png";
declare module "*.svg";
declare module "*.jpg";
declare module "*.css";
declare module "*.scss";
declare module "*.webp";

declare const Kakao: any;

// 공통
namespace Common {
  // 로그인 유저
  interface User {
    USR_SQ: number;
    USR_TP: number;
    USR_ID: string;
    USR_PW: string;
    USR_PW_CFM: string;
    USR_NM: string;
    USR_ADDR_DTL: string;
    USR_NO: string;
    USR_MAIL: string;
    ADM_JOIN_CD: string;
    USR_ADDR: string;
    USR_LAST_DT: string;
    CRT_DT?: string;
    MOD_DT?: string;
    DEL_DT?: string;
    USR_JOIN_CD: string;
    USR_JOIN_CNT: number;
    USR_JOIN_HISTORY: UserJoinHistory[];
    USR_CHILD_CNT: number;
  }

  interface UserJoinHistory {
    JOIN_CD_HIS_SQ: number;
    JOIN_USR_SQ: number;
    GET_USR_SQ: number;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
  }

  interface Profile {
    PRF_SQ: number;
    USR_SQ: number;
    PRF_NM: string;
    USR_NO: string;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
  }

  interface Setting {
    SET_SQ: number;
    SET_GRP: string;
    SET_GRP_NM: string;
    SET_VAL: string;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
  }

  interface Download {
    CC_SQ: number;
    CC_GRP: string;
    CC_CD: number;
    CC_NM: string;
    CC_DESC: string;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
  }

  interface Review {
    TEST_SQ: number;
    TEST_RVW: string;
    TEST_TP_NM: string;
    PRF_NM: string;
    CHAR_IMG_PATH: string;
    CRT_DT: string;
    MOD_DT: string;
  }

  interface Character {
    CHAR_SQ: number;
    CHAR_NM: string;
    CHAR_STDD: string;
    CHAR_DESC: string;
    CHAR_IMG_PATH: string;
    CHAR_BGM_PATH: string;
    CHAR_STRONG: string;
    CHAR_WEAK: string;
    CRT_DT: string;
    DEL_DT: string;
    MOD_DT: string;
  }
}

interface Coupon {
  USR_CPN_SQ: number;
  CPN_GET_TP: number;
  USR_SQ: number;
  JOIN_USR_SQ: number;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
  USE_CPN_SQ: number;
  TEST_SQ: number;
  USE_CPN_DT: string;
  PRF_SQ: number;
  PRF_NM: string;
}

namespace Test {
  interface Test {
    TEST_TP_SQ: number;
    TEST_TP_NM: string;
    TEST_TP_CN: string;
    TEST_TP_MAX_PNT: number;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
    CATEGORY: Category[];
  }
  interface Category {
    TEST_CTGR_SQ: number;
    TEST_TP_SQ: number;
    TEST_CTGR_NM: string;
    TEST_CTGR_CN: string;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
    QUESTION: Question[];
  }
  interface Question {
    TEST_QSTN_SQ: number;
    TEST_CTGR_SQ: number;
    TEST_QSTN_NM: string;
    TEST_QSTN_ITM_GRP: number;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
    QUESTION_ITEM: [];
  }
  interface QuestionItem {
    TEST_QSTN_ITM_SQ: number;
    TEST_QSTN_ITM_GRP: number;
    TEST_QSTN_ITM_NM: string;
    TEST_QSTN_ITM_PNT: number;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
    value?: number;
  }

  interface Type {
    TEST_TP_SQ: number;
    TEST_TP_NM: string;
    TEST_TP_CN: string;
    TEST_TP_MAX_PNT: number;
    CRT_DT: string;
    MOD_DT: string;
    DEL_DT: string;
  }

  interface History {
    CRT_DT: string;
    DEL_DT: null;
    MOD_DT: string;
    PRF_SQ: number;
    TEST_RVW: string;
    TEST_SQ: number;
    TEST_TP_SQ: number;
    USE_CPN: boolean;
  }
  interface HistoryDetail {
    CATEGORY: HistoryDetailCategory[];
    CHARACTER: HistoryDetailCharacter[];
    PLAY: HistoryDetailPlay[];
    CRT_DT: string;
    DEL_DT: string;
    MOD_DT: string;
    PRF_SQ: number;
    TEST_RVW: string;
    TEST_SQ: number;
    TEST_TP_CN: string;
    TEST_TP_MAX_PNT: number;
    TEST_TP_NM: string;
    TEST_TP_SQ: number;
    USE_CPN: boolean;
    USR_SQ: number;
  }
  interface HistoryDetailCategory {
    TEST_CTGR_SQ: number;
    TEST_CTGR_NM: string;
    TEST_CTGR_PNT: number;
  }
  interface HistoryDetailCharacter {
    CHAR_DESC: string;
    CHAR_IMG_PATH: string;
    CHAR_BGM_PATH: string;
    CHAR_NM: string;
    CHAR_PNT: number;
    CHAR_SQ: number;
    CHAR_STDD: string;
    CHAR_STRONG: string;
    CHAR_WEAK: string;
    CRT_DT: string;
    DEL_DT: string;
    MOD_DT: string;
  }
  interface HistoryDetailPlay {
    PLAY_SQ: number;
    PLAY_NM: string; // 놀이유형 이름
    PLAY_DESC: string; // 놀이유형 설명
    PLAY_IMG_PATH: string; // 놀이유형 이미지 경로
    PLAY_EPNTN: string; // 기질설명
    PLAY_FEAT: string; // 특징
    PLAY_STRONG: string; // 장점
    PLAY_WEAK: string; // 단점
    PLAY_GUIDE: string; // 수업지도안
    PLAY_GUIDE_IMG_PATH: string; // 수업지도안
    PLAY_HOME: string; // 집에서 할 수 있는 활동
    PLAY_HOME_IMG_PATH: string; // 집에서 할 수 있는 활동
    PLAY_LEARN: string; // 학습 방법
    PLAY_LEARN_IMG_PATH: string; // 학습 방법
    PLAY_PARENTS: string; // 부모님과 함께할 수 있는 활동
    PLAY_PARENTS_IMG_PATH: string; // 부모님과 함께할 수 있는 활동
    PLAY_PARENTS_MSG: string; // 부모님께 드리는 말씀
    PLAY_SPORTS: string; // 운동 종목 추천
    PLAY_SPORTS_IMG_PATH: string; // 운동 종목 추천
    PLAY_STDD: string; // 놀이유형 기준
    PLAY_PNT: number; // 점수
    CRT_DT: string;
    DEL_DT: string;
    MOD_DT: string;
  }

  // ! 설문제출타입
  interface Result {
    TEST_TP_SQ: number;
    PRF_SQ: number;
    ITEM_LIST: ResultItem[];
  }
  interface ResultItem {
    TEST_QSTN_SQ: number;
    TEST_QSTN_ITM_PNT: number;
    TEST_CTGR_SQ?: number; // 임의로 추가
    TEST_QSTN_ITM_SQ: number;
  }
}

interface Bill {
  BILL_SQ: number;
  USR_SQ: number;
  USR_ID: string;
  USR_NO: string;
  BILL_NM: string;
  BILL_ID: string;
  BILL_PRC: number;
  BILL_MEMBER: string;
  BILL_MERCHANT: string;
  BILL_EXPR_DT: string;
  BILL_URL: string;
  BILL_CPN_CNT: number;
  PYMT_SQ: number;
  PYMT_TP: "CARD_VAN";
  PYMT_CRD_TP: string;
  PYMT_CRD_NM: string;
  PYMT_CRD_NO: string;
  BILL_CRT_DT: string;
  PYMT_CRT_DT: string;
  BILL_DEL_DT: string;
  PYMT_DEL_DT: string;
}

interface Gpt {
  GPT_SQ: number;
  PRF_SQ: number;
  GPT_TP: number;
  GPT_CN: string;
  DEL_DT: string;
  MOD_DT: string;
  CRT_DT: string;
}

interface Music {
  MSC_SQ: number;
  CHAR_SQ: number;
  CHAR_NM: string;
  MSC_NM: string;
  MSC_PATH: string;
  DEL_DT: string;
  MOD_DT: string;
  CRT_DT: string;
}

namespace Exchange {
  interface Item {
    ECITM_SQ: number;
    ECITM_NM: string;
    ECITM_CN: string;
    ECITM_JOIN_CNT: number;
    ECITM_STOP: number;
    DEL_DT: string;
    MOD_DT: string;
    CRT_DT: string;
  }

  interface History {
    ECHIS_SQ: number;
    USR_SQ: number;
    USR_NM: string;
    ECITM_SQ: number;
    ECITM_NM: string;
    USR_BFR_JOIN_CNT: number;
    USR_AFT_JOIN_CNT: number;
    EC_DONE: number;
    DEL_DT: string;
    MOD_DT: string;
    CRT_DT: string;
  }
}
