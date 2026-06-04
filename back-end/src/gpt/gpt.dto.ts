import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class GetAllGptHistoryDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ description: '프로필 고유번호' })
  PRF_SQ?: number;
}

export class GetOneGptHistoryDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ description: 'GPT 채팅 고유번호' })
  GPT_SQ: number;
}

export class CreateGptDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'GPT 메시지' })
  GPT_CN: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'GPT 참고 메시지 (저장되지 않음)' })
  GPT_REF_CN?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ description: '프로필 고유번호' })
  PRF_SQ: number;
}
