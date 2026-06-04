import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetOneCodeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '분류 코드', example: 'USR_TP' })
  CC_GRP: string;
}

export class GetDownloadDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '다운로드 코드', example: 1 })
  EXL_DOWN_TP: number;
}
