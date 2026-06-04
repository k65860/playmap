import axios from "axios";
import moment from "moment";
import Notiflix from "notiflix";
import {
  hangulIncludes,
  chosungIncludes,
  disassembleHangul,
} from "@toss/hangul";
import { getDateDistance } from "@toss/date";
import { QS } from "@toss/utils";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const keyPositions = {
  ㅂ: "q",
  ㅈ: "w",
  ㄷ: "e",
  ㄱ: "r",
  ㅅ: "t",
  ㅛ: "y",
  ㅕ: "u",
  ㅑ: "i",
  ㅐ: "o",
  ㅔ: "p",
  ㅁ: "a",
  ㄴ: "s",
  ㅇ: "d",
  ㄹ: "f",
  ㅎ: "g",
  ㅗ: "h",
  ㅓ: "j",
  ㅏ: "k",
  ㅣ: "l",
  ㅋ: "z",
  ㅌ: "x",
  ㅊ: "c",
  ㅍ: "v",
  ㅠ: "b",
  ㅜ: "n",
  ㅡ: "m",
  q: "ㅂ",
  w: "ㅈ",
  e: "ㄷ",
  r: "ㄱ",
  t: "ㅅ",
  y: "ㅛ",
  u: "ㅕ",
  i: "ㅑ",
  o: "ㅐ",
  p: "ㅔ",
  a: "ㅁ",
  s: "ㄴ",
  d: "ㅇ",
  f: "ㄹ",
  g: "ㅎ",
  h: "ㅗ",
  j: "ㅓ",
  k: "ㅏ",
  l: "ㅣ",
  z: "ㅋ",
  x: "ㅌ",
  c: "ㅊ",
  v: "ㅍ",
  b: "ㅠ",
  n: "ㅜ",
  m: "ㅡ",
};

Notiflix.Notify.init({
  width: "320px",
  warning: {
    background: "#e1b530",
  },
  clickToClose: true,
  timeout: 5000,
  position: "right-bottom",
});

export const http = axios.create({
  baseURL: "/api",
  timeout: 6000 * 10,
});

http.interceptors.request.use(async (req) => {
  await delay(500);
  return req;
});
http.interceptors.response.use((res) => {
  res.data ??= {
    result: false,
    message: "서버와 연결이 끊어졌습니다.",
    data: null,
  };
  return res;
}, undefined);

export const getNow = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};

export const alert = {
  success(text: string, callback?: () => void) {
    Notiflix.Notify.success(text, callback);
  },
  error(text: string, callback?: () => void) {
    Notiflix.Notify.failure(text, callback);
  },
  warn(text: string, callback?: () => void) {
    Notiflix.Notify.warning(text, callback);
  },
  info(text: string, callback?: () => void) {
    Notiflix.Notify.info(text, callback);
  },
};

/**
 * @example
 * delay(3000);
 * // 3초 뒤 실행
 */
export const delay = async (
  ms: number,
  callback?: () => void
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      if (callback) callback();
    }, ms);
  });
};

/**
 * @example
 * phoneHyphen('01025560000');
 * // '010-2556-0000'
 * phoneHyphen('0215994905');
 * // '02-1599-4905'
 */
export const phoneHyphen = (phoneNumber: string | number): string => {
  return String(phoneNumber)
    .replace(/-/g, "")
    .replace(/[^0-9]/g, "")
    .replace(
      /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
      "$1-$2-$3"
    )
    .replace("--", "-");
};

/**
 * @example
 * queryStringToObject('?id=1&name=전상욱');
 * // {id: 1, name: '전상욱'}
 * queryStringToObject('?animal=lion&animal=tiger');
 * // {animal: ['lion', 'tiger']}
 */
