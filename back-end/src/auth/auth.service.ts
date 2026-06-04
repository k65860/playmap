import { Injectable } from '@nestjs/common';
import { AuthDao } from './auth.dao';
import {
  DuplicateIdCheckDto,
  FindIdDto,
  FindPwDto,
  GetAllMemberDto,
  SigninDto,
  SignupDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './auth.dto';
import { User } from './auth.interface';
import { send } from 'asset/functions';
import config from 'asset/config';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { SettingDao } from 'src/setting/setting.dao';
import { Setting } from 'src/setting/setting.interface';
import { WsService } from 'src/ws/ws.service';
import { ProfileDao } from 'src/profile/profile.dao';
import { ProfileService } from 'src/profile/profile.service';
import { CouponDao } from 'src/coupon/coupon.dao';
import { generateCode } from 'asset/utils';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDao: AuthDao,
    private readonly wsService: WsService,
    private readonly profileService: ProfileService,
    private readonly profileDao: ProfileDao,
    private readonly settingDao: SettingDao,
    private readonly couponDao: CouponDao,
    private readonly mailService: MailService,
  ) {}

  /** 신규 토큰 생성 */
  private createToken(payload: any) {
    const options: jwt.SignOptions = { expiresIn: config.JWT.EXPIRE };
    const token = jwt.sign(payload, config.JWT.SECRET, options);
    return token;
  }

  // 사용자 전체 조회
  public async getAllMember(query: GetAllMemberDto) {
    const { data } = await this.authDao.getAllMember(0, query);
    const result = data?.map((x) => {
      const { USR_PW, USR_NM, USR_ADDR_DTL, ...rest } = x;
      return rest;
    });
    return send.success(result);
  }

  // 사용자 상세 조회
  public async getOneMember(USR_SQ: number) {
    const { data: users } = await this.authDao.getAllMember(USR_SQ);
    if (!users?.length) {
      throw Error('존재하지 않는 사용자입니다.');
    }
    const { USR_PW, ...result } = users?.[0];

    const { data: USR_JOIN_HISTORY } =
      await this.couponDao.getUserCouponJoinHistory(USR_SQ);

    result.USR_JOIN_HISTORY = USR_JOIN_HISTORY ?? [];

    return send.success(result);
  }

  /** 로그인 */
  public async signin(body: SigninDto, res: Response) {
    res.clearCookie(config.JWT.COOKIE_NAME);
    const { data } = await this.authDao.signin(body?.USR_ID, body?.USR_PW);

    const user: User = data?.[0];
    if (!user) {
      const SNS_LIST = config.SNS_LOGIN_TYPE as unknown as string[];
      if (!SNS_LIST?.includes(body?.USR_PW)) {
        throw Error('일치하는 사용자가 없어요.');
      }
      const result = { REASON: 'JOIN', ...body };
      return res.json(send.success(result));
    }

    const token = this.createToken(user);
    res.cookie(config.JWT.COOKIE_NAME, token);

    user[config.JWT.COOKIE_NAME] = token;
    const { USR_PW: _, ...rest } = user;
    const result = { REASON: 'SUCCESS', ...rest };

    await this.authDao.successSignin(result?.USR_SQ);

    return res.json(send.success(result));
  }

  /** 회원가입 */
  public async signup(body: SignupDto, res: Response) {
    if (body?.USR_PW !== body?.USR_PW_CFM) {
      throw Error('비밀번호가 일치하지 않아요.');
    }

    var { data: users } = await this.authDao.signin(body?.USR_ID, body?.USR_PW);
    const user: User = users?.[0];
    if (user) {
      throw Error('이미 존재하는 아이디예요. 로그인을 진행해주세요.');
    }

    if (body?.USR_TP === 1) {
      // 관리자
      if (!body?.USR_NM) {
        throw Error('사용자 이름을 입력해주세요.');
      }
      if (!body?.ADM_JOIN_CD) {
        throw Error('관리자 가입 코드를 입력해주세요.');
      }

      var { data } = await this.settingDao.getAllSetting('ADM_JOIN_CD');
      const setting: Setting = data?.[0];
      if (!setting) {
        throw Error('관리자 가입 코드를 설정해주세요.');
      }
      if (setting?.SET_VAL !== body?.ADM_JOIN_CD) {
        throw Error('관리자 가입 코드가 일치하지 않아요.');
      }
    } else if (body?.USR_TP === 2) {
      // 회원
      if (!body?.USR_CHILD_CNT) throw Error('자녀는 1명 이상이어야 해요.');
    } else {
      throw Error('사용자 타입을 확인해주세요.');
    }

    // 회원가입
    var {
      data: [, , [{ USR_SQ }]],
    } = await this.authDao.signup(body);

    if (body?.USR_TP === 2) {
      const charactersNames = await this.profileService.generateProfileName(
        body?.USR_CHILD_CNT ?? 0,
      );

      if (!charactersNames?.length) {
        throw Error('캐릭터 생성에 실패했어요.');
      }

      // 프로필 생성
      for (let i = 0; i < body?.USR_CHILD_CNT; i++) {
        await this.profileDao.createProfile(USR_SQ, charactersNames[i]);
      }
    }

    this.wsService.execAllSend('/api/member');

    return this.signin(body, res);
  }

  // 사용자 수정
  public async updateUser(USR_SQ: number, body: UpdateUserDto) {
    await this.authDao.updateUser(USR_SQ, body);
    this.wsService.execAllSend('/api/auth/user/' + USR_SQ);
    return send.success();
  }

  /** 로그아웃 */
  public async logout(res: Response) {
    res.clearCookie(config.JWT.COOKIE_NAME);
    return res.json(send.success());
  }

  /** 회원탈퇴 */
  public async signout(USR_SQ: number, res: Response) {
    res.clearCookie(config.JWT.COOKIE_NAME);

    await this.authDao.signout(USR_SQ);
    this.wsService.execAllSend('/api/member');

    return res.json(send.success());
  }

  /** 아이디 찾기 */
  public async findId({ USR_MAIL, USR_NO }: FindIdDto) {
    const { data } = await this.authDao.findId(USR_MAIL, USR_NO);
    if (!data?.length) {
      throw Error('일치하는 사용자가 없어요.');
    }

    const REASON = data?.map(({ IS_SNS_KAKAO, USR_ID }) => {
      if (IS_SNS_KAKAO) {
        return 'SNS(KAKAO)로 가입된 계정입니다.';
      }
      return '아이디는 [' + USR_ID + '] 입니다.';
    });

    return send.success({ USR_MAIL, USR_NO, ID_CNT: data?.length, REASON });
  }

  /** 비밀번호 찾기 */
  public async findPw({ USR_MAIL, USR_NO, USR_ID }: FindPwDto) {
    const { data } = await this.authDao.findId(USR_MAIL, USR_NO);
    if (!data?.length) {
      throw Error('일치하는 사용자가 없어요.');
    }

    const findUser = data?.find((x) => x?.USR_ID === USR_ID);
    if (!findUser) {
      throw Error('일치하는 사용자가 없어요.');
    }

    const USR_PW = generateCode(6);
    await this.authDao.updatePassword(findUser?.USR_SQ, USR_PW);

    const { data: settings } =
      await this.settingDao.getAllSetting('GLOBAL_HELP_NO');
    const setting = settings?.[0];

    const html = `
    임시 비밀번호가 발급되어 아래 비밀번호로 로그인이 가능합니다.<br />
    <b style="color: #ff2626;">로그인 후에는 반드시 비밀번호를 변경하여 주시길 바랍니다.</b><br />
    <b style="color: #ff2626;">본인이 아니라면 <a href="tel:${setting?.SET_VAL}">고객센터</a>에 문의바랍니다.</b>

    <h3 style="font-size: 13px;padding-bottom: 10px;margin-top: 50px;">임시 비밀번호</h3>
    <p style="font-size: 22px;font-weight: 700;letter-spacing: 2px;">${USR_PW}</p>
    `;

    // 이메일 전송
    this.mailService.send(findUser?.USR_MAIL, '임시 비밀번호 발급', html);

    return send.success();
  }

  /** 비밀번호 변경 */
  public async updatePassword({
    USR_SQ,
    USR_PW,
    NEW_USR_PW,
    NEW_USR_PW_CFM,
  }: UpdatePasswordDto) {
    if (NEW_USR_PW !== NEW_USR_PW_CFM) {
      throw Error('비밀번호가 일치하지 않아요.');
    }
    if (NEW_USR_PW?.length < 4) {
      throw Error('비밀번호는 4자리 이상이어야 해요.');
    }
    if (USR_PW === NEW_USR_PW) {
      throw Error('이전 비밀번호와 동일해요.');
    }

    const { data: users } = await this.authDao.pwCheck(USR_SQ, USR_PW);

    if (!users?.length) {
      throw Error('비밀번호가 일치하지 않아요.');
    }

    const { USR_MAIL } = users?.[0];

    const { data: settings } =
      await this.settingDao.getAllSetting('GLOBAL_HELP_NO');
    const setting = settings?.[0];

    const html = `<br />
    비밀번호가 변경되었습니다.<br />
    <b style="color: #ff2626;">본인이 아니라면 <a href="tel:${setting?.SET_VAL}">고객센터</a>에 문의바랍니다.</b>
    `;

    // 이메일 전송
    this.mailService.send(USR_MAIL, '비밀번호 변경', html);

    await this.authDao.updatePassword(USR_SQ, NEW_USR_PW);
    return send.success();
  }

  public async duplicateIdCheck({ USR_ID }: DuplicateIdCheckDto) {
    const {
      data: [{ CNT }],
    } = await this.authDao.getDuplicateId(USR_ID);

    if (CNT) throw Error('이미 존재하는 아이디예요.');
    return send.success();
  }
}
