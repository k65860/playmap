import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateBillDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '사용자 고유번호', example: 1 })
  USR_SQ: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ description: '쿠폰 구매 수량', example: 1 })
  BILL_CPN_CNT: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ title: '회원 추천인 코드' })
  USR_JOIN_CD?: string;
}

export class CreatePaymentDto {}

export class GetOneBillDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '청구서 고유번호', example: 1 })
  BILL_SQ: number;
}

export class GetOnePaymentDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '결제 고유번호', example: 1 })
  PYMT_SQ: number;
}
