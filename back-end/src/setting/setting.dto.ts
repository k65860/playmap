import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOneSettingDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '설정 코드', example: 'ADMIN_JOIN_CODE' })
  SET_GRP: string;
}

export class UpdateSettingDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '설정 값', example: 'ABCDEF' })
  SET_VAL: string;
}
