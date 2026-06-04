import { Injectable } from '@nestjs/common';
import { send } from 'asset/functions';
import { CouponDao } from './coupon.dao';
import { WsService } from 'src/ws/ws.service';
import { GiveCouponDto } from './coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponDao: CouponDao,
    private readonly wsService: WsService,
  ) {}

  public async getAllUserCoupon(USR_SQ: number) {
    const { data } = await this.couponDao.getAllUserCoupon(USR_SQ);
    return send.success(data ?? []);
  }

  public async createUserFreeCoupon(USR_SQ: number) {
    await this.couponDao.createUserCoupon(3, USR_SQ, 0);
    this.wsService.execAllSend(`/coupon?USR_SQ=${USR_SQ}`);
    return send.success();
  }

  public async giveCoupon({ USR_SQ, TG_USR_SQ, CNT }: GiveCouponDto) {
    const { data: userCoupons = [] } =
      await this.couponDao.getAllUserCoupon(USR_SQ);
    const remainCoupon = userCoupons.filter((coupon) => !coupon.USE_CPN_SQ);

    if (CNT > remainCoupon?.length || !remainCoupon?.length) {
      throw Error('보유한 쿠폰이 부족합니다.');
    }

    let USR_CPN_SQ_LIST = remainCoupon?.map((x) => x?.USR_CPN_SQ);
    USR_CPN_SQ_LIST = USR_CPN_SQ_LIST.slice(0, CNT);

    await this.couponDao.giveCoupon(TG_USR_SQ, USR_CPN_SQ_LIST);

    this.wsService.execAllSend(`/coupon?USR_SQ=${USR_SQ}`);
    return send.success();
  }
}
