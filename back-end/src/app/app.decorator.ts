import {
  applyDecorators,
  createParamDecorator,
  SetMetadata,
} from '@nestjs/common';
import config from 'asset/config';
import * as jwt from 'jsonwebtoken';

/**
 * @name 스케줄러 데코레이터
 * @param seconds
 */
export const Interval = (seconds: number) => {
  const id = 'INTERVAL_DECORATOR';
  let interval: number | NodeJS.Timeout;

  return applyDecorators(
    SetMetadata(id, seconds),
    (_obj: object, _propertyKey: string, descriptor: PropertyDescriptor) => {
      const intervalFn = descriptor.value;

      intervalFn();
      clearInterval(interval);
      interval = setInterval(intervalFn, seconds * 1000);
    },
  );
};

/**
 * @name 토큰보유일련번호 데코레이터
 * @param X
 */
export const User = createParamDecorator((_data, context) => {
  const request = context.switchToHttp().getRequest();
  const token = request?.cookies?.[config.JWT.COOKIE_NAME];
  if (!token) return null;
  const payload = jwt.verify(token, config.JWT.SECRET);
  return payload ?? null;
});
