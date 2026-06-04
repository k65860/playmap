import config from './config';
import * as moment from 'moment';

/**
 * @description
 * 년 YYYY, 월 MM, 일 DD, 시 hh, 분 mm, 초 ss, 밀리초 SSS
 */
export const getNow = (format: string = config.FORMAT.DATETIME): string => {
  return moment().format(format);
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateCode = (
  length: number,
  type: 'number' | 'string' | 'default' = 'default',
) => {
  let characters = '';

  if (type === 'number') {
    characters = '0123456789';
  } else if (type === 'string') {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  } else {
    characters =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result = result?.toUpperCase();
  return result;
};

export const randomPick = <T = any>(list: Array<T>): T => {
  const result = list[Math.floor(Math.random() * list.length)];
  return (result ?? '') as T;
};