export const queryStringToObject = (string: string): any => {
  const result: any = {};
  let value: string = string;
  if (string[0] === "?") value = value?.replace("?", "");

  const split: string[] = value?.split("&");
  const queryArray: string[] = [];

  split?.forEach((x) => {
    if (x) queryArray.push(x);
  });

  queryArray?.forEach((x) => {
    const [key, value] = x?.split("=")?.map((y) => y ?? "");
    if (result[key] !== null && result[key] !== undefined) {
      if (typeof result[key] === "object") {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  });

  return result;
};

/**
 * @example
 * objectToQueryString({id: 1, name: '전상욱'});
 * // ?id=1&name=전상욱
 * objectToQueryString({id: 1, language: ['js', 'ts']});
 * // ?id=1&language=js&language=ts
 */
export const objectToQueryString = (object: any): string => {
  return QS.create(object);
};

/**
 * @example
 * getSearchHangul('개발자', '갭');
 * // true
 * getSearchHangul('개발자', '개발ㅈ');
 * // true
 * getSearchHangul('개발자', '개밪');
 * // false
 */
export const getSearchHangul = (
  current: string,
  searchText?: string
): boolean => {
  const _current = (current ?? "")?.toLowerCase()?.replace(/ /g, "");
  const _searchText = (searchText ?? "")?.toLowerCase()?.replace(/ /g, "");

  const bool1 = hangulIncludes(_current, _searchText);
  const bool2 = chosungIncludes(_current, _searchText);

  let txtArr: string[] = disassembleHangul(_searchText)?.split("");
  txtArr = txtArr?.map(
    (x) => keyPositions[x as keyof typeof keyPositions] ?? ""
  );
  const join = txtArr?.join("");
  const bool3 = hangulIncludes(_current, join || _searchText);

  return bool1 || bool2 || bool3;
};

/**
 * @example
 * getLastTime(new Date('2023-01-01'));
 * // 4일전
 * getLastTime(new Date('2023-01-04'));
 * // 1일전
 * getLastTime(new Date('2023-01-05 12:30:43'));
 * // 4분전
 * getLastTime(new Date('2023-01-05 12:34:43'));
 * // 53초전
 */
export const getLastTime = (date: Date): string => {
  const test = getDateDistance(date, new Date());
  if (test?.days) return test?.days + "일";
  if (test?.hours) return test?.hours + "시간";
  if (test?.minutes) return test?.minutes + "분";
  if (test?.seconds) return test?.seconds + "초";
  return "방금전";
};

/**
 * @example
 * getIsImage('png');
 * // true
 * getIsImage('.bmp');
 * // true
 * getIsImage('mp3');
 * // false
 */
export const getIsImage = (ext: string = ""): boolean => {
  const lower = ext?.replace(/\./g, "")?.toLowerCase();
  const search = lower?.search(
    /(png|svg|jpg|jpeg|svg|webp|bmp|gif|rle|tiff|tif|exif|raw)/g
  );
  return search > -1;
};

/**
 * @example
 * getAge(new Date('1998-01-01'));
 * // 26
 */
export const getAge = (birthDay: Date): number => {
  const now = new Date();
  const year = now?.getFullYear();
  const birthYear = birthDay?.getFullYear();
  if (birthYear >= year) return 0;
  const result = year - birthYear + 1;
  return result;
};

/**
 * @example
 * const nowYear = useMemo(() => {
 *   const date = new Date();
 *   return date.getFullYear();
 * });
 * // 2025
 */
export const useMemo = <T = any>(callback: () => T) => {
  const result: T = callback();
  return result;
};

/**
 * @example
 * downloadExcel(
 *   ['일련번호', '이름', '나이'],
 *   [[1, '홍길동', 26], [2, '이순신', 28]]
 *   'excel',
 * );
 * // boolean
 */
export const downloadExcel = async (
  titles: Array<string>,
  rows: Array<Array<string | number>>,
  filename: string
): Promise<{ result: boolean; message: string }> => {
  try {
    if (!rows?.length) {
      return { result: false, message: "데이터가 존재하지 않습니다." };
    }
    if (titles?.length !== rows?.[0]?.length) {
      return {
        result: false,
        message: "타이틀과 데이터의 수가 일치하지 않습니다.",
      };
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet();

    rows.unshift(titles);

    rows?.forEach((row) => {
      worksheet.addRow(row).commit();
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, filename + ".xlsx");
    return { result: true, message: "다운로드가 완료되었습니다." };
  } catch {
    return { result: false, message: "다운로드에 실패하였습니다." };
  }
};

/**
 * @example
 * c({ active: true, readonly: true });
 * // 'active readonly'
 */
export const c = (classObject: { [className: string]: any }) => {
  const result: string[] = [];
  Object.entries(classObject)?.forEach(([key, value]) => {
    if (value) result.push(key);
  });
  return result.join(" ");
};

/**
 * @example
 * range(3);
 * // [0, 1, 2]
 */
export const range = (count: number) => {
  return Array(count)
    .fill(0)
    .map((_, i) => i);
};

export const dateFormat = (dateString: string) => {
  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return "0000년 00월 00일"; // 날짜 형식이 잘못된 경우
  }

  // 날짜의 각 부분을 변수에 저장
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.
  const day = date.getDate();

  // 변환된 날짜를 반환
  return `${year}년 ${month}월 ${day}일`;
};
