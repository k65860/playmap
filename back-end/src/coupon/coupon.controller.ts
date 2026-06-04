import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOneAuthDto } from 'src/auth/auth.dto';
import { GiveCouponDto } from './coupon.dto';

@Controller('coupon')
@ApiTags('쿠폰 모듈')
export class CouponController {
  constructor(private service: CouponService) {}

  @Get()
  @ApiOperation({
    summary: '사용자 보유 쿠폰 전체 조회',
    description: `
    - CRT_DT (쿠폰 생성일시) 값 : 구매일시
    - USE_CPN_SQ(쿠폰 사용이력 고유번호), USE_CPN_DT(쿠폰 사용일시) 항목이 null값이 아니면 사용한 쿠폰
    `,
  })
  public getAllUserCoupon(@Query() { USR_SQ }: GetOneAuthDto) {
    return this.service.getAllUserCoupon(USR_SQ);
  }

  @Post()
  @ApiOperation({
    summary: '사용자 쿠폰 무료 발급',
    description: `
    - 관리자 사용
    `,
  })
  public createUserFreeCoupon(@Body() { USR_SQ }: GetOneAuthDto) {
    return this.service.createUserFreeCoupon(USR_SQ);
  }

  @Post('give')
  @ApiOperation({ summary: '사용자 쿠폰 양도' })
  public giveCoupon(@Body() body: GiveCouponDto) {
    return this.service.giveCoupon(body);
  }
}
