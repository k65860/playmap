import { Character } from 'src/character/character.interface';
import { Play } from 'src/play/play.interface';

export class TestType {
  TEST_TP_SQ: number;
  TEST_TP_NM: string;
  TEST_TP_CN: string;
  TEST_TP_MAX_PNT: number;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
}

export class TestCategory {
  TEST_CTGR_SQ: number;
  TEST_TP_SQ: number;
  TEST_CTGR_NM: string;
  TEST_CTGR_CN: string;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
}

export class TestQuestion {
  TEST_QSTN_SQ: number;
  TEST_CTGR_SQ: number;
  TEST_QSTN_NM: string;
  TEST_QSTN_ITM_GRP: number;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
}

export class TestQuestionItem {
  TEST_QSTN_ITM_SQ: number;
  TEST_QSTN_SQ: number;
  TEST_QSTN_ITM_NM: string;
  TEST_QSTN_ITM_PNT: number;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
}

export class TestResult {
  TEST_CTGR_SQ: number;
  TEST_CTGR_NM: string;
  TEST_CTGR_PNT: number;
}

export class UserTest extends TestType {
  TEST_SQ: number;
  TEST_TP_SQ: number;
  PRF_SQ: number;
  USR_SQ: number;
  TEST_RVW: string;
  CRT_DT: string;
  MOD_DT: string;
  DEL_DT: string;
  USE_CPN: boolean;
  CATEGORY: TestResult[];
  CHARACTER: Character[];
  PLAY: Play[];
}
