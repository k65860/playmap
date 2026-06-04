import { Logger } from '@nestjs/common';
import config from 'asset/config';
import { Request, Response, NextFunction } from 'express';

let ignorePaths = [
  'swagger-ui-init.js',
  'favicon-32x32.png',
  'swagger-ui.css',
  'swagger-ui-bundle.js',
  'swagger-ui-standalone-preset.js',
  'swagger-ui-init.js',
  'favicon-32x32.png',
  'favicon.ico',
];
ignorePaths = ignorePaths?.map((x) => config.SERVER.API.BASE_PATH + '/' + x);
ignorePaths = [...ignorePaths, config.SERVER.API.BASE_PATH];

export const loggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req?.ip;
  const startTime = Date.now();
  const logger = new Logger(ip);
  const isApi = req?.path?.startsWith(config.SERVER.API.BASE_PATH);
  const isIgnore = ignorePaths.includes(req?.path);
  const getPath = (s: string) => req?.method + ' ' + s + ' ' + req?.url;

  if (isApi && !isIgnore) {
    logger.debug(getPath('🟠') + ' (0ms)');
  }

  const onFinish = () => {
    const duration = Date.now() - startTime;
    if (isApi && !isIgnore) {
      logger.debug(getPath('🟢') + ' (' + duration + 'ms)');
    }
    cleanup();
  };

  const onClose = () => {
    const duration = Date.now() - startTime;
    logger.debug(getPath('🔴') + ' (' + duration + 'ms)');
    cleanup();
  };

  const cleanup = () => {
    res.removeListener('finish', onFinish);
    res.removeListener('close', onClose);
  };

  // 이벤트 리스너 추가
  res.on('finish', onFinish); // 요청이 완료된 후 호출
  res.on('close', onClose); // 연결이 끊긴 경우 호출

  next();
};
