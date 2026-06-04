import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DuplicateIdCheckDto,
  FindIdDto,
  FindPwDto,
  GetAllMemberDto,
  GetOneAuthDto,
  SigninDto,
  SignupDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './auth.dto';
import { Response } from 'express';

@ApiTags('인증 모듈')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('user')
  @ApiOperation({ summary: '사용자(회원) 전체 조회' })
  getAllUser(@Query() query: GetAllMemberDto) {
    return this.service.getAllMember(query);
  }

  @Get('user/:USR_SQ')
  @ApiOperation({ summary: '사용자(회원) 상세 조회' })
  getOneUser(@Param() { USR_SQ }: GetOneAuthDto) {
    return this.service.getOneMember(USR_SQ);
  }

  @Post('signin')
  @ApiOperation({
    summary: '사용자 로그인',
    description: `
      - 회원과 관리자가 모두 로그인이 가능
      - REASON 값이 'SUCCESS'로 응답되면 로그인 성공
      - REASON 값이 'JOIN'으로 응답되면 /api/auth/signup API 호출
      - SNS 로그인일 경우 USR_ID는 SNS측의 고유ID, USR_PW는 ['SNS_KAKAO', 'SNS_NAVER', 'SNS_APPLE', 'SNS_GOOGLE'] 중 하나
    `,
  })
  async signin(@Body() body: SigninDto, @Res() res: Response) {
    return this.service.signin(body, res);
  }

  @Post('signup')
  @ApiOperation({
    summary: '사용자 회원가입',
    description: `
      - USR_TP 값이 1이면 관리자 회원가입 / 2이면 일반 회원가입
      - USR_TP 값이 1이면 USR_NM, ADM_JOIN_CD 값이 필수 (2이면 USR_NM, ADM_JOIN_CD ❌)
      - USR_TP 값이 2이면 USR_CHILD_CNT 값이 필수 (1이면 USR_CHILD_CNT ❌)
    `,
  })
  async signup(@Body() body: SignupDto, @Res() res: Response) {
    return this.service.signup(body, res);
  }

  @Put('user/:USR_SQ')
  @ApiOperation({
    summary: '사용자 수정',
    description: `
    - Body의 모든 항목이 Optional
    - 넘기는 필드만 수정
    - USR_TP가 1(관리자)이면 USR_NM 수정 가능
    - USR_TP가 2(회원)이면 USR_NM 수정 불가능
    - USR_TP가 2(회원)이면 USR_ADDR_DTL 수정 불가능
    `,
  })
  updateUser(@Param() { USR_SQ }: GetOneAuthDto, @Body() body: UpdateUserDto) {
    return this.service.updateUser(USR_SQ, body);
  }

  @Get('logout')
  @ApiOperation({ summary: '사용자 로그아웃' })
  logout(@Res() res: Response) {
    return this.service.logout(res);
  }

  @Delete('signout/:USR_SQ')
  @ApiOperation({
    summary: '사용자 탈퇴',
    description: `
    - API 요청전 '정말 탈퇴하시겠어요?' 확인창 필요
    `,
  })
  signout(@Param() { USR_SQ }: GetOneAuthDto, @Res() res: Response) {
    return this.service.signout(USR_SQ, res);
  }

  @Post('find-id')
  @ApiOperation({ summary: '사용자 아이디 찾기' })
  findId(@Body() body: FindIdDto) {
    return this.service.findId(body);
  }

  @Post('find-pw')
  @ApiOperation({
    summary: '사용자 임시 비밀번호 발급',
    description: `
    - 임시 비밀번호는 이메일로 발송
    `,
  })
  findPw(@Body() body: FindPwDto) {
    return this.service.findPw(body);
  }

  @Put('pw')
  @ApiOperation({
    summary: '사용자 비밀번호 변경',
    description: `
    - 현재 비밀번호 일치 필요
    - 신규 비밀번호와 신규 비밀번호 확인 일치 필요
    - 신규 비밀번호는 4자리 이상
    - 현재 비밀번호와 신규 비밀번호가 불일치 필요
    - 비밀번호 변경 안내 이메일로 발송
    `,
  })
  updatePassword(@Body() body: UpdatePasswordDto) {
    return this.service.updatePassword(body);
  }

  @Post('duplicate-id-check')
  @ApiOperation({ summary: '아이디 중복 체크' })
  duplicateIdCheck(@Body() body: DuplicateIdCheckDto) {
    return this.service.duplicateIdCheck(body);
  }
}
