import { Injectable } from '@nestjs/common';
import { BillDao } from './bill.dao';
import { send } from 'asset/functions';
import { CreateBillDto } from './bill.dto';
import axios, { AxiosInstance } from 'axios';
import config from 'asset/config';
import { SettingDao } from 'src/setting/setting.dao';
import { AuthDao } from 'src/auth/auth.dao';
import { generateCode } from 'asset/utils';
import * as sha256 from 'sha256';
import * as moment from 'moment';
import { WsService } from 'src/ws/ws.service';
import { CouponDao } from 'src/coupon/coupon.dao';

// ! 결제선생 API 주소 & 키
// http://stg.paymint.co.kr:10200   TEST-API-KEY-TALK
// https://erp-api.payssam.kr       KSLDPFFMVMTSJFFP

let http: AxiosInstance;
let PAYMENT_URL: string;
let PAYMENT_KEY: string;
let PAYMENT_CALLBACK_URL: string;
let PAYMENT_JOIN_URL: string;
let PAYMENT_MEMBER: string;
let PAYMENT_MERCHANT: string;
let PAYMENT_BILL_EXPIRE_DAY: number;
let PAYMENT_BILL_MSG: string;

@Injectable()
export class BillService {
  constructor(
    private readonly billDao: BillDao,
    private readonly settingDao: SettingDao,
    private readonly authDao: AuthDao,
    private readonly wsService: WsService,
    private readonly couponDao: CouponDao,
  ) {
    this.init();
  }

  // 초기화
  private async init() {
    const { data: settings } = await this.settingDao.getAllSetting();
    PAYMENT_URL = settings?.find((x) => x?.SET_GRP === 'PAYMENT_URL')?.SET_VAL;
    PAYMENT_KEY = settings?.find((x) => x?.SET_GRP === 'PAYMENT_KEY')?.SET_VAL;
    PAYMENT_CALLBACK_URL = settings?.find(
      (x) => x?.SET_GRP === 'PAYMENT_CALLBACK_URL',
    )?.SET_VAL;
    PAYMENT_JOIN_URL = settings?.find(
      (x) => x?.SET_GRP === 'PAYMENT_JOIN_URL',
    )?.SET_VAL;
    PAYMENT_MEMBER = settings?.find(
      (x) => x?.SET_GRP === 'PAYMENT_MEMBER',
    )?.SET_VAL;
    PAYMENT_MERCHANT = settings?.find(
      (x) => x?.SET_GRP === 'PAYMENT_MERCHANT',
    )?.SET_VAL;
    PAYMENT_BILL_EXPIRE_DAY = Number(
      settings?.find((x) => x?.SET_GRP === 'PAYMENT_BILL_EXPIRE_DAY')
        ?.SET_VAL ?? 0,
    );
    PAYMENT_BILL_MSG = settings?.find(
      (x) => x?.SET_GRP === 'PAYMENT_BILL_MSG',
    )?.SET_VAL;

    if (
      !PAYMENT_URL ||
      !PAYMENT_KEY ||
      !PAYMENT_CALLBACK_URL ||
      !PAYMENT_JOIN_URL ||
      !PAYMENT_MEMBER ||
      !PAYMENT_MERCHANT ||
      !PAYMENT_BILL_MSG ||
      (PAYMENT_BILL_EXPIRE_DAY !== 0 && !PAYMENT_BILL_EXPIRE_DAY)
    ) {
      console.error({
        PAYMENT_URL,
        PAYMENT_KEY,
        PAYMENT_CALLBACK_URL,
        PAYMENT_JOIN_URL,
        PAYMENT_MEMBER,
        PAYMENT_MERCHANT,
        PAYMENT_BILL_EXPIRE_DAY,
      });
      throw Error('결제선생을 초기화 할 수 없어요.');
    }

    http = axios.create({ baseURL: PAYMENT_URL, timeout: 2000 });
    http.interceptors.request.use(
      (req) => {
        req.data = { ...(req?.data ?? {}), apikey: PAYMENT_KEY };
        return req;
      },
      (e) => e,
    );
    http.interceptors.response.use(
      (e) => e,
      (e) => e,
    );
  }

  // 청구서 전체 조회
  public async getAllBill(USR_SQ: number) {
    const { data: bills } = await this.billDao.getAllBill(USR_SQ);
    return send.success(bills);
  }

