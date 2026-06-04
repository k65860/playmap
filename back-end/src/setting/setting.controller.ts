import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOneSettingDto, UpdateSettingDto } from './setting.dto';
import { generateCode } from 'asset/utils';

@Controller('setting')
@ApiTags('설정 모듈')
export class SettingController {
  constructor(private service: SettingService) {}

  @Get()
  @ApiOperation({ summary: '설정 전체 조회' })
  public getAllSetting() {
    return this.service.getAllSetting();
  }

  @Post('admin-join-code')
  @ApiOperation({
    summary: '관리자 가입코드 생성',
    description: `
    - API 요청전 '관리자 가입코드를 다시 생성하시겠어요?' 확인창 필요
    - 코드는 대문자(영문)와 숫자로 구성된 6자리값으로 랜덤 생성
    `,
  })
  public generateAdminJoinCode() {
    return this.service.updateSetting('ADM_JOIN_CD', generateCode(6));
  }

  @Put(':SET_GRP')
  @ApiOperation({ summary: '설정 수정' })
  public updateSetting(
    @Param() { SET_GRP }: GetOneSettingDto,
    @Body() { SET_VAL }: UpdateSettingDto,
  ) {
    return this.service.updateSetting(SET_GRP, SET_VAL);
  }
}
