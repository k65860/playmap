import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GiveCouponDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '회원 고유번호 (주는 사람)' })
  USR_SQ: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '회원 고유번호 (받는 사람)' })
  TG_USR_SQ: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '양도 쿠폰 수' })
  CNT: number;
}
