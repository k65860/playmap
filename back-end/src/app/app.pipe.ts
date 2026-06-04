import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { send } from 'asset/functions';

/** 파라미터 유효성 검사 */
export class ParamsPipe extends ValidationPipe {
  createExceptionFactory() {
    return (errorList: ValidationError[] = []) => {
      const keys = errorList?.map((e) => e?.property);
      console.error(errorList);
      const message = `파라미터가 잘못됐어요. (${keys?.join(', ')})`;
      return new BadRequestException(send.error(message));
    };
  }
}
