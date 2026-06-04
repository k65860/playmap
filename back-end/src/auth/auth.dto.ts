import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class GetAllMemberDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ title: '추천인 코드', example: 'GTNJV9EMYEO3' })
  USR_JOIN_CD?: string;
}

export class SigninDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 아이디' })
  USR_ID: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 비밀번호' })
  USR_PW: string;
}

export class SignupDto extends SigninDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 비밀번호 확인' })
  USR_PW_CFM: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ title: '사용자 구분' })
  @Type(() => Number)
  USR_TP: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ title: '사용자 이름' })
  USR_NM?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 연락처' })
  USR_NO: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ title: '사용자 이메일' })
  USR_MAIL: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 주소' })
  USR_ADDR: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ title: '사용자 상세주소' })
  USR_ADDR_DTL?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ title: '관리자 가입 코드' })
  ADM_JOIN_CD?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ title: '사용자 자녀 수' })
  USR_CHILD_CNT?: number;
}

export class GetOneAuthDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ title: '사용자 고유번호', example: 597 })
  @Type(() => Number)
  USR_SQ: number;
}

export class FindIdDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ title: '사용자 이메일', example: 'jsw9330@icloud.com' })
  USR_MAIL: string;

  @IsNotEmpty()
  @IsPhoneNumber('KR')
  @ApiProperty({ title: '사용자 연락처', example: '010-0001-0002' })
  USR_NO: string;
}

export class FindPwDto extends FindIdDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 아이디' })
  USR_ID: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ title: '사용자 고유번호' })
  USR_SQ: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 기존 비밀번호' })
  USR_PW: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 신규 비밀번호' })
  NEW_USR_PW: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 신규 비밀번호 확인' })
  NEW_USR_PW_CFM: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ title: '사용자 이름' })
  USR_NM?: string;

  @IsOptional()
  @IsPhoneNumber('KR')
  @ApiProperty({ title: '사용자 연락처' })
  USR_NO?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ title: '사용자 이메일' })
  USR_MAIL?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ title: '사용자 주소' })
  USR_ADDR?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ title: '사용자 상세주소' })
  USR_ADDR_DTL?: string;
}

export class DuplicateIdCheckDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '사용자 아이디' })
  USR_ID: string;
}
