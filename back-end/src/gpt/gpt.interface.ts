export interface GptConfig {
  SET_VAL: string;
}

export interface Gpt {
  GPT_SQ: number;
  PRF_SQ: number;
  GPT_TP: 1 | 2; // 1 - 요청, 2 - 응답
  GPT_CN: string;
  DEL_DT: string;
  MOD_DT: string;
  CRT_DT: string;
}

export interface GptKeyword {
  GPT_KWD_SQ: number;
  GPT_KWD_ODR: number;
  GPT_KWD_CN: string;
  DEL_DT: string;
  MOD_DT: string;
  CRT_DT: string;
}
