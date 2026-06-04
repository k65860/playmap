import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import config from 'asset/config';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token = request.cookies?.[config.JWT.COOKIE_NAME];

    try {
      const payload = jwt.verify(token, config.JWT.SECRET);
      const { exp, iat, ...user } = payload as any;
      const options: jwt.SignOptions = { expiresIn: config.JWT.EXPIRE };
      const refreshToken = jwt.sign(user, config.JWT.SECRET, options);

      response.cookie(config.JWT.COOKIE_NAME, refreshToken);

      return true;
    } catch {
      if ('user' in request) delete request.user;
      response.clearCookie(config.JWT.COOKIE_NAME);
      return false;
    }
  }
}
