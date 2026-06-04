import { Injectable } from '@nestjs/common';
import { send } from 'asset/functions';
import { CommonDao } from './common.dao';

@Injectable()
export class CommonService {
  constructor(private readonly commonDao: CommonDao) {}

  public async getAllCode() {
    const { data } = await this.commonDao.getAllCode();
    return send.success(data ?? []);
  }

  public async getOneCode(CC_GRP: string) {
    const { data } = await this.commonDao.getAllCode(CC_GRP);
    return send.success(data ?? []);
  }

  public async getAllReview() {
    const { data } = await this.commonDao.getAllReview();
    return send.success(data ?? []);
  }
}
