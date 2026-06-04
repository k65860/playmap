import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetOneProfileDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: '프로필 고유번호', example: 7 })
  @Type(() => Number)
  PRF_SQ: number;
}

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '프로필 이름', example: '홍길동' })
  PRF_NM: string;
}
