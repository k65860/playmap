import { Injectable } from '@nestjs/common';
import { send } from 'asset/functions';
import { delay } from 'asset/utils';

@Injectable()
export class DevService {
  public async getDelayResponse(ms: number) {
    await delay(ms);
    return send.success(true);
  }
}
