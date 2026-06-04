import { Injectable } from '@nestjs/common';
import { send } from 'asset/functions';
import { SettingDao } from './setting.dao';
import { WsService } from 'src/ws/ws.service';

@Injectable()
export class SettingService {
  constructor(
    private readonly settingDao: SettingDao,
    private readonly wsService: WsService,
  ) {}

  public async getAllSetting() {
    const { data } = await this.settingDao.getAllSetting();
    return send.success(data ?? []);
  }

  public async updateSetting(SET_GRP: string, SET_VAL: string | number) {
    await this.settingDao.updateSetting(SET_GRP, SET_VAL);
    this.wsService.execAllSend('/api/setting');
    return send.success({ SET_GRP, SET_VAL });
  }
}
