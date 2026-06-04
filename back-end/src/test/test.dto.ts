import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class GetOneTestDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '분석 종류 고유번호', example: 1 })
  TEST_TP_SQ: number;
}

class TestSubmitItemDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '질문 고유번호', example: 1 })
  TEST_QSTN_SQ: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '답변 고유번호', example: 1 })
  TEST_QSTN_ITM_SQ: number;
}

export class CreateTestSubmitDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '분석 종류 고유번호', example: 1 })
  TEST_TP_SQ: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '프로필 고유번호', example: 1 })
  PRF_SQ: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    description: '분석 항목 리스트',
    example: [
      { TEST_QSTN_SQ: 1, TEST_QSTN_ITM_SQ: 1 },
      { TEST_QSTN_SQ: 2, TEST_QSTN_ITM_SQ: 4 },
    ],
  })
  ITEM_LIST: TestSubmitItemDto[];
}

export class GetOneUserTestDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '분석 결과 고유번호', example: 1 })
  TEST_SQ: number;
}

export class GetOneUserTestOptionDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '관리자 여부', example: 1 })
  IS_ADM: number = 0;
}

export class CreateUserTestReviewDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '분석 결과 리뷰', example: '아주 좋은결과네요~' })
  TEST_RVW: string;
}