  // 청구서 요청
  public async createBill({
    USR_SQ,
    BILL_CPN_CNT,
    USR_JOIN_CD,
  }: CreateBillDto) {
    const { data: settings } = await this.settingDao.getAllSetting('CPN_PRC');
    let CPN_PRC: number = Number(settings?.[0]?.SET_VAL ?? 0);

    if (CPN_PRC !== 0 && !CPN_PRC) throw Error('쿠폰 금액을 확인할 수 없어요.');

    const { data: users } = await this.authDao.getAllMember(USR_SQ);

    if (!users?.length) throw Error('존재하지 않는 회원이예요.');

    let { USR_NO, USR_ID } = users?.[0];
    USR_NO = USR_NO?.replaceAll('-', '');
    CPN_PRC *= BILL_CPN_CNT;

    if (!USR_NO) throw Error('연락처 정보가 없어요.');

    const url = '/if/bill/send';
    const BILL_ID = Date.now() + '_' + generateCode(6, 'number');
    let BILL_NM = config.DEFAULT.NAME + ' 쿠폰 구매';
    if (BILL_CPN_CNT > 1) BILL_NM += ' x' + BILL_CPN_CNT;
    const BILL_MSG = PAYMENT_BILL_MSG;
    const BILL_MBR_NM = '회원 (' + USR_ID + ')';
    const BILL_HASH_STR = BILL_ID + ',' + USR_NO + ',' + CPN_PRC;
    const BILL_HASH = sha256(BILL_HASH_STR);
    const BILL_EXPR_DT = moment()
      .add(PAYMENT_BILL_EXPIRE_DAY, 'days')
      .format('YYYY-MM-DD');

    const form = {
      member: PAYMENT_MEMBER,
      merchant: PAYMENT_MERCHANT,
      bill: {
        bill_id: BILL_ID,
        product_nm: BILL_NM,
        message: BILL_MSG,
        member_nm: BILL_MBR_NM,
        phone: USR_NO,
        price: CPN_PRC,
        hash: BILL_HASH,
        expire_dt: BILL_EXPR_DT,
        callbackURL: PAYMENT_CALLBACK_URL,
      },
    };

    const { data: res } = await http.post(url, form);

    if (res?.code !== '0000') {
      let msg = config.PAYMINT.ERROR[res?.code];
      msg ||= res?.message;
      msg ||= '청구서 전송을 실패했어요.';
      throw Error(msg);
    }

    let JOIN_GET_USR_SQ: number = 0;

    // 추천인 코드 입력 시
    if (USR_JOIN_CD) {
      var { data: findCodeUsers } =
        await this.authDao.findByUserJoinCode(USR_JOIN_CD);
      const user = findCodeUsers?.[0];
      JOIN_GET_USR_SQ = user?.USR_SQ ?? 0;

      if (!JOIN_GET_USR_SQ) throw Error('추천인 코드가 잘못되었어요.');
    }

    this.billDao.createBill({
      USR_SQ,
      BILL_ID,
      BILL_MEMBER: PAYMENT_MEMBER,
      BILL_MERCHANT: PAYMENT_MERCHANT,
      BILL_NM,
      BILL_MSG,
      BILL_MBR_NM,
      BILL_PHN_NO: USR_NO,
      BILL_PRC: CPN_PRC,
      BILL_CLBK_URL: PAYMENT_CALLBACK_URL,
      BILL_EXPR_DT,
      BILL_URL: res?.shortURL ?? '',
      BILL_CPN_CNT,
      JOIN_GET_USR_SQ,
    });

    this.wsService.execAllSend('/api/bill?USR_SQ=' + USR_SQ);

    return send.success();
  }

