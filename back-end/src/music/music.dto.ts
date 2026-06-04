import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetAllMusicDto {
  @IsNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({ description: '캐릭터 고유번호 리스트' })
  @Type(() => Number)
  CHAR_SQ: number[];
}
