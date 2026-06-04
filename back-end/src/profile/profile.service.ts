import { Injectable } from '@nestjs/common';
import { send } from 'asset/functions';
import { ProfileDao } from './profile.dao';
import { CommonDao } from 'src/common/common.dao';
import { randomPick } from 'asset/utils';
import { WsService } from 'src/ws/ws.service';
import config from 'asset/config';
import * as moment from 'moment';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileDao: ProfileDao,
    private readonly commonDao: CommonDao,
    private readonly wsService: WsService,
  ) {}

  public async generateProfileName(length: number) {
    const result: string[] = [];
    // var { data } = await this.commonDao.getAllProfileCharacter();
    // const charStatuses: string[] = data?.map((v) => v?.PRF_STTS_NM);
    // const characters: string[] = data?.map((v) => v?.PRF_CHAR_NM);

    // if (!charStatuses?.length || !characters?.length) return [];

    for (let i = 0; i < length; i++) {
      // let resultChar = randomPick(charStatuses);
      // resultChar += ' ' + randomPick(characters);
      // result.push(resultChar);
      result.push('자녀의 이름으로 변경해주세요.');
    }

    return result;
  }

  public async getAllProfile(USR_SQ: number) {
    const { data } = await this.profileDao.getAllProfile(USR_SQ);
    return send.success(data ?? []);
  }

  public async createProfile(USR_SQ: number) {
    const charactersNames = await this.generateProfileName(1);

    if (!charactersNames?.length) {
      throw Error('캐릭터 생성에 실패했어요.');
    }

    let PRF_NM = charactersNames?.[0];
    PRF_NM += `\n(${moment().format(config.FORMAT.DATETIME)})`;

    const { data } = await this.profileDao.createProfile(USR_SQ, PRF_NM);

    this.wsService.execAllSend('/api/profile?USR_SQ=' + USR_SQ);

    return send.success(data ?? []);
  }

  public async updateProfile(PRF_SQ: number, PRF_NM: string) {
    const { data: users } = await this.profileDao.getOneProfile(PRF_SQ);

    if (!users?.length) {
      throw new Error('존재하지 않는 프로필입니다.');
    }

    const USR_SQ = users?.[0]?.USR_SQ;
    const { data: profiles } = await this.profileDao.getAllProfile(USR_SQ);

    if (profiles?.find((x) => x?.PRF_NM === PRF_NM)) {
      throw new Error('중복된 프로필 이름입니다.');
    }

    await this.profileDao.updateProfile(USR_SQ, PRF_SQ, PRF_NM);

    this.wsService.execAllSend('/api/profile?USR_SQ=' + USR_SQ);
    return send.success();
  }

  public async deleteProfile(PRF_SQ: number) {
    const { data: users } = await this.profileDao.getOneProfile(PRF_SQ);
    if (!users?.length) {
      throw new Error('존재하지 않는 프로필입니다.');
    }
    const USR_SQ = users?.[0]?.USR_SQ;

    await this.profileDao.deleteProfile(USR_SQ, PRF_SQ);
    this.wsService.execAllSend('/api/profile?USR_SQ=' + USR_SQ);
    return send.success();
  }
}
