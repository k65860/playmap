import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOneAuthDto } from 'src/auth/auth.dto';
import { GetOneProfileDto, UpdateProfileDto } from './profile.dto';

@Controller('profile')
@ApiTags('프로필 모듈')
export class ProfileController {
  constructor(private service: ProfileService) {}

  @Get()
  @ApiOperation({ summary: '프로필 전체 조회' })
  public getAllProfile(@Query() { USR_SQ }: GetOneAuthDto) {
    return this.service.getAllProfile(USR_SQ);
  }

  @Post()
  @ApiOperation({
    summary: '프로필 생성',
    description: `
    - API 요청전 '자녀 1명을 추가하시겠어요?' 확인창 필요
    `,
  })
  public createProfile(@Body() { USR_SQ }: GetOneAuthDto) {
    return this.service.createProfile(USR_SQ);
  }

  @Put(':PRF_SQ')
  @ApiOperation({ summary: '프로필 이름 수정' })
  public updateProfile(
    @Param() { PRF_SQ }: GetOneProfileDto,
    @Body() { PRF_NM }: UpdateProfileDto,
  ) {
    return this.service.updateProfile(PRF_SQ, PRF_NM);
  }

  @Delete(':PRF_SQ')
  @ApiOperation({ summary: '프로필 삭제' })
  public deleteProfile(@Param() { PRF_SQ }: GetOneProfileDto) {
    return this.service.deleteProfile(PRF_SQ);
  }
}
