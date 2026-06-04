import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetAllExchangeDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '회원 고유번호' })
  USR_SQ: number;
}

export class GetOneExchangeHistoryDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '추천인 상품 교환 이력 고유번호' })
  ECHIS_SQ: number;
}

export class ExecExchangeDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '회원 고유번호' })
  USR_SQ: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '추천인 교환 상품 고유번호' })
  ECITM_SQ: number;
}
