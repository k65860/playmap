import { Injectable } from '@nestjs/common';
import { ExchangeDao } from './exchange.dao';
import { send } from 'asset/functions';
import { ExecExchangeDto } from './exchange.dto';
import { AuthDao } from 'src/auth/auth.dao';
import { WsService } from 'src/ws/ws.service';
import { SettingDao } from 'src/setting/setting.dao';
import { MailService } from 'src/mail/mail.service';
import { ProfileDao } from 'src/profile/profile.dao';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly dao: ExchangeDao,
    private readonly authDao: AuthDao,
    private readonly settingDao: SettingDao,
    private readonly ws: WsService,
    private readonly mail: MailService,
    private readonly profileDao: ProfileDao,
  ) {}

  public async getAllExchangeItem() {
    const { data } = await this.dao.getAllExchangeItem();
    return send.success(data ?? []);
  }

  public async getAllExchange(USR_SQ: number) {
    const { data } = await this.dao.getAllExchange(USR_SQ);
    return send.success(data ?? []);
  }

  public async execExchange(body: ExecExchangeDto) {
    const { data: exchangeItems } = await this.dao.getAllExchangeItem(
      body?.ECITM_SQ,
    );
    const exchangeItem = exchangeItems?.[0];
    if (!exchangeItem) return send.error('존재하지 않는 상품입니다.');

    const { data: users } = await this.authDao.getAllMember(body?.USR_SQ);
    const user = users?.[0];
    if (!user) return send.error('존재하지 회원입니다.');

    if (user?.USR_JOIN_CNT < exchangeItem?.ECITM_JOIN_CNT) {
      return send.error('추천인 수가 부족합니다.');
    }

    const ECITM_JOIN_CNT = exchangeItem?.ECITM_JOIN_CNT ?? 0;
    await this.dao.execExchange(body, ECITM_JOIN_CNT);

    const { data: settings } =
      await this.settingDao.getAllSetting('MANAGER_EMAIL');

    // 매니저 이메일 있을 경우..
    const managerEmail = settings?.[0]?.SET_VAL;
    if (managerEmail) {
      const { data: profiles } = await this.profileDao.getAllProfile(
        body?.USR_SQ,
      );

      const profileNames = profiles?.map((x) => x?.PRF_NM);
      const html = `<br />
      회원 고유번호 : ${user?.USR_SQ}<br />
      회원의 등록 프로필 이름 : ${profileNames?.join(', ')}<br />
      교환 상품 이름 : ${exchangeItem?.ECITM_NM}<br />
      현재 회원 추천인 등록 수 : ${user?.USR_JOIN_CNT}명<br />
      교환 상품 추천인 차감 수 : ${exchangeItem?.ECITM_JOIN_CNT}명<br />
      `;
      this.mail.send(managerEmail, '추천인 상품 교환 신청', html);
    }

    this.ws.execAllSend('/auth/user/' + body?.USR_SQ);

    return send.success();
  }

  public async execExchangeHistoryCheck(ECHIS_SQ: number) {
    await this.dao.execExchangeHistoryCheck(ECHIS_SQ);
    return send.success();
  }
}
