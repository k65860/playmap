import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetDelayResponseDto {
  @ApiProperty({ description: '딜레이 시간 (ms단위)' })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  ms: number;
}
