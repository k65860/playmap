import {
  type ArgumentsHost,
  Catch,
  HttpException,
  ExceptionFilter,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { send } from 'asset/functions';
import type { Response } from 'express';

/** 경로 에러 */
@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  async catch(_: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    return res.json(send.error('유효하지 않은 경로예요.'));
  }
}

/** 파라미터 에러 */
@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  async catch(_: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    return res.json(_.getResponse());
  }
}

/** 인증 에러 */
@Catch(ForbiddenException)
export class AuthFilter implements ExceptionFilter {
  async catch(_: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    return res.json(send.error('토큰이 없어요.'));
  }
}

/** 모든 서버 에러 */
@Catch()
export class ServerErrorFilter implements ExceptionFilter {
  message: string;
  name: string;

  catch(_: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const res = context.getResponse<Response>();
    if (req?.url !== '/') console.log(_?.message);
    return res.json(send.error(_?.message));
  }
}