  // 청구서 응답
  public async responseBill(body: any) {
    if (body?.appr_state !== 'F') return send.success();

    /** 결제완료 응답 예시
      {
        apikey: 'TEST-API-KEY-TALK',
        bill_id: '1732870197415_492428',
        appr_pay_type: 'CARD_VAN',
        appr_card_type: '신용카드(일반)',
        appr_dt: '20241129175039',
        appr_origin_dt: '20241129175039',
        appr_price: '40000',
        appr_issuer: 'HYUNDAI',
        appr_issuer_cd: '08',
        appr_issuer_num: '404619**********',
        appr_acquirer_cd: '08',
        appr_acquirer_nm: 'HYUNDAI',
        appr_num: '00769951',
        appr_origin_num: '00769951',
        appr_res_cd: null,
        appr_monthly: '0',
        appr_state: 'F'
      }
    */

    const BILL_ID: string = body?.bill_id;

    const { data: bills } = await this.billDao.getAllBill(0, 0, BILL_ID);
    const bill = bills?.[0];

    if (!bill) throw Error('청구서 정보가 없어요.');
    if (bill?.PYMT_SQ) throw Error('이미 결제된 청구서예요.');

    const USR_SQ: number = bill?.USR_SQ;
    const BILL_SQ: number = bill?.BILL_SQ;
    const PYMT_TP: string = body?.appr_pay_type;
    const PYMT_CRD_TP: string = body?.appr_card_type;
    const PYMT_CRD_NM: string = body?.appr_issuer;
    const PYMT_CRD_NO: string = body?.appr_issuer_num;

    await this.billDao.createPayment({
      BILL_SQ,
      PYMT_TP,
      PYMT_CRD_TP,
      PYMT_CRD_NM,
      PYMT_CRD_NO,
    });

    const BILL_CPN_CNT: number = bill?.BILL_CPN_CNT ?? 0;

    for (let i = 0; i < BILL_CPN_CNT; i++) {
      await this.couponDao.createUserCoupon(1, USR_SQ, 0);
    }

    if (bill?.JOIN_GET_USR_SQ) {
      await this.couponDao.createUserCouponJoinHistory(
        USR_SQ,
        bill?.JOIN_GET_USR_SQ,
      );
      this.wsService.execAllSend('/api/auth/user/' + bill?.JOIN_GET_USR_SQ);
    }

    this.wsService.execAllSend('/api/coupon?USR_SQ=' + USR_SQ);
    this.wsService.execAllSend('/api/bill?USR_SQ=' + USR_SQ);

    return send.success();
  }

  // 청구서 파기
  public async deleteBill(BILL_SQ: number) {
    const { data: bills } = await this.billDao.getAllBill(0, BILL_SQ);
    const payment = bills?.[0];
    if (!payment) throw Error('존재하지 않는 청구서예요.');

    const url = '/if/bill/destroy';
    const BILL_HASH_STR = payment?.BILL_ID + ',' + payment?.BILL_PRC;
    const BILL_HASH = sha256(BILL_HASH_STR);
    const form = {
      member: payment?.BILL_MEMBER,
      merchant: payment?.BILL_MERCHANT,
      bill_id: payment?.BILL_ID,
      price: payment?.BILL_PRC,
      hash: BILL_HASH,
    };

    const { data: res } = await http.post(url, form);

    if (res?.code !== '0000') {
      let msg = config.PAYMINT.ERROR[res?.code];
      msg ||= res?.message;
      msg ||= '청구서 파기를 실패했어요.';
      return send.error(msg);
    }

    await this.billDao.deleteBill(payment?.BILL_SQ);

    const USR_SQ: number = payment?.USR_SQ;
    this.wsService.execAllSend('/api/bill?USR_SQ=' + USR_SQ);

    return send.success(null);
  }

  // 결제 취소
  public async deletePayment(PYMT_SQ: number) {
    const { data: payments } = await this.billDao.getAllPayment(0, PYMT_SQ);
    const payment = payments?.[0];
    if (!payment) throw Error('존재하지 않는 결제예요.');

    const { data: bills } = await this.billDao.getAllBill(0, payment?.BILL_SQ);
    const bill = bills?.[0];
    if (!bill) throw Error('존재하지 않는 청구서예요.');

    const url = '/if/bill/cancel';
    const BILL_HASH_STR = bill?.BILL_ID + ',' + bill?.BILL_PRC;
    const BILL_HASH = sha256(BILL_HASH_STR);
    const form = {
      member: bill?.BILL_MEMBER,
      merchant: bill?.BILL_MERCHANT,
      bill_id: bill?.BILL_ID,
      price: bill?.BILL_PRC,
      hash: BILL_HASH,
    };

    const { data: res } = await http.post(url, form);

    if (res?.code !== '0000') {
      let msg = config.PAYMINT.ERROR[res?.code];
      msg ||= res?.message;
      msg ||= '결제 취소를 실패했어요.';
      return send.error(msg);
    }

    await this.billDao.deletePayment(payment?.PYMT_SQ);

    const USR_SQ: number = bill?.USR_SQ;
    this.wsService.execAllSend('/api/bill?USR_SQ=' + USR_SQ);

    return send.success(null);
  }
}
